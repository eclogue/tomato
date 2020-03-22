import React from 'react'
import { Spin } from 'antd'
import ReactTerminal, { ReactOutputRenderers } from 'react-terminal-component'
import {
  CommandMapping,
  OutputFactory,
  EmulatorState,
  defaultCommandMapping,
  FileSystem,
  Outputs,
} from 'javascript-terminal'
import { CodeMirror } from 'components'
import styles from './terminal.less'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'
import socket from 'utils/socketio'

const PAPER_TYPE = 'paper'

const createPaperRecord = (title, body) => {
  return new OutputFactory.OutputRecord({
    type: PAPER_TYPE,
    content: {
      title,
      body,
    },
  })
}

export default class Index extends React.Component {
  constructor(props) {
    super(props)
    const commands = props.commands
    const commandMappings = {}
    const fileList = {}
    props.files.map(file => {
      fileList[file.path] = file.is_edit ? { content: file.content } : {}
      return file
    })
    commandMappings['ansible-playbook'] = {
      optDef: {},
      function: (state, opts) => {
        commands['ansible-playbook'](opts)
        this.setState({ acceptInput: false })
        return {
          output: createPaperRecord('ansible run ....'),
        }
      },
    }
    commandMappings['print'] = {
      function: (state, opts) => {
        const userInput = opts.join(' ')
        return {
          output: createPaperRecord('A custom renderer', userInput),
        }
      },
      optDef: {},
    }
    let customState = EmulatorState.create({
      commandMapping: CommandMapping.create({
        ...defaultCommandMapping,
        ...commandMappings,
      }),
      fs: FileSystem.create(fileList),
    })

    this.state = {
      timer: null,
      files: props.files,
      acceptInput: true,
      output: [],
      customState,
      pending: false,
    }
    this.keys = []
    this.socket = socket()
  }

  componentWillReceiveProps(props) {
    const { currentTask, taskState, output } = props
    if (output.length) {
      let customState = this.state.customState
      const defaultOutputs = customState.getOutputs()
      const newOutputs = Outputs.addRecord(
        defaultOutputs,
        createPaperRecord('run result', output)
      )
      this.setState({
        output: output,
        customeState: customState.setOutputs(newOutputs),
      })
    }
    if (currentTask && ['active', 'queued'].includes(taskState)) {
      this.setState({ acceptInput: false })
      if (!this.state.timer) {
        const intervalId = setInterval(async () => {
          this.props.queryRunLog(currentTask)
          clearInterval(this.state.timer)
          this.setState({ timer: null })
        }, 1000)
        this.setState({ timer: intervalId })
      }
    } else {
      if (this.state.timer) {
        clearInterval(this.state.timer)
      }
      this.setState({ acceptInput: true })
    }
  }

  removeKey(current) {
    this.keys = this.keys.filter(item => {
      return item.key !== current.key
    })
  }

  getPaseKey() {
    const compose = []
    this.keys.map(item => {
      if (item.key === 'v') {
        compose.push(item.key)
      } else if (item.metaKey || item.ctrlKey) {
        compose.unshift(item.key)
      }

      return item
    })

    return compose
  }

  componentDidMount() {
    const container = document.getElementById('xterm')
    const term = new Terminal()
    const fitAddon = new FitAddon()
    term.loadAddon(fitAddon)
    term.open(container)
    term.prompt = () => {
      term.write('\r\n$ ')
    }
    term.prompt()
    term.focus()
    fitAddon.fit()
    this.socket.on('playbook', msg => {
      this.setState({ pending: false })
      term.focus()
      term.writeln('')
      const data = msg.result.stdout.split('\n')
      if (msg.code === 0) {
        data.map(item => {
          term.writeln(item)
          return item
        })
        term.prompt()
      } else {
        term.write(msg.message)
      }
    })
    term.attachCustomKeyEventHandler(key => {
      if (key.type === 'keyup') {
        this.removeKey(key)
      } else {
        this.keys.push(key)
      }
    })
    term.onKey(e => {
      const ev = e.domEvent
      const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey
      if (ev.keyCode === 13) {
        this.socket.emit('playbook', {
          book_id: '',
          comd: 'ls -a',
        })
        term.prompt()
        this.setState({ pending: true })
        term.blur()
      } else if (ev.keyCode === 8) {
        // Do not delete the prompt
        if (term._core.buffer.x > 2) {
          term.write('\b \b')
        }
      } else if (printable) {
        term.write(e.key)
      }
    })
    term.onData(data => {
      const keys = this.getPaseKey()
      if (keys.length === 2) {
        term.write(data)
      }
    })
  }

  render() {
    const options = {
      lineNumbers: false,
      readOnly: true,
      CodeMirror: 'auto',
      viewportMargin: 50,
      theme: 'monokai',
    }
    const output = this.state.output
    return (
      <div style={{ textAlign: 'left', display: 'block', marginTop: 20 }}>
        <Spin spinning={this.state.pending}>
          <div id="xterm"></div>
        </Spin>
        <div
          style={{
            height: 380,
            width: '100%',
            background: '#efefef',
            border: '1px solid #ddd',
            marginTop: 10,
            padding: 10,
          }}
        >
          {output.length ? (
            <CodeMirror
              value={output.join('\n')}
              options={options}
              className={styles.codeMirror}
            />
          ) : null}
        </div>
      </div>
    )
  }
}
