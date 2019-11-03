import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Page, CodeMirror } from 'components'
import { Descriptions, PageHeader, List, Icon, Tag, Avatar, Button } from 'antd'
import moment from 'moment'
import Yaml from 'yaml'
import styles from './index.less'
import { color } from 'utils'

const Index = ({ queue, dispatch, location }) => {
  const { list, pagination } = queue
  const { query } = location
  const codeptions = {
    lineNumbers: false,
    readOnly: true,
    CodeMirror: 'auto',
    viewportMargin: 50,
  }

  const handleRemove = (id, state) => {
    dispatch({
      type: 'queue/remove',
      payload: { id, state },
    })
  }

  const handleRetry = (id, state) => {
    dispatch({
      type: 'queue/retry',
      payload: { id, state },
    })
  }

  const composeDescription = item => {
    const executions = item.executions || []
    const trace = executions.map((execution, index) => {
      const traceback = execution.traceback
      const traceString =
        traceback && typeof traceback == 'object'
          ? Yaml.stringify(traceback)
          : traceback
      return (
        <Descriptions title="Executions" key={index} column={1} bordered>
          <Descriptions.Item label="Exception name">
            {execution.exception_name}
          </Descriptions.Item>
          <Descriptions.Item label="Host">{execution.host}</Descriptions.Item>
          <Descriptions.Item label="State">
            {execution.success ? 'true' : 'false'}
          </Descriptions.Item>
          <Descriptions.Item label="Start at">
            {execution.time_started}
          </Descriptions.Item>
          <Descriptions.Item label="Failed at">
            {execution.time_failed}
          </Descriptions.Item>
          <Descriptions.Item label="Trace">
            <CodeMirror
              value={traceString}
              options={codeptions}
              className={styles.codeMirror}
            ></CodeMirror>
          </Descriptions.Item>
        </Descriptions>
      )
    })

    return (
      <div className={styles.itemWraper}>
        <p>
          <span className={styles.queueItem}>State:</span>
          {item.state}
        </p>
        <p>
          <span className={styles.queueItem}>Unique:</span>
          {item.unique ? 'true' : 'false'}
        </p>
        <p>
          <span className={styles.queueItem}>Lock:</span>
          {item.lock ? 'true' : 'false'}
        </p>
        <p>
          <span className={styles.queueItem}>Lock key:</span>
          {item.lock_key}
        </p>
        <p>
          <span className={styles.queueItem}>Last enqueue time:</span>
          <span style={{ color: color.purple }}>
            {moment(item.time_last_queued * 1000).format()}
          </span>
        </p>
        {trace}
      </div>
    )
  }

  const statsColor = {
    queued: color.green,
    active: color.yellow,
    error: color.red,
  }

  const getActions = item => {
    const actions = [
      <Button
        incon="redo"
        disabled={item.state !== 'error'}
        onClick={() => handleRetry(item.id, item.state)}
        key={item.id}
      >
        retry
      </Button>,
      <Button
        incon="delete"
        onClick={() => handleRemove(item.id, item.state)}
        key={item.id}
      >
        remove
      </Button>,
    ]
    if (item.state === 'schedule') {
      actions.push(
        <Button
          incon="delete"
          onClick={() => handleRemove(item.id, item.state)}
          key={item.id}
        >
          cancel
        </Button>
      )
    }

    return actions
  }

  return (
    <Page inner>
      <div>
        Queue name: <Tag>{query.queue}</Tag>
      </div>
      <List
        itemLayout="vertical"
        size="large"
        dataSource={list}
        pagination={{
          onChange: page => {
            dispatch()
          },
          ...pagination,
        }}
        renderItem={item => (
          <List.Item key={item.id} actions={getActions(item)}>
            <List.Item.Meta
              avatar={
                <Avatar
                  size={32}
                  style={{ background: statsColor[item.state] || color.cyan }}
                >
                  {Array.isArray(item.state) ? item.state[0] : 'unkown'}
                </Avatar>
              }
              title={<div>{item.job_name}</div>}
              description={item.email}
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

const component = connect(({ loading, queue, dispatch }) => ({
  loading,
  queue,
  dispatch,
}))(Index)

export default component
