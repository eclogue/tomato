import React from 'react'
import Yaml from 'yaml'
import { Resizable } from "re-resizable"
import { CodeMirror } from 'components'
import { Card, Button, Icon } from 'antd'
import styles from './console.less'


class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      content: '',
      title: '',
      visible: false,
      height: 200,
      currentRef: null,
      ...props
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      ...props
    })
  }

  show() {
    this.setState({
      visible: true,
    })
  }

  close() {
    this.setState({
      visible: false,
    })
  }

  resize(...params) {
    const height = params[2].style.height
    this.setState({
      height: height
    })
    // window.scrollTo(0, params[2] + height)
  }

  render() {
    const content = this.state.content
    let codeValue = ''
    if (content) {
      const previewText = typeof content === 'string' ? Yaml.parse(content) : content
      codeValue = Yaml.stringify(previewText) || ''
    }

    const codeOriginOptions = {
      lineNumbers: true,
      readOnly: true,
      CodeMirror: 'auto',
      viewportMargin: 50,
      width: '100%'
    }
    const style = {
      display: "block",
      justifyContent: "left",
      border: "solid 1px #ddd",
      width: '100%'
    }
    const codeOptions = Object.assign({}, codeOriginOptions, this.state.codeOptions || {})
    if (!this.state.visible) {
      return <div>{ codeValue ? <Button type="primary" shape="circle" icon="eye" onClick={this.show.bind(this)}/> : null}</div>
    }

    return (
      <Resizable
        style={style}
        defaultSize={{
          width: '100%',
          height: 280,
        }}
        onResize={this.resize.bind(this)}
      >
        <Card title={this.state.title || 'console'}
          headStyle={{fontSize: 12, fontWeight: 200}}
          bodyStyle={{padding: 0, width: '100%', maxHeight: 250, overflow: 'scroll'}}
          extra={<div onClick={this.close.bind(this)} className={styles.consoleClose}>close</div>}
          >
          <CodeMirror value={codeValue} options={codeOptions} />
        </Card>
      </Resizable>
    )
  }
}


export default Index
