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
    }
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
        <Spin spinning={!this.state.acceptInput}>
          <ReactTerminal
            theme={{
              background: '#141313',
              promptSymbolColor: '#6effe6',
              commandColor: '#fcfcfc',
              outputColor: '#fcfcfc',
              errorOutputColor: '#ff89bd',
              fontSize: '0.8rem',
              spacing: '1%',
              fontFamily: 'monospace',
              width: '100%',
              height: '250px',
            }}
            autoFocus={true}
            // clickToFocus={true}
            promptSymbol="$"
            inputStr={this.props.args.join(' ')}
            outputRenderers={{
              ...ReactOutputRenderers,
            }}
            acceptInput={this.state.acceptInput}
            emulatorState={this.state.customState}
          />
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
