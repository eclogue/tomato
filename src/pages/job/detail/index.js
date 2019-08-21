import React from 'react'
import { Page } from 'components'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Icon, Layout, Timeline, Descriptions } from 'antd'
import Yaml from 'yaml'
import { CodeMirror } from 'components'
import styles from './index.less'

const { Header, Footer, Sider, Content } = Layout

const Index = ({dispatch, jobDetail}) => {
  const { jobInfo, tasks } = jobDetail
  const template = jobInfo.template || {}
  const extra = jobInfo.extra || {}

  let inventoryContent = template.inventory_content || ''
  try {
    inventoryContent = JSON.parse(inventoryContent)
  } catch (err) {
    console.log('invalid inventory:', err.message)
  }

  if (inventoryContent) {
    inventoryContent = Yaml.stringify(inventoryContent)
  }

  let extraVars = extra.extraVars || {}

  if (extraVars) {
    extraVars = Yaml.stringify(extraVars)
  }

  const codeptions = {
    lineNumbers: false,
    readOnly: true,
    CodeMirror: 'auto',
    viewportMargin: 50,
  }

  const navToTask = (taskId) => {
    dispatch(routerRedux.push({
      pathname: '/task',
      query: {id: taskId},
    }))
  }
  const taskList = []
  const statsOptions = {
    queued: {
      color: 'cyan',
      icon: 'ordered-list',
    },
    active: {
      color: 'blue',
      icon: 'fire'
    },
    error: {
      color: 'red',
      icon: 'close-circle'
    },
    scheduled: {
      color: 'orange',
      icon: 'robot',
    },
    finish: {
      color: 'green',
      icon: 'check-circle',
    }
  }

  tasks.map(item => {
    const state = statsOptions[item.state] || {}
    console.log('xxx---',state, item.state)
    const color = state.color || 'yellow'
    const icon = state.icon || 'question-circle'
    taskList.push(
      <Timeline.Item color={color}
        key={item._id}
        dot={<Icon type={icon}/>}
      >
        <div className={styles.buildItem} onClick={() => navToTask(item._id)}>
          {new Date(item.created_at * 1000).toString  ()}</div>
      </Timeline.Item>
    )
    return item
  })

  return (
    <Page inner>
      <Layout className={styles.layout}>
        <Content>
          <Descriptions title={jobInfo.name}
            size="small" colum={3}
          >
            <Descriptions.Item label="Name">{jobInfo.name}</Descriptions.Item>
            <Descriptions.Item label="Book">{jobInfo.book_name}</Descriptions.Item>
            <Descriptions.Item label="Entry">{jobInfo.entry}</Descriptions.Item>
            <Descriptions.Item label="Type">playbook</Descriptions.Item>
            <Descriptions.Item label="App">{template.app_name}</Descriptions.Item>
            <Descriptions.Item label="Time">{jobInfo.created_at}</Descriptions.Item>
            <Descriptions.Item label="Description" span={3}>
              <p>{jobInfo.description}</p>
              <br/>
            </Descriptions.Item>
            <Descriptions.Item label="Become">{jobInfo.become || 'No'}</Descriptions.Item>
            <Descriptions.Item label="Become method">{jobInfo.become_method || 'None'}</Descriptions.Item>
            <Descriptions.Item label="Subset">{jobInfo.subset || 'None'}</Descriptions.Item>
            <Descriptions.Item label="Become method">{jobInfo.become_method || 'None'}</Descriptions.Item>
            <Descriptions.Item label="diff">{jobInfo.diff ? 'True': 'False'}</Descriptions.Item>
            <Descriptions.Item label="forks">{jobInfo.forks || 1}</Descriptions.Item>
            <Descriptions.Item label="debug">{jobInfo.debug}</Descriptions.Item>
            <Descriptions.Item label="roles" span={3}>{jobInfo.created_at}</Descriptions.Item>
            <Descriptions.Item label="tags" span={3}>{jobInfo.created_at}</Descriptions.Item>
            <Descriptions.Item label="skip_tags" span={3}>{jobInfo.created_at}</Descriptions.Item>

            <Descriptions.Item label="Inventory " span={3}>
              <CodeMirror value={inventoryContent} options={codeptions}/>
            </Descriptions.Item>
            <Descriptions.Item label="Extra_vars" span={3}>
              <CodeMirror value={extraVars} options={codeptions}/>
            </Descriptions.Item>
          </Descriptions>
        </Content>
        <Sider className={styles.sider}>
          <div className={styles.buildHistory}>Build history</div>
          <Timeline>
            {taskList}
          </Timeline>
        </Sider>
      </Layout>
    </Page>
  )
}

export default connect(({dispatch, jobDetail}) => ({dispatch, jobDetail}))(Index)
