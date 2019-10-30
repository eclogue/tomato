import React from 'react'
import { connect } from 'dva'
import { Page, CodeMirror } from 'components'
import PropTypes from 'prop-types'
import { Typography, Tag, Descriptions, Badge } from 'antd'
import { routerRedux } from 'dva/router'
import Yaml from 'yaml'
import { color } from 'utils'
import moment from 'moment'
import styles from './index.less'

const { Paragraph } = Typography

const Index = ({ taskDetail, loading, dispatch, location }) => {
  const currentItem = taskDetail.currentItem || {}
  const job = currentItem.job || {}
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
        <CodeMirror value={log.content || ''} options={codeptions}/>
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
        <Descriptions.Item label="State"><Badge status={execution.success}/>{execution.success ? 'true': 'false'}</Descriptions.Item>
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

  const getBadgeStatus = (state) => {
    if (state === 'finish') {
      return 'success'
    }

    return state
  }

  return (
    <Page inner>
      <Paragraph>
        <Descriptions title="Task Info" column={1} size="small" bordered={true}>
          <Descriptions.Item label="Job Name"><Tag>{job.name}</Tag></Descriptions.Item>
          <Descriptions.Item label="Job Type"><Tag>{job.type || 'unkown'}</Tag></Descriptions.Item>
          <Descriptions.Item label="State"><Badge status={getBadgeStatus(currentItem.state)}/>{currentItem.state}</Descriptions.Item>
          <Descriptions.Item label="Queue">{currentItem.queue}</Descriptions.Item>
          <Descriptions.Item label="Created_at">{moment(currentItem.created_at * 1000).format()}</Descriptions.Item>
          <Descriptions.Item label="Start">{moment(currentItem.start_at * 1000).format()}</Descriptions.Item>
          <Descriptions.Item label="End">{moment(currentItem.finish_at * 1000).format()}</Descriptions.Item>
          <Descriptions.Item label="Duration">{currentItem.duration}</Descriptions.Item>
          {currentItem.queue_info ? composeDescription(currentItem.queue_info) : ''}
          {currentItem.log ? logInfo(currentItem.log) : ''}
        </Descriptions>
      </Paragraph>
    </Page>
  )
}

export default connect(({taskDetail, loading, dispatch}) => ({taskDetail, loading, dispatch}))(Index)
