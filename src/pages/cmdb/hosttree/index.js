import React, { useState } from 'react'
import { connect } from 'dva'
import { Page, CodeMirror } from 'components'
import PropTypes from 'prop-types'
import { Icon, Layout, Empty, Tree, Input, Button } from 'antd'
import { routerRedux } from 'dva/router'
import { stringifyYaml } from 'utils'
import styles from './index.less'
import GroupDetail from './componets/GroupInfo'

const { TreeNode } = Tree
const { Search } = Input
const { Sider, Content, Header } = Layout

const Index = ({ hostTree, loading, dispatch, location }) => {
  const { query, pathname } = location
  const [expandedKeys, setExpanded] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [autoExpandParent, setAutoExpand] = useState(true)
  const { treeData = [], nodeInfo = {}, nodeType } = hostTree
  const codeOptions = {
    lineNumbers: true,
    readOnly: true,
    CodeMirror: 'auto',
    viewportMargin: 40,
  }

  const onExpand = expandedKeys => {
    setExpanded(expandedKeys)
    setAutoExpand(false)
  }

  const getParentKey = (value, tree) => {
    for (const node of tree) {
      if (node.title.indexOf(value) > -1) {
        setExpanded([node.key])
        break
      } else if (node.children) {
        getParentKey(value, node.children)
      }
    }
  }

  const onChange = value => {
    getParentKey(value, treeData)
    setSearchValue(value)
    setAutoExpand(true)
  }

  const loop = data =>
    data.map(item => {
      const index = item.title.indexOf(searchValue)
      const beforeStr = item.title.substr(0, index)
      const afterStr = item.title.substr(index + searchValue.length)
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: '#f50' }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.title}</span>
        )
      if (item.children) {
        return (
          <TreeNode key={item.key} title={title} dataRef={item}>
            {loop(item.children)}
          </TreeNode>
        )
      }
      const titleNode = <div>{item.title}</div>
      return <TreeNode key={item.key} title={titleNode} dataRef={item} />
    })

  // const getGroupNodes = async treeNode => {
  //   if (treeNode.props.children) {
  //     return
  //   }

  //   const dataRef = treeNode.props.dataRef

  //   dispatch({
  //     type: 'hostTree/getGroupNodes',
  //     payload: {
  //       _id: dataRef._id
  //     }
  //   }).then(({hosts}) => {
  //     treeNode.props.dataRef.children = hosts.map(node => {
  //       return {
  //         _id: node._id,
  //         key: node._id,
  //         title: node.hostname,
  //         isLeaf: true,
  //         children: [],
  //       }
  //     })
  //   })
  // }

  const getNodeInfo = params => {
    const [id] = params
    if (!id) {
      return
    }
    let isGroup = false
    for (const item of treeData) {
      if (id === item._id) {
        isGroup = true
        break
      }
    }

    if (isGroup) {
      return dispatch({
        type: 'hostTree/getGroupInfo',
        payload: {
          _id: id,
        },
      })
    }

    dispatch({
      type: 'hostTree/getNodeInfo',
      payload: {
        _id: id,
      },
    })
  }

  const getContentNode = () => {
    if (nodeType === 'group') {
      return <GroupDetail groupInfo={nodeInfo} />
    } else if (nodeType === 'node') {
      return (
        <CodeMirror value={stringifyYaml(nodeInfo)} options={codeOptions} />
      )
    } else {
      return <Empty />
    }
  }

  const viewInventory = () => {
    if (!nodeInfo) {
      return false
    }
    dispatch(
      routerRedux.push({
        pathname: '/cmdb/inventory/' + nodeInfo._id,
      })
    )
  }

  return (
    <Page inner>
      <Layout className={styles.layoutWrapper}>
        <Header className={styles.header}>
          <div className={styles.role}>
            <Button type="dashed" icon="eye" onClick={viewInventory}>
              {' '}
              view{' '}
            </Button>
          </div>
        </Header>
        <Layout className={styles.layout}>
          <Sider className={styles.sider}>
            <Search
              style={{ marginBottom: 8 }}
              placeholder="Search"
              onSearch={console.log}
            />
            <Tree
              onSelect={getNodeInfo}
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
            >
              {loop(treeData)}
            </Tree>
          </Sider>
          <Content className={styles.content}>{getContentNode()}</Content>
        </Layout>
      </Layout>
    </Page>
  )
}

export default connect(({ hostTree, loading, dispatch }) => ({
  hostTree,
  loading,
  dispatch,
}))(Index)
