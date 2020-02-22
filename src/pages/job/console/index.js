import React from 'react'
import { Page } from 'components'
import { connect } from 'dva'
import { Layout, Tabs, Tree } from 'antd'
import { stringifyYaml } from 'utils'
import { CodeMirror } from 'components'
import Adhoc from './components/Adhoc'
import Playbook from './components/Playbook'
import styles from './index.less'

const { Sider, Content } = Layout
const { TabPane } = Tabs

const Index = ({ dispatch, play, form, loading }) => {
  const { modules, doc, preview, credentials, result } = play
  const inventoryTree = play.pendingInventory
  const codeptions = {
    lineNumbers: true,
    readOnly: true,
    CodeMirror: 'auto',
    viewportMargin: 50,
    theme: 'monokai',
  }

  const queryModuleDoc = params => {
    dispatch({
      type: 'play/queryDoc',
      payload: {
        ...params,
      },
    })
  }

  const searchModules = keyword => {
    if (loading.global || !keyword) {
      return false
    }

    dispatch({
      type: 'play/searchModules',
      payload: {
        keyword,
      },
    })
  }

  const searchInventory = keyword => {
    if (!keyword || loading.global) {
      return false
    }

    dispatch({
      type: 'play/searchInventory',
      payload: {
        keyword,
      },
    })
  }

  const onSelectInventory = params => {
    dispatch({
      type: 'play/previewInventory',
      payload: {
        ...params,
      },
    })
  }

  const onSubmit = params => {
    dispatch({
      type: 'play/run',
      payload: {
        ...params,
      },
    })
  }
  const queryLog = task => {
    dispatch({
      type: 'play/queryLog',
      payload: {
        _id: task,
        type: 'book',
      },
    })
  }

  const adhocProps = {
    doc,
    modules,
    pending: loading.global,
    preview,
    credentials,
    searchModules,
    searchInventory,
    queryModuleDoc,
    onSelectInventory,
    pendingInventory: play.pendingInventory,
    onSubmit,
    queryLog,
    currentTask: play.currentTask,
    taskState: play.taskState,
    logs: play.logs,
    onExtraOptionsChange: (...params) => {
      dispatch({
        type: 'play/updateState',
        payload: {
          extraOptions: params[2],
        },
      })
    },
  }

  const playbookProps = {
    pending: loading.global,
    preview,
    credentials,
    searchInventory,
    onSelectInventory,
    pendingInventory: play.pendingInventory,
    onSubmit,
    queryLog,
    currentTask: play.currentTask,
    taskState: play.taskState,
    logs: play.logs,
    onCodeChange(text) {
      dispatch({
        type: 'play/updateState',
        payload: {
          code: text,
        },
      })
    },
  }

  return (
    <Page inner>
      <Layout className={styles.layout}>
        <Content className={styles.content}>
          <Tabs defaultActiveKey="1" onChange={console.log}>
            <TabPane tab="Adhoc" key="1">
              <Adhoc {...adhocProps} />
            </TabPane>
            <TabPane tab="Playbook" key="2">
              <Playbook {...playbookProps} />
            </TabPane>
          </Tabs>
          {play.logs.length ? (
            <div>
              <p>result:</p>
              <CodeMirror value={play.logs.join('\n')} options={codeptions} />
            </div>
          ) : null}
        </Content>
        <Sider className={styles.sider}>
          <div className={styles.buildHistory}>Inventory preview</div>
          <Tree
            showLine
            defaultExpandAll={true}
            defaultExpandParent
            treeData={inventoryTree}
          ></Tree>
        </Sider>
      </Layout>
    </Page>
  )
}

export default connect(({ dispatch, play, loading }) => ({
  dispatch,
  play,
  loading,
}))(Index)
