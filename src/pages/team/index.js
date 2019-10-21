import React, { useState } from 'react'
import { Tree, Input, Layout, Empty, Button } from 'antd'
import { connect } from 'dva'
import { Page } from 'components'
import PropTypes from 'prop-types'
import styles from './index.less'
import { routerRedux } from 'dva/router'
import UserInfo from './components/UserInfo'
import TeamForm from './components/TeamForm'
import TeamInfo from './components/TeamInfo'
import { storage } from 'utils'

const { TreeNode } = Tree
const { Search } = Input
const { Sider, Content, Header } = Layout

const Index = ({ team, dispatch, loading, location }) => {
  const { treeData, drawerVisble, isEdit, addType } = team
  const { pathname, query } = location
  const {
    user,
    roles,
    permissions,
    teams,
    users,
    currentItem,
    teamDetail = {},
  } = team
  console.log('inint', currentItem)
  const master = teamDetail.master || []
  const [searchValue, setSearchValue] = useState('')
  const [expandedKeys, setExpanded] = useState([query.id])
  const [autoExpandParent, setAutoExpand] = useState(true)
  const currentUser = storage.get('user')

  const getParentKey = (value, tree, field = 'title', parent = '') => {
    for (const node of tree) {
      if (node[field].indexOf(value) > -1) {
        parent = parent || node.key
        break
      } else if (node.children) {
        parent = node.key
        return getParentKey(value, node.children, field, parent)
      }
    }

    return parent
  }

  if (!query.team && query.id) {
    const parentKey = getParentKey(query.id, treeData, 'key')
    if (!expandedKeys.includes(parentKey)) {
      console.log('pppppppppp', parentKey)
      setExpanded([parentKey])
    }
  }

  const onExpand = expandedKeys => {
    setExpanded(expandedKeys)
    // setAutoExpand(false)
  }

  const onChange = value => {
    const parentKey = getParentKey(value, treeData)
    setExpanded([parentKey])
    setSearchValue(value)
    setAutoExpand(true)
  }

  const getUser = params => {
    const [id] = params
    const getItem = tree => {
      for (const item of tree) {
        if (item.key === id) {
          return item
        } else if (item.children) {
          const found = getItem(item.children)
          if (found) {
            return found
          }
        }
      }
    }

    const targetItem = getItem(treeData) || {}
    dispatch(
      routerRedux.replace({
        pathname,
        query: { ...query, id, team: targetItem.team },
      })
    )
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
            <span style={{ color: 'cyan' }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.title}</span>
        )
      if (item.children) {
        return (
          <TreeNode key={item.key} title={title}>
            {loop(item.children)}
          </TreeNode>
        )
      }

      return <TreeNode key={item.key} title={title} />
    })

  const toggleDrawer = state => {
    dispatch({
      type: 'team/toggle',
      payload: {
        drawerVisble: !drawerVisble,
        addType: team.title,
        ...state,
      },
    })
  }

  const drawerProps = {
    visible: drawerVisble,
    actionType: addType,
    team: team,
    onClose: toggleDrawer,
    teams: teams,
    users: users,
    roleList: team.roleList,
    roles: roles,
    currentItem: currentItem,
    onAddUser(params) {
      dispatch({
        type: 'team/addUser',
        payload: params,
      }).then(() => {
        dispatch(
          routerRedux.push({
            pathname,
            query: query,
          })
        )
      })
    },
    onAddTeam(params) {
      dispatch({
        type: 'team/addTeam',
        payload: params,
      }).then(() => {
        dispatch(
          routerRedux.push({
            pathname,
            query: query,
          })
        )
      })
    },
    onEditUser(user) {
      console.log('on edit user', user)
      dispatch({
        type: 'team/updateUser',
        payload: user,
      })
    },
    onEditTeam(params) {
      dispatch({
        type: 'team/updateTeam',
        payload: params,
      })
    },
  }

  const userProps = {
    user,
    roles,
    currentHosts: team.currentHosts,
    roleList: team.roleList || [],
    groupList: team.groupList,
    permissions: permissions,
    showForm(item) {
      toggleDrawer({ currentItem: item })
    },
    onEdit(type) {
      if (type === 'roles') {
        dispatch({
          type: 'team/getRoles',
          payload: {},
        })
      } else if (type === 'hosts') {
        dispatch({
          type: 'team/getGroups',
          payload: { all: 1 },
        })
      }
    },
    onDeleteUser(userId) {
      dispatch({
        type: 'team/deleteUser',
        payload: {
          _id: userId,
        },
      })
    },
    searchHosts(group) {
      dispatch({
        type: 'team/getGroupHosts',
        payload: { _id: group.value },
      })
    },
    searchRoles(keyword) {
      dispatch({
        type: 'team/getRoles',
        payload: { keyword },
      })
    },
    onSave(params) {
      dispatch({
        type: 'team/bindRoles',
        payload: params,
      }).then(() => {
        dispatch(
          routerRedux.push({
            pathname,
            query: query,
          })
        )
      })
    },
    onSaveHosts(params) {
      dispatch({
        type: 'team/bindHosts',
        payload: params,
      }).then(() => {
        dispatch(
          routerRedux.push({
            pathname,
            query: query,
          })
        )
      })
    },
  }

  const teamProps = {
    team: teamDetail,
    roles,
    isEdit,
    roleList: team.roleList || [],
    permissions,
    showForm: toggleDrawer,
    onEdit() {
      dispatch({
        type: 'team/updateState',
        payload: {
          isEdit: !team.isEdit,
        },
      })
    },
    onDeleteUser(teamId) {
      dispatch({
        type: 'team/deleteTeam',
        payload: {
          _id: teamId,
        },
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

  const canEdit = () => {
    if (!team.title) {
      return false
    }

    if (currentUser.is_admin) {
      return true
    }

    if (team.title === 'user') {
      return master.includes(currentUser.username)
    }
  }

  console.log('expand key', expandedKeys, autoExpandParent)

  return (
    <Page inner>
      <Layout className={styles.layoutWrapper}>
        <Header className={styles.header}>
          <div className={styles.role}>
            <Button
              type="dashed"
              icon="poweroff"
              onClick={toggleDrawer}
              disabled={!canEdit()}
            >
              {' '}
              add {team.title}
            </Button>
          </div>
        </Header>
        <Layout className={styles.layout}>
          <Sider className={styles.sider}>
            <Search
              style={{ marginBottom: 8 }}
              placeholder="Search"
              onSearch={onChange}
            />
            <Tree
              onSelect={getUser}
              onExpand={onExpand}
              defaultExpandAll={true}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
            >
              {loop(treeData)}
            </Tree>
          </Sider>
          <Content className={styles.content}>{showInfo()}</Content>
        </Layout>
      </Layout>
      <TeamForm {...drawerProps} />
    </Page>
  )
}

export default connect(({ team, loading, dispatch }) => ({
  team,
  loading,
  dispatch,
}))(Index)
