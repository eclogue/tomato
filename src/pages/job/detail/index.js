import React, { useState } from 'react'
import { Page } from 'components'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Icon, Layout, Timeline, Descriptions, Form, Button, Input, Tag } from 'antd'
import Yaml from 'yaml'
import { CodeMirror } from 'components'
import styles from './index.less'
import moment from 'moment'
import StringObject from 'stringify-object'
import Playbook from './components/Playbook'
import Adhoc from './components/Adhoc'

const { Sider, Content } = Layout

class Index extends React.Component{

  constructor(props) {
    super(props)
    this.state = {
      timer: null
    }
  }

  componentWillReceiveProps(props) {
    const { jobDetail, dispatch } = props
    if (jobDetail.currentTask && ['active', 'queued'].includes(jobDetail.currentTaskState)) {
      if (!this.state.timer) {
        const intervalId = setInterval(() => {
          dispatch({
            type: 'jobDetail/getTaskLogs',
            payload: {
              _id: jobDetail.currentTask
            }
          })
          clearInterval(this.state.timer)
          this.setState({ timer: null })
        }, 3000)
        this.setState({ timer: intervalId} )
      }
    } else if (this.state.timer) {
      clearInterval(this.state.timer)
    }

  }

  render () {
    const { dispatch, jobDetail } = this.props
    const { jobInfo, tasks } = jobDetail
    const template = jobInfo.template || {}
    const extra = jobInfo.extra || {}

    let inventoryContent = template.inventory_content || ''
    try {
      inventoryContent = inventoryContent && typeof inventoryContent === 'string' ?  JSON.parse(inventoryContent) : inventoryContent
    } catch (err) {
      inventoryContent = ''
    }

    if (inventoryContent && typeof inventoryContent === 'object') {
      inventoryContent = Yaml.stringify(inventoryContent)
    }

    let extraVars = extra.extraVars || {}

    if (extraVars && typeof extraVars === 'object') {
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

    const appParams = template.app_params || ''
    const incomeParams = appParams.income ? Yaml.parse(appParams.income) : null
    const curlParams = incomeParams && typeof incomeParams === 'object' ? JSON.stringify(incomeParams) : ''
    const genManualForm = ({ form }) => {
      const {  getFieldDecorator } = form
      const handlePost = e => {
        e.preventDefault()
        form.validateFields((err, values) => {
          if (!err) {
            dispatch({
              type: 'jobDetail/manual',
              payload: {
                income: values,
                currentItem: jobInfo,
              },
            })
          }
        })
      }
      const bucket = []
      let key = 0
      for (const field in incomeParams) {
        key++
        bucket.push(
          <Form.Item key={key}>
          {getFieldDecorator(field, {
            rules: [{ required: true}],
          })(
            <Input
              placeholder={field}
            />,
          )}
          </Form.Item>
        )
      }

      return (
        <Form layout="inline" onSubmit={handlePost}>
          {bucket}
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={jobDetail.pending}>
              Post
            </Button>
          </Form.Item>
        </Form>
      )
    }

    const ManualForm = Form.create()(genManualForm)
    const playbookProps = {
      jobInfo,
      inventoryContent,
      pending: jobDetail.pending,
    }
    const adhocProps = {
      jobInfo,
      extraVars,
      inventoryContent,
      pending: jobDetail.pending,
    }

    return (
      <Page inner>
        <Layout className={styles.layout}>
          <Content>
            {jobInfo.type === 'adhoc' ? <Adhoc {...adhocProps}/> : <Playbook {...playbookProps} />}
            {jobDetail.currentTask ? <CodeMirror value={jobDetail.logs.join('\n') || '...loading'} options={{...codeptions, theme: 'monokai'}}></CodeMirror> : null }
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
}

export default connect(({dispatch, jobDetail}) => ({dispatch, jobDetail}))(Index)
