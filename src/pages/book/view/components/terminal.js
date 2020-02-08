import React, { useState } from 'react'
import { Spin } from 'antd'
import ReactTerminal, { ReactOutputRenderers } from 'react-terminal-component'
import {
  CommandMapping,
  OutputFactory,
  EmulatorState,
  defaultCommandMapping,
  FileSystem,
} from 'javascript-terminal'
const PAPER_TYPE = 'paper'

const paperStyles = {
  textAlign: 'left',
  backgroundColor: 'gray',
  color: 'white',
  fontSize: 10,
  padding: '1em',
  margin: '1em 0',
  borderRadius: '0.2em',
}

const createPaperRecord = (title, body) => {
  return new OutputFactory.OutputRecord({
    type: PAPER_TYPE,
    content: {
      title,
      body,
    },
  })
}

export default ({ output = 'xxx', prompt, commands, pending }) => {
  const [acceptInput, setAcceptInpt] = useState(true)
  const commandMappings = {}
  const PaperOutput = ({ content }) => (
    <div style={paperStyles}>
      <h1>{content.title}</h1>
      <Spin spinning={pending} />
      {content.body}
    </div>
  )
  for (const cmd in commands) {
    commandMappings[cmd] = {
      optDef: {},
    }
    commandMappings[cmd]['function'] = (state, opts) => {
      commands[cmd](opts)
      return {
        output: createPaperRecord('ansible run result:', output),
      }
    }
  }
  const customState = EmulatorState.create({
    commandMapping: CommandMapping.create({
      ...defaultCommandMapping,
      ...commandMappings,
    }),
    fs: FileSystem.create({
      '/home': {},
      '/home/README': { content: 'This is a text file' },
      '/home/nested/directory': {},
      '/home/nested/directory/file': { content: 'End of nested directory!' },
    }),
  })

  return (
    <div style={{ textAlign: 'left', display: 'block' }}>
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
          maxHeight: '50vh',
        }}
        autoFocus={false}
        clickToFocus={true}
        promptSymbol="$"
        inputStr=""
        outputRenderers={{
          ...ReactOutputRenderers,
          [PAPER_TYPE]: PaperOutput,
        }}
        acceptInput={acceptInput}
        emulatorState={customState}
      />
    </div>
  )
}
