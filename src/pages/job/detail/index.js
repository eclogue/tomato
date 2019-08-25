import React from 'react'
import { Page } from 'components'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Icon, Layout, Timeline, Descriptions, Form, Button } from 'antd'
import Yaml from 'yaml'
import { CodeMirror } from 'components'
import styles from './index.less'
import moment from 'moment'
import stringifyObject from 'stringify-object'

const { Sider, Content } = Layout

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

  const app_params = template.app_params
  const curl_params = app_params && typeof app_params === 'object' ? JSON.stringify(app_params) : ''
  return (
    <Page inner>
      <Layout className={styles.layout}>
        <Content>
          <Descriptions title={jobInfo.name}
            size="small"
            column={2}
            bordered
          >
            <Descriptions.Item label="Name">{jobInfo.name}</Descriptions.Item>
            <Descriptions.Item label="Book">{jobInfo.book_name}</Descriptions.Item>
            <Descriptions.Item label="Entry">{jobInfo.entry}</Descriptions.Item>
            <Descriptions.Item label="Type">playbook</Descriptions.Item>
            <Descriptions.Item label="App">{template.app_name}</Descriptions.Item>
            <Descriptions.Item label="Time">{moment(jobInfo.created_at).format()}</Descriptions.Item>
            <Descriptions.Item label="Description" span={2}>
              <p>{template.description}</p>
              <br/>
            </Descriptions.Item>
            <Descriptions.Item label="Become method">{jobInfo.become_method || 'None'}</Descriptions.Item>
            <Descriptions.Item label="Become user">{jobInfo.become || 'None'}</Descriptions.Item>
            <Descriptions.Item label="Subset">{jobInfo.subset || 'None'}</Descriptions.Item>
            <Descriptions.Item label="Diff">{jobInfo.diff ? 'True': 'False'}</Descriptions.Item>
            <Descriptions.Item label="Forks">{jobInfo.forks || 1}</Descriptions.Item>
            <Descriptions.Item label="Debug">{template.debug || 0}</Descriptions.Item>
            <Descriptions.Item label="roles" span={2}>{template.roles}</Descriptions.Item>
            <Descriptions.Item label="tags" span={2}>
              {template.tags ? template.tags.join(', ') : null}
            </Descriptions.Item>
            <Descriptions.Item label="skip_tags" span={2}>
              {template.skip_tags ? template.skip_tags.join(', '): null}
            </Descriptions.Item>
            <Descriptions.Item label="Inventory " span={2}>
              <CodeMirror value={inventoryContent} options={codeptions}/>
            </Descriptions.Item>
            <Descriptions.Item label="Extra vars" span={2}>
              <CodeMirror value={extraVars} options={codeptions}/>
            </Descriptions.Item>
            <Descriptions.Item label="Webook" span={2}>
              {`curl -X POST --data '${curl_params}' https://hooks.slack.com/services/...`}
            </Descriptions.Item>
            <Descriptions.Item label="Run manual" span={2}>
              <CodeMirror value={stringifyObject(app_params)} options={{...codeptions, readOnly: false, theme: "monokai"}} />
              <p style={{textAlign: "center", padding: 10}}><Button type="primary">post</Button></p>
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
