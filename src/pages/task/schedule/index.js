import React from 'react'
import { connect } from 'dva'
import { Page } from 'components'
import { Descriptions, Tag, Empty, Button } from 'antd'
import stringObject from 'stringify-object'

const ButtonGroup = Button.Group
const Index = ({ dispatch, location, schedule }) => {
  const task = schedule.schedule || {}
  const handleAction = (id, type) => {
    dispatch({
      type: 'schedule/' + type,
      payload: { type, id },
    })
  }

  const info = (
    <Descriptions title="Schedule" column={1} size="small" bordered={true}>
      <Descriptions.Item label="Name">
        <Tag>{task.name}</Tag>
      </Descriptions.Item>
      <Descriptions.Item label="ID">
        <Tag>{task.id}</Tag>
      </Descriptions.Item>
      <Descriptions.Item label="Trigger">
        <Tag>{task.trigger}</Tag>
      </Descriptions.Item>
      <Descriptions.Item label="Executor">
        <Tag>{task.executor}</Tag>
      </Descriptions.Item>
      <Descriptions.Item label="Function">
        <Tag>{task.func}</Tag>
      </Descriptions.Item>
      <Descriptions.Item label="args">
        <Tag>{stringObject(task.args)}</Tag>
      </Descriptions.Item>
      <Descriptions.Item label="Kwargs">
        <Tag>{stringObject(task.kwargs)}</Tag>
      </Descriptions.Item>
      <Descriptions.Item label="Next run time">
        <Tag>{task.next_run_time || 'pause'}</Tag>
      </Descriptions.Item>
      <Descriptions.Item label="Max instances">
        {task.max_instances}
      </Descriptions.Item>
      <Descriptions.Item label="Misfire grace time">
        {task.misfire_grace_time}
      </Descriptions.Item>
      <Descriptions.Item label="Version">{task.version}</Descriptions.Item>
      <Descriptions.Item label="Actions">
        <ButtonGroup>
          <Button
            disabled={!task.next_run_time}
            onClick={() => handleAction(task.id, 'pause')}
          >
            pause
          </Button>
          <Button
            disabled={task.next_run_time}
            onClick={() => handleAction(task.id, 'resume')}
          >
            resume
          </Button>
          <Button onClick={() => handleAction(task.id, 'remove')}>
            remove
          </Button>
          <Button onClick={() => handleAction(task.id, 'reschedule')}>
            reschedule
          </Button>
        </ButtonGroup>
      </Descriptions.Item>
    </Descriptions>
  )
  return <Page inner>{task ? info : <Empty />}</Page>
}

export default connect(({ dispatch, location, schedule }) => ({
  dispatch,
  location,
  schedule,
}))(Index)
