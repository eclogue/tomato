import React from 'react'
import { connect } from 'dva'
import { Page, CodeMirror } from 'components'
import PropTypes from 'prop-types'
import { Icon, Layout, Menu, Typography, Tag, Descriptions } from 'antd'
import { routerRedux } from 'dva/router'
import Yaml from 'yaml'
import { color } from 'utils'
import moment from 'moment'
import styles from './index.less'

const { Title, Paragraph, Text } = Typography

const Index = ({ taskDetail, loading, dispatch, location }) => {
  const currentItem = taskDetail.currentItem || {}
  const job = currentItem.job || {}
  console.log(currentItem, job)
  const codeptions = {
    lineNumbers: false,
    readOnly: true,
    CodeMirror: 'auto',
    viewportMargin: 50,
    theme: 'monokai'
  }

  const logInfo = log => {
    return (
      <Descriptions.Item label="Log">
        <CodeMirror value={log.message || ''} options={codeptions}/>
      </Descriptions.Item>
    )
  }



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

    return (
      <Descriptions.Item label="Queue Info">
        <ul>
         <li><span className={styles.queueItem}>State:</span>{item.state || currentItem.state}</li>
          <li><span className={styles.queueItem}>Unique:</span>{item.unique ? 'true': 'false'}</li>
          <li><span className={styles.queueItem}>Lock:</span>{item.lock ? 'true': 'false'}</li>
          <li><span className={styles.queueItem}>Lock key:</span>{item.lock_key}</li>
          <li><span className={styles.queueItem}>Last enqueue time:</span><span style={{color: color.purple}}>{moment(item.time_last_queued * 1000).format()}</span></li>
        </ul>

        {trace}
      </Descriptions.Item>
    )
  }

  return (
    <Page inner>
      <Paragraph>
        <Descriptions title="Schedule" column={1} size="small" bordered={true}>
          <Descriptions.Item label="Job Name"><Tag>{job.name}</Tag></Descriptions.Item>
          <Descriptions.Item label="Job Type"><Tag>{job.type || 'unkown'}</Tag></Descriptions.Item>
          <Descriptions.Item label="State"><Tag>{currentItem.state}</Tag></Descriptions.Item>
          <Descriptions.Item label="Queue"><Tag>{currentItem.queue}</Tag></Descriptions.Item>
          {currentItem.queue_info ? composeDescription(currentItem.queue_info) : ''}
          {currentItem.log ? logInfo(currentItem.log) : ''}
        </Descriptions>
      </Paragraph>
    </Page>
  )
}

export default connect(({taskDetail, loading, dispatch}) => ({taskDetail, loading, dispatch}))(Index)
