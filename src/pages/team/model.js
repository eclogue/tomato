import modelExtend from 'dva-model-extend'
import { pageModel } from 'utils/model'
import * as service from './service'
import { message } from 'antd';


export default modelExtend(pageModel, {
  namespace: 'team',
  state: {
    title: '',
    teamDetail: null,
    teams: [],
    user: null,
    users: [],
    roles: [],
    permissions: [],
    drawerVisible: false,
    isEdit: false,
    currentItem: {},
    treeData: [],
    groupList: [],
    roleList: [],
    currentHosts: [],
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location, action) => {
        if (location.pathname === '/team') {
          if (action === 'REPLACE') {
            dispatch({
              type: 'getUserInfo',
              payload: location.query
            })
          } else {
            dispatch({
              type: 'query',
              payload: {
                ...location.query,
              },
            })
            if (location.query.id) {
              dispatch({
                type: 'getUserInfo',
                payload: location.query
              })
            }
          }
        }
      })
    },
  },
  effects: {
    * query ({ payload }, { call, put }) {
      const response = yield call(service.getTeams, payload)
      if (response.success) {
        const data = response.data
        const teams = data.map(item => {
          return item.team ? item : null
        }).filter(i => (i))
        yield put({
          type: 'updateState',
          payload: {
            treeData: response.data,
            teams,
          }
        })
      } else {
        throw response
      }
    },
    * getUserInfo ({ payload }, { call, put }) {
      const { team, id } = payload
      if (!id) {
        return false
      }

      if (team) {
        const result = yield call(service.getTeamInfo, payload)
        if (result.success) {
          const { team, roles, permissions } = result.data
          yield put({
            type: 'loadPerm',
            payload: {
              permissions
            }
          })
          yield put({
            type: 'updateState',
            payload: {
              teamDetail: team,
              roles: roles,
              title: 'team',
            }
          })
        } else {
          throw result
        }
        return true
      }

      const response = yield call(service.getUserInfo, payload)
      if (response.success) {
        const { user, permissions, roles, hosts} = response.data
        yield put({
          type: 'loadPerm',
          payload: {
            permissions
          }
        })
        yield put({
          type: 'updateState',
          payload: {
            user: user,
            roles: roles,
            title: 'user',
            currentHosts: hosts,
          }
        })
      } else {
        throw response
      }
    },
    * addUser({ payload }, { call, put }) {
      const response = yield call(service.addUser, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            drawerVisible: false,
          }
        })
        message.success('ok')
      } else {
        throw response
      }
    },
    * getRoles({ payload }, { call, put }) {
      const response = yield call(service.getCurrentRoles, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            roleList: response.data
          }
        })
      } else {
        throw response
      }
    },
    * getGroups({ payload }, { call, put }) {
      const response = yield call(service.getGroups, payload)
      if (response.success) {
        const { list } = response.data
        yield put({
          type: 'updateState',
          payload: {
            groupList: list.map(item => {
              return {
                value: item._id,
                label: item.name,
                isLeaf: false,
              }
            }),
          }
        })
      } else {
        throw response
      }
    },
    * getGroupHosts({ payload }, { call, put }) {
      const response = yield call(service.getGroupHosts, payload)
      if (response.success) {
        const { hosts, group } = response.data
        console.log('res', hosts, group)
        yield put({
          type: 'loadGroupHosts',
          payload: {
            hosts,
            group,
          }
        })
      } else {
        throw response
      }
    },
    * bindRoles({ payload }, { call, put, select }) {
      const user = yield select(_ => _.team.user)
      if (!user._id) {
        return message.error('invalid user')
      }

      payload.userId = user._id
      const response = yield call(service.bindRoles, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            isEdit: false,
          }
        })
        message.success('ok')
      } else {
        throw response
      }
    },
    * bindHosts({ payload }, { call, put, select }) {
      const user = yield select(_ => _.team.user)
      if (!user._id) {
        return message.error('invalid user')
      }

      payload.userId = user._id
      const response = yield call(service.bindHosts, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            isEdit: false,
          }
        })
        message.success('ok')
      } else {
        throw response
      }
    }
  },
  reducers: {
    loadPerm(state, { payload }) {
      const { permissions } = payload
      let nodes = permissions.filter(node => {
        return Number(node.bpid) < 1
      }).map(item => {
        item.title = item.name
        item.key = item._id
        return item
      })

      const insertNode = (node, bucket) => {
        return bucket.map(item => {
          node.title = node.name
          node.key = node._id
          if (String(node.bpid) === String(item.id)) {
            if (!item.children) {
              item.children = [node]
            } else {
              item.children.push(node)
            }
          } else if (item.children) {
            item.children = insertNode(node, item.children)
          }

          return item
        })
      }
      for (const item of permissions) {
        if (Number(item.bpid) < 1) {
          continue
        } else {
          nodes = insertNode(item, nodes)
        }
      }
      return {...state, permissions: nodes}
    },
    loadGroupHosts(state, { payload }) {
      const { hosts, group } = payload
      const newList = state.groupList.map(item => {
        if (item.value === group) {
          item.children = hosts.map(host => {
            return {
              value: host._id,
              label: host.node_name,
              isLeaf: true,
            }
          })
        }

        item.loading = false

        return item
      })

      return { ...state, groupList: newList}
    }
  }
})
