import ModelExtend from 'dva-model-extend'
import { pageModel } from 'utils/model'
import { message } from 'antd'
import * as service from './service'
import { getCredentials } from '../playbook/service'
import Yaml from 'yaml'

export default ModelExtend(pageModel, {
  namespace: 'adhoc',
  state: {
    doc: '',
    pending: false,
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
        if (location.pathname === '/job/adhoc') {
          dispatch({
            type: 'queryCredentials',
            payload: {
              ...location.query,
            }
          })
        }
      })
    }
  },
  effects: {
    * query({ payload }, { call, put }) {
      const response = yield call(service.getJobDetail, payload)
      if (response.success) {
        const { job, tasks } = response.data
        yield put({
          type: 'updateState',
          payload: {
            jobInfo: job,
            tasks: tasks,
          }
        })
      }
    },
    * queryDoc({ payload }, { call, put }) {
      const response = yield call(service.queryAnsibleDoc, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            preview: true,
            doc: response.data,
          }
        })
      }
    },
    * searchModules({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          pending: true
        }
      })
      const response = yield call(service.searchModules, payload)
      if (response.success) {
        const modules = response.data
        yield put({
          type: 'updateState',
          payload: {
            modules: modules
          }
        })
      } else {
        throw response
      }

      yield put({
        type: 'updateState',
        payload: {
          pending: false
        }
      })
    },
    * searchInventory({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          pending: true
        }
      })
      const response = yield call(service.searchInventory, payload)
      if (response.success) {
        const records = response.data || []
        yield put({
          type: 'updateState',
          payload: {
            pendingInventory: records
          }
        })
      } else {
        throw response
      }

      yield put({
        type: 'updateState',
        payload: {
          pending: false
        }
      })
    },
    * previewInventory({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          pending: true
        }
      })
      const response = yield call(service.previewInventory, payload)
      if (response.success) {
        let content = ''
        try {
          content = JSON.parse(response.data)
          yield put({
            type: 'loadInventoryTree',
            payload: {
              content,
            }
          })
        } catch (err) {
          yield put({
            type: 'updateState',
            payload: {
              pending: false
            }
          })
          message.warn('try parse inventory json failed~!')
        }

        yield put({
          type: 'updateState',
          payload: {
            preview: true,
            inventoryContent: content
          }
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            pending: false
          }
        })
        throw response
      }
    },
    * addJob({ payload }, { call, put, select }) {
      yield put({
        type: 'updateState',
        payload: {
          pending: true
        }
      })
      const { extraOptions } = yield select(_ => _.adhoc)
      if (extraOptions) {
        try {
          payload.extraOptions = Yaml.parse(extraOptions)
        } catch(err) {
          return message.error('invalid extra options syntax', err.message)
        }
      }

      const response = yield call(service.addJob, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            pending: false,
            preview: Boolean(response.data),
            result: response.data,
          }
        })
        message.success('ok')
      } else {
        yield put({
          type: 'updateState',
          payload: {
            pending: false
          }
        })

        throw response
      }
    },
    * queryCredentials({ payload }, { call, put }) {
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
      return { ...state, inventoryTree: tree}
    }
  }
})
