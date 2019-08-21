import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Page, CodeMirror } from 'components'
import { Descriptions, PageHeader, List, Icon }  from 'antd'
import Yaml from 'yaml'
import styles from './index.css'


const Index = ({ queue, dispatch, location }) => {
  const {list, pagination} = queue
  const {query} = location
  const codeptions = {
    lineNumbers: false,
    readOnly: true,
    CodeMirror: 'auto',
    viewportMargin: 50,
  }

  const IconText = ({ type, text }) => (
    <span>
      <Icon type={type} style={{ marginRight: 8 }} />
      {text}
    </span>
  )

  const composeDescription = item => {
    const executions = item.executions || []
    const trace = executions.map((execution, index) => {
      const traceback = execution.traceback
      const traceString = traceback && typeof traceback == 'object' ? Yaml.stringify(traceback) : traceback
      return <Descriptions title="Executions" key={index} column={1} bordered>
        <Descriptions.Item label="Exception name">{execution.exception_name}</Descriptions.Item>
        <Descriptions.Item label="Host">{execution.host}</Descriptions.Item>
        <Descriptions.Item label="State">{execution.success ? 'true': 'false'}</Descriptions.Item>
        <Descriptions.Item label="Start at">{execution.time_started}</Descriptions.Item>
        <Descriptions.Item label="Failed at">{execution.time_failed}</Descriptions.Item>
        <Descriptions.Item label="Trace">
          <CodeMirror value={traceString} options={codeptions} className={styles.codeMirror}></CodeMirror>
        </Descriptions.Item>
      </Descriptions>

    })

    return <div>
      <p><span>Unique:</span>{item.unique ? 'true': 'false'}</p>
      <p><span>Lock:</span>{item.lock ? 'true': 'false'}</p>
      <p><span>Lock key:</span>{item.lock_key}</p>
      <p><span>Last enqueue time:</span>{item.time_last_queued}</p>
      {trace}
    </div>
  }

  return (
    <Page inner>
    <div>{'Queue name: <' + query.queue + '>'}</div>
      <List
        itemLayout="vertical"
        size="large"
        dataSource={list}
        pagination={{
          onChange: page => {
            dispatch()
          },
          ...pagination
        }}
        renderItem={item => (
          <List.Item
            key={item.id}
            actions={[
              <IconText type="redo" text="retry" />,
              <IconText type="delete" text="cancel" />,
            ]}
          >
            <List.Item.Meta
              title={query.queue}
            />
            {composeDescription(item)}
          </List.Item>
        )}
      />
    </Page>
  )
}

Index.propTypes = {
  queue: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

const component = connect(({ loading, queue, dispatch }) => ({ loading, queue, dispatch }))(Index)

export default component
