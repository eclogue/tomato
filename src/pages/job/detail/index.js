import React, { useState } from 'react'
import { Page } from 'components'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Icon, Layout, Timeline, Tag } from 'antd'
import Yaml from 'yaml'
import styles from './index.less'
import moment from 'moment'
import Playbook from './components/Playbook'
import Adhoc from './components/Adhoc'

const { Sider, Content } = Layout

class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      timer: null,
    }
  }

  componentWillReceiveProps(props) {
    const { jobDetail, dispatch } = props
    if (
      jobDetail.currentTask &&
      ['active', 'queued'].includes(jobDetail.currentTaskState)
    ) {
      if (!this.state.timer) {
        const intervalId = setInterval(() => {
          dispatch({
            type: 'jobDetail/getTaskLogs',
            payload: {
              _id: jobDetail.currentTask,
            },
          })
          clearInterval(this.state.timer)
          this.setState({ timer: null })
        }, 3000)
        this.setState({ timer: intervalId })
      }
    } else if (this.state.timer) {
      clearInterval(this.state.timer)
    }
  }

  render() {
    const { dispatch, jobDetail } = this.props
    const { jobInfo, tasks } = jobDetail
    const template = jobInfo.template || {}
    const extra = jobInfo.extra || {}

    let inventoryContent = template.inventory_content || ''
    try {
      inventoryContent =
        inventoryContent && typeof inventoryContent === 'string'
          ? JSON.parse(inventoryContent)
          : inventoryContent
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

    const navToTask = taskId => {
      dispatch(
        routerRedux.push({
          pathname: '/task/history/' + taskId,
          query: {},
        })
      )
    }

    const rollback = taskId => {
      dispatch({
        type: 'jobDetail/rollback',
        payload: {
          taskId,
        },
      })
    }
    const taskList = []
    const statsOptions = {
      queued: {
        color: 'cyan',
        icon: 'ordered-list',
      },
      active: {
        color: 'blue',
        icon: 'fire',
      },
      error: {
        color: 'red',
        icon: 'close-circle',
      },
      scheduled: {
        color: 'orange',
        icon: 'robot',
      },
      finish: {
        color: 'green',
        icon: 'check-circle',
      },
    }

    tasks.map(item => {
      const state = statsOptions[item.state] || {}
      const color = state.color || 'yellow'
      const icon = state.icon || 'question-circle'
      taskList.push(
        <Timeline.Item color={color} key={item._id} dot={<Icon type={icon} />}>
          <div>
            <span
              onClick={() => navToTask(item._id)}
              className={styles.buildItem}
            >
              {moment(item.created_at * 1000).format('YYYY-MM-DD HH:mm:ss')}
            </span>
            <Tag color={color}>{item.state}</Tag>
            {item.state === 'finish' ? (
              <Tag className={styles.reset} onClick={_ => rollback(item._id)}>
                rerun
              </Tag>
            ) : null}
          </div>
        </Timeline.Item>
      )
      return item
    })

    const playbookProps = {
      jobInfo,
      inventoryContent,
      logs: jobDetail.logs,
      pending: jobDetail.pending,
      onRun: params => {
        dispatch({
          type: 'jobDetail/manual',
          payload: {
            income: params,
            currentItem: jobInfo,
          },
        })
      },
    }
    const adhocProps = {
      jobInfo,
      extraVars,
      inventoryContent,
      logs: jobDetail.logs,
      pending: jobDetail.pending,
      onRun: () => {
        dispatch({
          type: 'jobDetail/manual',
          payload: {
            income: {},
            currentItem: jobInfo,
          },
        })
      },
    }

    return (
      <Page inner>
        <Layout className={styles.layout}>
          <Content>
            {jobInfo.type === 'adhoc' ? (
              <Adhoc {...adhocProps} />
            ) : (
              <Playbook {...playbookProps} />
            )}
          </Content>
          <Sider className={styles.sider} width={320}>
            <div className={styles.buildHistory}>Build history</div>
            <Timeline>{taskList}</Timeline>
          </Sider>
        </Layout>
      </Page>
    )
  }
}

export default connect(({ dispatch, jobDetail }) => ({ dispatch, jobDetail }))(
  Index
)
