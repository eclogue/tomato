import React from 'react'
import { Page } from 'components'
import { connect } from 'dva'
import { Layout, Tabs, Tree } from 'antd'
import Yaml from 'yaml'
import { CodeMirror } from 'components'
import Adhoc from './components/Adhoc'
import Playbook from './components/Playbook'
import styles from './index.less'

const { Sider, Content } = Layout
const { TabPane } = Tabs


const Index = ({dispatch, play, form}) => {
  const { modules, doc, preview, pending, credentials, result } = play
  const showResult = typeof result === 'object' ? Yaml.stringify(result) : result
  const inventoryTree = play.pendingInventory
  const codeptions = {
    lineNumbers: true,
    readOnly: true,
    CodeMirror: 'auto',
    viewportMargin: 50,
    theme: 'monokai'
  }

  const queryModuleDoc = (params) => {
    dispatch({
      type: 'play/queryDoc',
      payload: {
        ...params,
      }
    })
  }

  const searchModules = keyword => {
    if (pending) {
      return false
    }

    dispatch({
      type: 'play/searchModules',
      payload: {
        keyword,
      }
    })
  }

  const searchInventory = keyword => {
    if (pending || !keyword) {
      return false
    }

    dispatch({
      type: 'play/searchInventory',
      payload: {
        keyword,
      }
    })
  }

  const onSelectInventory = (params) => {
    dispatch({
      type: 'play/previewInventory',
      payload: {
        ...params,
      }
    })
  }

  const onSubmit = params => {
    dispatch({
      type: 'play/run',
      payload: {
        ...params
      }
    })
  }

  const adhocProps = {
    doc,
    modules,
    pending,
    preview,
    credentials,
    searchModules,
    searchInventory,
    queryModuleDoc,
    onSelectInventory,
    pendingInventory: play.pendingInventory,
    onSubmit,
    onExtraOptionsChange: (...params) => {
      dispatch({
        type: 'play/updateState',
        payload: {
          extraOptions: params[2]
        }
      })
    }
  }

  const playbookProps = {
    pending,
    preview,
    credentials,
    searchInventory,
    onSelectInventory,
    pendingInventory: play.pendingInventory,
    onSubmit,
    onCodeChange(text) {
      dispatch({
        type: 'play/updateState',
        payload: {
          code: text,
        }
      })
    }
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
          {showResult ?
            <div>
            <p>result:</p>
            <CodeMirror value={showResult} options={codeptions} />
            </div>
            : null
          }
        </Content>
        <Sider className={styles.sider}>
          <div className={styles.buildHistory}>Inventory preview</div>
          <Tree showLine defaultExpandAll={true}
            defaultExpandParent
            treeData={inventoryTree}
          >
          </Tree>
        </Sider>
      </Layout>
    </Page>
  )
}

export default connect(({dispatch, play}) => ({dispatch, play}))(Index)
