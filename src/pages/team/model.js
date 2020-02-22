import modelExtend from 'dva-model-extend'
import { pageModel } from 'utils/model'
import * as service from './service'
import { message } from 'antd'

export default modelExtend(pageModel, {
  namespace: 'team',
  state: {
    title: 'team',
    teamDetail: null,
    addType: null,
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
    setup({ dispatch, history }) {
      history.listen((location, action) => {
        if (location.pathname === '/team') {
          dispatch({
            type: 'resetState',
          })
          if (action === 'REPLACE') {
            dispatch({
              type: 'getUserInfo',
              payload: location.query,
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
                payload: location.query,
              })
            }
          }
        }
      })
    },
  },
  effects: {
    *query({ payload }, { call, put, select }) {
      const response = yield call(service.getTeams, payload)
      if (response.success) {
        const data = response.data
        const teams = data
          .map(item => {
            return item.team ? item : null
          })
          .filter(i => i)

        const getUsers = (tree, bucket) => {
          for (const item of tree) {
            if (!item.team) {
              bucket.push(item)
            }

            if (item.children) {
              getUsers(item.children, bucket)
            }
          }

          return bucket
        }

        const users = getUsers(response.data, [])
        yield put({
          type: 'updateState',
          payload: {
            treeData: response.data,
            teams,
            users,
          },
        })
      } else {
        message.error(response.message)
      }
    },
    *toggle({ payload }, { put }) {
      yield put({
        type: 'getRoles',
      })

      yield put({
        type: 'updateState',
        payload: payload,
      })
    },
    *getUserInfo({ payload }, { call, put }) {
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
              permissions,
            },
          })
          yield put({
            type: 'updateState',
            payload: {
              teamDetail: team,
              roles: roles,
              title: 'team',
            },
          })
        } else {
          throw result
        }

        return true
      }

      const response = yield call(service.getUserInfo, payload)
      if (response.success) {
        const { user, permissions, roles, hosts } = response.data
        yield put({
          type: 'loadPerm',
          payload: {
            permissions,
          },
        })
        yield put({
          type: 'updateState',
          payload: {
            user: user,
            roles: roles,
            title: 'user',
            currentHosts: hosts,
          },
        })
      } else {
        message.error(response.message)
      }
    },
    *addUser({ payload }, { call, put }) {
      const response = yield call(service.addUser, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            drawerVisible: false,
          },
        })
        message.success('ok')
      } else {
        throw response.message
      }
    },
    *addTeam({ payload }, { call, put }) {
      const response = yield call(service.addTeam, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            drawerVisible: false,
          },
        })
        message.success('ok')
      } else {
        throw response.message
      }
    },
    *updateUser({ payload }, { call, put }) {
      const response = yield call(service.updateUser, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            drawerVisible: false,
            currentItem: {},
          },
        })
        message.success('ok')
      } else {
        throw response
      }
    },
    *updateTeam({ payload }, { call, put }) {
      const response = yield call(service.updateTeam, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            drawerVisible: false,
            currentItem: {},
          },
        })
        message.success('ok')
      } else {
        throw response
      }
    },
    *deleteUser({ payload }, { call, put }) {
      const response = yield call(service.deleteUser, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: {},
          },
        })
        message.success('ok')
      } else {
        throw response
      }
    },
    *deleteTeam({ payload }, { call, put }) {
      const response = yield call(service.deleteTeam, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: {},
          },
        })
        message.success('ok')
      } else {
        throw response
      }
    },
    *getRoles({ payload }, { call, put }) {
      const response = yield call(service.getCurrentRoles, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            roleList: response.data,
          },
        })
      } else {
        message.error(response.message)
      }
    },
    *getGroups({ payload }, { call, put }) {
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
          },
        })
      } else {
        message.error(response.message)
      }
    },
    *getGroupHosts({ payload }, { call, put }) {
      const response = yield call(service.getGroupHosts, payload)
      if (response.success) {
        const { hosts, group } = response.data
        yield put({
          type: 'loadGroupHosts',
          payload: {
            hosts,
            group,
          },
        })
      } else {
        message.error(response.message)
      }
    },
    *bindRoles({ payload }, { call, put, select }) {
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
          },
        })
        message.success('ok')
      } else {
        message.error(response.message)
      }
    },
    *bindHosts({ payload }, { call, put, select }) {
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
          },
        })
        message.success('ok')
      } else {
        message.error(response.message)
      }
    },
  },
  reducers: {
    loadPerm(state, { payload }) {
      const { permissions } = payload
      let nodes = permissions
        .filter(node => {
          return Number(node.bpid) < 1
        })
        .map(item => {
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
      return { ...state, permissions: nodes }
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

      return { ...state, groupList: newList }
    },
    resetState(state) {
      return {
        ...state,
        title: '',
        teamDetail: {},
        user: null,
        roles: [],
        permissions: [],
        currentItem: {},
        currentHosts: [],
      }
    },
  },
})
