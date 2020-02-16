import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Page } from 'components'
import { routerRedux } from 'dva/router'
import Modal from './components/Modal'
import yarsParser from 'yargs-parser'
import {
  Tree as AntdTree,
  Layout,
  Empty,
  message,
  Button,
  Icon,
  Drawer,
} from 'antd'
import BookContent from './components/Content'
import AdditionDrawer from './components/Drawer'
import ReactTerminal from './components/terminal'
import styles from './index.less'

const { Sider, Header } = Layout
const TreeNode = AntdTree.TreeNode
const DirectoryTree = AntdTree.DirectoryTree

const Index = ({ playbook, loading, location, dispatch }) => {
  const {
    list,
    file,
    currentItem,
    modalVisible,
    configVariables,
    drawerVisible,
    ...props
  } = playbook
  const { fileList } = playbook
  const { query, pathname } = location
  const handleRefresh = (newQuery = {}) => {
    return dispatch(
      routerRedux.push({
        pathname,
        query: {
          ...query,
          ...newQuery,
        },
      })
    )
  }
  const findChildren = current => {
    const children = []
    if (!current) {
      return children
    }

    const currentLen = current.path.split('/').filter(item => item).length
    for (const item of list) {
      const itemLen = item.path.split('/').filter(item => item).length
      const isChild =
        currentLen === itemLen - 1 && item.path.search(current.path) !== -1
      if (!isChild) {
        continue
      }

      const filename = item.path.replace(current.path, '').replace('/', '')
      const node = {}
      node.key = item._id
      node.title = filename
      if (item.is_dir) {
        node.children = findChildren(item)
        // if (!node.children.length) {
        //   node.children.push({
        //     key: '' + item._id,
        //     title: <Icon type="upload" />,
        //   })
        // }
      }

      children.push(node)
    }

    return children
  }

  const rootItem = {
    path: '/',
    parent: '/',
    is_dir: true,
  }

  const selectNode = node => {
    if (!Array.isArray(node)) {
      return false
    }

    if (node.includes('root')) {
      return dispatch({
        type: 'playbook/updateState',
        payload: {
          file: {
            _id: '/',
            path: '.',
            parent: '/',
            book_id: query.id,
            is_dir: true,
          },
        },
      })
    }

    const id = node.pop()
    dispatch(
      routerRedux.replace({
        pathname,
        query: {
          ...query,
          current: id,
        },
      })
    )
  }

  const modalProps = {
    item: currentItem || {},
    visible: modalVisible,
    confirmLoading: loading.effects['/playbook/query'],
    title: '添加文件夹',
    wrapClassName: 'vertical-center-modal',
    onAddFile(fileObject) {
      return dispatch({
        type: 'playbook/addFile',
        payload: fileObject,
      })
    },
    onOk(data) {
      if (data.action === 'file') {
        dispatch({
          type: 'playbook/batchUpload',
        }).then(() => {
          handleRefresh()
        })
        // dispatch({
        //   type: 'playbook/hideModal',
        //   payload: {
        //     formData,
        //   },
        // }).then(() => {})
      } else if (data.action === 'folder') {
        dispatch({
          type: 'playbook/addFolder',
          payload: {
            data,
          },
        }).then(() => {
          handleRefresh()
        })
      }
    },
    onCancel() {
      dispatch({
        type: 'playbook/hideModal',
      })
    },
  }

  const renderTreeNodes = data => {
    const nodes = data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode {...item} />
    })

    return nodes
  }

  const drawerProps = {
    currentItem,
    configs: playbook.configs,
    visible: drawerVisible,
    updateFile(params) {
      dispatch({
        type: 'playbook/update',
        payload: params,
      })
    },
    showDrawer() {
      dispatch({
        type: 'playbook/updateState',
        payload: {
          drawerVisible: true,
        },
      })
    },
    closeDrawer() {
      dispatch({
        type: 'playbook/updateState',
        payload: {
          drawerVisible: false,
        },
      })
    },
    registerConfig(value) {
      if (value && value.length) {
        dispatch({
          type: 'playbook/registerConfig',
          payload: { ids: value },
        })
      }
    },
    searchConfig(keyword) {
      dispatch({
        type: 'playbook/searchConfig',
        payload: { keyword },
      })
    },
  }

  const contentProps = {
    file,
    fileList,
    modalProps,
    modalVisible,
    configVariables,
    onAddFile(data) {
      return dispatch({
        type: 'playbook/addFile',
        payload: data,
      })
    },
    onUpload() {
      return dispatch({
        type: 'playbook/batchUpload',
      }).then(() => {
        handleRefresh()
      })
    },
    resetFileList() {
      return dispatch({
        type: 'playbook/resetFileList',
      })
    },
    onSave: () => {
      dispatch({
        type: 'playbook/updateFile',
        payload: {},
      }).then(() => {
        handleRefresh()
      })
    },
    onRemove: id => {
      dispatch({
        type: 'playbook/delFile',
        payload: { id, query, pathname },
      })
    },
    onRename: params => {
      dispatch({
        type: 'playbook/renameFile',
        payload: {
          ...params,
        },
      }).then(() => {
        handleRefresh()
      })
    },
    onChange: value => {
      dispatch({
        type: 'playbook/updateState',
        payload: {
          editFile: {
            content: value,
          },
        },
      })
    },
    showModal: (action, file) => {
      dispatch({
        type: 'playbook/showModal',
        payload: {
          action,
          ...file,
        },
      })
    },
    showDrawer() {
      dispatch({
        type: 'playbook/searchConfig',
        payload: { pId: file._id },
      })
      drawerProps.showDrawer()
    },
  }

  const terminalProps = {
    pending: loading.global,
    output: playbook.logs,
    files: list,
    args: playbook.args,
    currentTask: playbook.currentTask,
    taskState: playbook.taskState,
    queryRunLog: task => {
      dispatch({
        type: 'playbook/queryLog',
        payload: {
          _id: task,
          type: 'book',
        },
      })
    },
    commands: {
      'ansible-playbook': args => {
        args = ['ansible-playbook'].concat(args)
        const alias = {
          inventory: 'i',
          tags: 't',
          limit: 'l',
          forks: 'f',
          diff: 'D',
          check: 'C',
          'module-path': 'M',
          verbose: 'V',
        }
        const params = yarsParser(args, {
          alias: alias,
        })
        const options = {}
        Object.keys(params).map(key => {
          if (alias[key]) {
            options[key] = params[key]
          }

          return key
        })
        const entry = params._
        if (!entry.length) {
          return message.error('invalid command')
        }

        options.entry = entry
        dispatch({
          type: 'playbook/run',
          payload: {
            id: query.id,
            args: args,
            options: options,
          },
        })
      },
    },
  }

  const [consoleVisible, setConsoleVisible] = useState(false)

  return (
    <Page inner>
      <Layout>
        <Header className={styles.header}>
          <Button
            icon="play-circle"
            size="small"
            style={{ borderColor: 'white', float: 'right' }}
            onClick={_ => setConsoleVisible(!consoleVisible)}
          >
            console
          </Button>
        </Header>
        <Layout>
          <Sider>
            <DirectoryTree
              showLine
              onSelect={selectNode}
              defaultExpandAll={false}
              defaultExpandedKeys={[query.current]}
            >
              {[
                <TreeNode
                  key="root"
                  title="."
                  dataRef={rootItem}
                  onSelect={console.log}
                />,
              ].concat(renderTreeNodes(findChildren(rootItem)))}
            </DirectoryTree>
          </Sider>
          <Layout.Content>
            {file && !playbook.pending ? (
              <BookContent contentProps={contentProps} />
            ) : (
              <Empty />
            )}
          </Layout.Content>
        </Layout>
        {modalVisible ? <Modal {...modalProps} /> : ''}
        {file ? <AdditionDrawer {...drawerProps} /> : null}
        <Drawer
          title="Playbook terminal"
          placement="bottom"
          height="100%"
          closable={true}
          onClose={_ => setConsoleVisible(!consoleVisible)}
          visible={consoleVisible}
          getContainer={true}
          bodyStyle={{ padding: 0, marginTop: -15, overflowY: 'scroll' }}
          headerStyle={{ padding: 10 }}
        >
          <ReactTerminal {...terminalProps} />
        </Drawer>
      </Layout>
    </Page>
  )
}

Index.propTypes = {
  playbook: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ playbook, dashboard, loading }) => ({
  playbook,
  dashboard,
  loading,
}))(Index)
