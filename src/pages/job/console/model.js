import ModelExtend from 'dva-model-extend'
import { pageModel } from 'utils/model'
import { message } from 'antd'
import * as service from './service'
import { getCredentials } from '../playbook/service'
import Yaml from 'yaml'

export default ModelExtend(pageModel, {
  namespace: 'play',
  state: {
    doc: '',
    code: '',
    pending: false,
    result: '',
    modules: [],
    inventory: [],
    preview: false,
    credentials: [],
    inventoryContent: '',
    pendingInventory: [],
    inventoryTree: [],
    extraOptions: null,
  },
  subscriptions: {
    sutup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/job/console') {
          dispatch({
            type: 'queryCredentials',
            payload: {
              ...location.query,
            },
          })
          dispatch({
            type: 'searchInventory',
            payload: {
              ...location.query,
            },
          })
        }
      })
    },
  },
  effects: {
    *queryDoc({ payload }, { call, put }) {
      const response = yield call(service.queryAnsibleDoc, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            preview: true,
            doc: response.data,
          },
        })
      }
    },
    *searchModules({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          pending: true,
        },
      })
      const response = yield call(service.searchModules, payload)
      if (response.success) {
        const modules = response.data
        yield put({
          type: 'updateState',
          payload: {
            modules: modules,
          },
        })
      } else {
        message.error(response.message)
      }

      yield put({
        type: 'updateState',
        payload: {
          pending: false,
        },
      })
    },
    *searchInventory({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          pending: true,
        },
      })
      const response = yield call(service.searchInventory, payload)
      if (response.success) {
        const records = response.data || []
        yield put({
          type: 'updateState',
          payload: {
            pendingInventory: records,
          },
        })
      } else {
        message.error(response.message)
      }

      yield put({
        type: 'updateState',
        payload: {
          pending: false,
        },
      })
    },
    *previewInventory({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          pending: true,
        },
      })
      const response = yield call(service.previewInventory, payload)
      if (response.success) {
        let content = response.data
        try {
          if (typeof content === 'string') {
            content = JSON.parse(response.data)
          }
          yield put({
            type: 'loadInventoryTree',
            payload: {
              content,
            },
          })
        } catch (err) {
          message.warn('try parse inventory json failed~!')
        }

        yield put({
          type: 'updateState',
          payload: {
            preview: true,
            inventoryContent: content,
          },
        })
      } else {
        message.error(response.message)
      }

      yield put({
        type: 'updateState',
        payload: {
          pending: false,
        },
      })
    },
    *queryCredentials({ payload }, { call, put }) {
      const response = yield call(getCredentials, payload)
      if (response.success) {
        const { list } = response.data
        yield put({
          type: 'updateState',
          payload: {
            credentials: list,
          },
        })
      } else {
        throw response
      }
    },
    *run({ payload }, { call, put, select }) {
      yield put({
        type: 'updateState',
        payload: {
          pending: true,
        },
      })
      const { extraOptions } = yield select(_ => _.play)
      if (extraOptions) {
        try {
          payload.extraOptions = Yaml.parse(extraOptions)
        } catch (err) {
          yield put({
            type: 'updateState',
            payload: {
              pending: false,
            },
          })

          return message.error('invalid extra options syntax', err.message)
        }
      }
      if (payload.type === 'playbook') {
        const entry = yield select(_ => _.play.code)
        try {
          Yaml.parse(entry)
        } catch (err) {
          message.error('invalid yaml syntax', err.message)
        }
        payload.entry = entry
      }
      const response = yield call(service.execute, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            result: response.data,
            pending: false,
          },
        })
      } else {
        message.error(response.message)
      }

      yield put({
        type: 'updateState',
        payload: {
          pending: false,
        },
      })
    },
  },
  reducers: {
    loadInventoryTree(state, { payload }) {
      const content = payload.content
      const tree = []
      for (const group in content) {
        const hosts = content[group].hosts
        if (!hosts) {
          continue
        }

        const treeNode = {
          key: group,
          title: group,
          children: [],
        }

        for (const hostname in hosts) {
          const conn = hosts[hostname] || {}
          if (!conn.ansible_ssh_host) {
            continue
          }

          const hostNode = {
            key: 'hostname:' + hostname,
            title: 'hostname:' + hostname,
          }

          treeNode.children.push(hostNode)
          treeNode.children.push({
            key: 'host:' + conn.ansible_ssh_host,
            title: 'host:' + conn.ansible_ssh_host,
          })

          const sshUser = conn.ansible_ssh_user || 'root'
          const sshPort = conn.ansible_ssh_port || 22
          treeNode.children.push({
            key: sshUser,
            title: 'user:' + sshUser,
          })
          treeNode.children.push({
            key: sshPort,
            title: 'port:' + sshPort,
          })
        }
        tree.push(treeNode)
      }
      return { ...state, inventoryTree: tree }
    },
  },
})
