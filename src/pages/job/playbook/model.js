import modelExtend from 'dva-model-extend'
import * as service from './service'
import { pageModel } from 'utils/model'
import { message } from 'antd'
import Yaml from 'yaml'

export default modelExtend(pageModel, {
  namespace: 'playbookJob',
  state: {
    books: [],
    inventory: [],
    currentBookshelf: null,
    task: {},
    roles: [],
    entries: [],
    currentStep: 0,
    steps: [],
    pending: false,
    pendingInventory: [],
    inventoryType: 'cmdb',
    currentBook: null,
    tags: [],
    tasks: [],
    extraVars: [],
    template: {},
    users: [],
    pendingSubset: [],
    apps: [],
    credentials: [],
    currentId: null,
    preview: false,
    previewContent: null,
    previewTitle: '',
    runOptions: '',
    extraOptions: '',
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/job/playbook') {
          const query = location.query || {}
          const id = query.id
          dispatch({
            type: 'init',
            payload: {
              ...location.query,
            },
          })
          if (id) {
            dispatch({
              type: 'getJobDetail',
              payload: {
                _id: id,
              },
            })
          }
        }
      })
    },
  },
  effects: {
    *init({ payload }, { put, call }) {
      let response = yield call(service.getBookshelf, payload)
      if (response.success) {
        const list = response.data
        yield put({
          type: 'loadBookshelf',
          payload: {
            books: list,
          },
        })
      } else {
        throw response
      }
      response = yield call(service.getApps, payload)
      if (response.success) {
        const { list } = response.data
        yield put({
          type: 'updateState',
          payload: {
            apps: list,
          },
        })
      } else {
        throw response
      }
      response = yield call(service.getCredentials, payload)
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
    *query({ payload }, { put, call }) {
      const response = yield call(service.getBookshelf, payload)
      if (response.success) {
        const list = response.data
        yield put({
          type: 'loadBookshelf',
          payload: {
            books: list,
          },
        })
      } else {
        throw response
      }
    },
    *getJobDetail({ payload }, { put, call }) {
      const response = yield call(service.getJobDetail, payload)
      if (response.success) {
        const { record, previewContent, hosts, roles } = response.data
        const { template, extra, _id } = record
        let extraOptions = template.extraOptions || ''
        if (extraOptions) {
          extraOptions = Yaml.stringify(extraOptions)
        }

        yield put({
          type: 'updateState',
          payload: {
            extra,
            roles,
            template,
            previewContent,
            preview: true,
            currentId: _id,
            extraOptions: extraOptions || '',
            pendingInventory: hosts,
            previewInventory: previewContent,
            previewTitle: 'register inventory',
          },
        })
      } else {
        throw response
      }
    },

    *searchInventory({ payload }, { put, call, select }) {
      const pending = yield select(_ => _.playbookJob.pending)
      if (pending) {
        return
      }
      yield put({
        type: 'updateState',
        payload: {
          pending: true,
        },
      })
      const [type, currentBook] = yield select(_ => [
        _.playbookJob.inventoryType,
        _.playbookJob.currentBook,
      ])
      if (type === 'file' && !currentBook) {
        return message.warning('You must select entry first~!')
      }

      payload.type = type
      payload.book = currentBook
      const response = yield call(service.searchInventory, payload)
      if (response.success) {
        const records = response.data || []
        yield put({
          type: 'updateState',
          payload: {
            pendingInventory: records,
            pending: false,
          },
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            pending: false,
          },
        })
        message.warning(response.message)
      }
    },
    *fetchPlaybook({ payload }, { call, put }) {
      const response = yield call(service.getPlaybooks, payload)
      if (response.success) {
        const list = response.data
        yield put({
          type: 'loadPlaybooks',
          payload: {
            list: list,
            name: payload.name,
          },
        })
      } else {
        throw response
      }
    },
    *fetchEntry({ payload }, { call, put }) {
      const response = yield call(service.getEntry, payload)
      if (response.success) {
        const list = response.data
        yield put({
          type: 'loadEntry',
          payload: {
            list: list,
            id: payload.id,
          },
        })
      } else {
        throw response
      }
    },
    *fetchInventory({ payload }, { call, put }) {
      const response = yield call(service.getInventory, payload)
      if (response.success) {
        const list = response.data
        yield put({
          type: 'loadInventory',
          payload: {
            list: list,
            name: payload.name,
          },
        })
      } else {
        throw response
      }
    },
    *fetchRoles({ payload }, { call, put }) {
      const response = yield call(service.getRoles, payload)
      if (response.success) {
        const list = response.data
        yield put({
          type: 'loadRoles',
          payload: {
            list: list,
            id: payload.id,
          },
        })
      } else {
        throw response
      }
    },
    *addJob({ payload }, { call, put, select }) {
      const currentState = yield select(_ => _.playbookJob)
      const {
        template,
        extraVars,
        currentId,
        extraOptions,
        inventoryType,
      } = currentState
      payload.extra = Object.assign({}, payload.extra, { extraVars })
      if (!template) {
        return false
      }

      template.inventoryType = inventoryType
      if (extraOptions) {
        try {
          template.extraOptions = Yaml.parse(extraOptions)
        } catch (err) {
          return message.error('invalid extra options syntax', err.message)
        }
      }

      const params = {
        currentId,
        template,
        type: 'playbook',
        extra: payload.extra,
        check: Boolean(payload.check),
      }

      yield put({
        type: 'updateState',
        payload: {
          pending: true,
        },
      })
      const response = yield call(service.addJob, params)
      if (response.success) {
        if (response.data) {
          const { result, options } = response.data
          const { success, failed } = result
          yield put({
            type: 'updateState',
            payload: {
              runOptions: options,
              preview: true,
              previewTitle: 'Job check result',
              previewContent: {
                success,
                failed,
              },
            },
          })
        }
      } else {
        message.error(response.message)
      }

      message.success('ok')
      yield put({
        type: 'updateState',
        payload: {
          pending: false,
        },
      })
    },
    *checkJob({ payload }, { call, put, select }) {
      const currentState = yield select(_ => _.playbookJob)
      const { template, extraVars, currentId } = currentState
      payload.extra = Object.assign({}, payload.extra, { extraVars })
      if (!template) {
        return false
      }

      const params = {
        currentId,
        template,
        type: 'playbook',
        extra: payload.extra,
        check: Boolean(payload.check),
      }
      const response = yield call(service.addJob, params)
      if (response.success) {
        // message.success('ok')
        const { result, options } = response.data
        yield put({
          type: 'updateState',
          payload: {
            runOptions: options,
            preview: true,
            previewContent: result,
            previewTitle: 'Job preview',
          },
        })
      } else {
        message.error('add job failed: ' + response.message)
      }
      yield put({
        type: 'updateState',
        payload: {
          pending: false,
        },
      })
    },
    *fetchTags({ payload }, { call, put, select }) {
      yield put({
        type: 'updateState',
        payload: {
          pending: true,
        },
      })
      const type = yield select(_ => _.playbookJob.inventoryType)
      const { template } = payload
      template.inventoryType = type
      const response = yield call(service.fetchTags, { template })
      if (response.success) {
        const { tags, tasks } = response.data
        yield put({
          type: 'updateState',
          payload: {
            tags,
            tasks,
          },
        })
      } else {
        yield put({
          type: 'updateState',
          payload: {
            pending: false,
          },
        })
        // throw response
      }
      yield put({
        type: 'updateState',
        payload: {
          pending: false,
        },
      })
    },
    *searchUser({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          pending: true,
        },
      })
      const response = yield call(service.getUserByName, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            users: response.data,
          },
        })
      } else {
        throw response
      }
      yield put({
        type: 'updateState',
        payload: {
          pending: true,
        },
      })
    },
    *previewInventory({ payload }, { call, put }) {
      const response = yield call(service.previewInventory, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            preview: true,
            previewContent: response.data,
            previewTitle: 'Current inveotry',
            inventoryContent: response.data,
          },
        })
      } else {
        throw response
      }
    },
    *checkJobName({ payload }, { call, put }) {
      // yield call(service.checkJobName, payload)
    },
  },
  reducers: {
    loadBookshelf(state, { payload }) {
      const books = payload.books.map(book => {
        return {
          value: book._id,
          label: book.name,
          isLeaf: false,
        }
      })

      return { ...state, books }
    },
    loadPlaybooks(state, { payload }) {
      const { list, name } = payload
      const books = state.books.map(book => {
        if (book.value !== name) {
          return book
        }
        book.loading = false
        book.children = list.map(item => {
          return {
            value: item._id,
            label: item.name,
            isLeaf: true,
          }
        })

        return book
      })
      return { ...state, books, currentBookshelf: name }
    },
    loadInventory(state, { payload }) {
      const inventory = []
      payload.list.map((item, index) => {
        const { groups, name } = item
        const group = {
          title: `all(${name})`,
          value: name,
          key: index,
          children: [],
        }
        for (const key in groups) {
          const hosts = groups[key]
          if (!hosts.length || key === 'all') {
            continue
          }

          const title = key
          const data = {
            title: title,
            value: key + '#' + name,
            key: index + '#' + key,
          }
          if (hosts.length) {
            data.children = hosts.map(host => {
              return {
                title: host,
                value: host + '#' + name,
                key: index + '@' + key,
              }
            })
          }
          group.children.push(data)
        }
        inventory.push(group)
      })

      return { ...state, inventory }
    },
    loadRoles(state, { payload }) {
      const { list } = payload
      return { ...state, roles: list }
    },
    loadEntry(state, { payload }) {
      const { list, id } = payload
      const books = state.books.map(book => {
        // if (book._id !== id) {
        //   return book
        // }
        book.loading = false
        book.children = list.map(item => {
          return {
            value: item._id,
            label: item.name,
            isLeaf: true,
          }
        })

        return book
      })

      return { ...state, books, currentBook: id }
    },
    matchSubset(state, { payload }) {
      const keyword = payload.keyword
      let inventoryContent = state.inventoryContent
      let matches = []
      if (inventoryContent && typeof inventoryContent === 'object') {
        for (const group in inventoryContent) {
          const current = inventoryContent[group]
          if (!current || !current.hosts) {
            continue
          }

          const hostnames = Object.keys(current.hosts)
          hostnames.map(name => {
            const match = name.match(keyword)
            if (match) {
              matches.push(name)
            }
            return name
          })
        }
      }

      matches.push(keyword)
      return { ...state, pendingSubset: matches || [] }
    },
  },
})
