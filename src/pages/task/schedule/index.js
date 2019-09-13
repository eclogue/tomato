import React from 'react'
import { connect } from 'dva'
import { Page } from 'components'
import { Descriptions, Tag, Empty } from 'antd'
import { color } from 'utils'

const Index = ({ dispatch, location, schedule }) => {
  const task = schedule.schedule
  console.log(task)
  const info = (
    <Descriptions title="Schedule" column={1}>
      <Descriptions.Item label="Name"><Tag>{task.name}</Tag></Descriptions.Item>
      <Descriptions.Item label="ID"><Tag>{task.id}</Tag></Descriptions.Item>
      <Descriptions.Item label="Trigger"><Tag>{task.trigger}</Tag></Descriptions.Item>
      <Descriptions.Item label="Executor"><Tag>{task.executor}</Tag></Descriptions.Item>
      <Descriptions.Item label="Function"><Tag>{task.func}</Tag></Descriptions.Item>
      <Descriptions.Item label="args"><Tag>{task.args}</Tag></Descriptions.Item>
      <Descriptions.Item label="Kwargs"><Tag>{task.kwargs}</Tag></Descriptions.Item>
      <Descriptions.Item label="Next run time"><Tag>{task.next_run_time}</Tag></Descriptions.Item>
      <Descriptions.Item label="Max instances"><Tag>{task.max_instances}</Tag></Descriptions.Item>
      <Descriptions.Item label="Misfire grace time"><Tag>{task.misfire_grace_time}</Tag></Descriptions.Item>
      <Descriptions.Item label="Version"><Tag>{task.version}</Tag></Descriptions.Item>
    </Descriptions>
  )
  return (
    <Page inner>
      {task ? info : <Empty />}
    </Page>
  )
}

export default connect(({dispatch, location, schedule}) => ({dispatch, location, schedule}))(Index)


