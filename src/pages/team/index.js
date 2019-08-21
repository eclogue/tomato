import React, { useState } from 'react'
import { Tree, Input, Layout, Empty, Button } from 'antd'
import { connect } from 'dva'
import { Page } from 'components'
import PropTypes from 'prop-types'
import styles from './index.less'
import { routerRedux } from 'dva/router'
import UserInfo from './components/UserInfo'
import RoleForm from './components/RoleForm'
import TeamInfo from './components/TeamInfo'

const { TreeNode } = Tree
const { Search } = Input
const { Sider, Content, Header } = Layout

const Index = ({team, dispatch, loading, location}) => {

  const { treeData, drawerVisble, isEdit } = team
  const { pathname, query } = location
  const { user, roles, permissions, teams, teamDetail } = team
  const [expandedKeys, setExpanded] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [autoExpandParent, setAutoExpand] = useState(true)

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

  const getUser = params => {
    const [id] = params
    const getItem = (tree) => {
      for (const item of tree) {
        if (item.key === id) {
          return item
        } else if (item.children) {
          return getItem(item.children)
        }
      }
    }
    const currentItem = getItem(treeData) || {}
    dispatch(routerRedux.replace({
      pathname,
      query: {...query, id, team: currentItem.team}
    }))
  }

  const loop = data =>
    data.map(item => {
      const index = item.title.indexOf(searchValue)
      const beforeStr = item.title.substr(0, index)
      const afterStr = item.title.substr(index + searchValue.length)
      const title = index > -1 ? (
        <span>
          {beforeStr}
          <span style={{ color: '#f50' }}>{searchValue}</span>
          {afterStr}
        </span>
      ) : (<span>{item.title}</span>)
    if (item.children) {
      return (
        <TreeNode key={item.key} title={title}>
          {loop(item.children)}
        </TreeNode>
      )
    }
    const titleNode = (
      <div>{item.title}</div>
    )
    return <TreeNode key={item.key} title={titleNode} />
  })

  const toggoleDrawer = () => {
    dispatch({
      type: 'team/updateState',
      payload: {
        drawerVisble: !drawerVisble,
      }
    })
  }

  const drawerProps = {
    visible: drawerVisble,
    onClose: toggoleDrawer,
    teams: teams,
    onSubmit(params) {
      dispatch({
        type: 'team/addUser',
        payload: params,
      }).then(() => {
        dispatch(routerRedux.push({
          pathname,
          query: query,
        }))
      })
    }
  }

  const userProps = {
    user,
    roles,
    currentHosts: team.currentHosts,
    roleList: team.roleList || [],
    groupList: team.groupList,
    permissions,
    onEdit(type) {
      if (type === 'roles') {
        dispatch({
          type: 'team/getRoles',
          payload: { }
        })
      } else if (type === 'hosts') {
        dispatch({
          type: 'team/getGroups',
          payload: { all: 1 }
        })
      }
    },
    searchHosts(group) {
      dispatch({
        type: 'team/getGroupHosts',
        payload: { _id: group.value }
      })
    },
    searchRoles(keyword) {
      dispatch({
        type: 'team/getRoles',
        payload: { keyword }
      })
    },
    onSave(params) {
      dispatch({
        type: 'team/bindRoles',
        payload: params,
      }).then(() => {
        dispatch(routerRedux.push({
          pathname,
          query: query,
        }))
      })
    },
    onSaveHosts(params) {
      dispatch({
        type: 'team/bindHosts',
        payload: params,
      }).then(() => {
        dispatch(routerRedux.push({
          pathname,
          query: query,
        }))
      })
    }
  }

  const teamProps = {
    team: teamDetail,
    roles,
    isEdit,
    roleList: team.roleList || [],
    permissions,
    onEdit() {
      dispatch({
        type: 'team/updateState',
        payload: {
          isEdit: !team.isEdit,
        }
      })
    },
  }

  const showInfo = () => {
    if (!team.title) {
      return <Empty />
    } else if (team.title === 'user') {
      return <UserInfo {...userProps} />
    } else if (team.title === 'team') {
      return <TeamInfo {...teamProps} />
    } else {
      return <Empty />
    }
  }

  return (
    <Page inner>
      <Layout className={styles.layoutWrapper}>
        <Header className={styles.header}>
          <div className={styles.role}>
            <Button
              type="dashed"
              icon="poweroff"
              onClick={toggoleDrawer}
            > add user </Button>
          </div>
        </Header>
        <Layout className={styles.layout}>
          <Sider className={styles.sider}>
            <Search style={{ marginBottom: 8 }}
              placeholder="Search"
              onSearch={onChange} />
            <Tree
              onSelect={getUser}
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
            >
              {loop(treeData)}
            </Tree>
          </Sider>
          <Content className={styles.content}>
            {showInfo()}
          </Content>
        </Layout>
      </Layout>
      <RoleForm {...drawerProps} />
    </Page>
  )
}


export default connect(({ team, loading, dispatch }) => ({ team, loading, dispatch }))(Index)
