import modelExtend from 'dva-model-extend'
import * as service from './service'
import { pageModel } from 'utils/model'
import { message } from 'antd'
import { stringifyYaml } from 'utils'
import { routerRedux } from 'dva/router'

export default modelExtend(pageModel, {
  namespace: 'playbook',
  state: {
    list: [],
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    uploader: [],
    formData: [],
    file: null,
    editFile: {},
    drawerVisible: false,
    configs: [],
    variables: [],
    fileList: [],
    configVariables: '',
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location, action, ...args) => {
        if (location.pathname === '/book/view') {
          if (action !== 'REPLACE') {
            dispatch({
              type: 'query',
              payload: {
                ...location.query,
              },
            })
          }

          const current = location.query.current
          if (current) {
            dispatch({
              type: 'getFile',
              payload: {
                id: current,
              },
            })
          }
        }
      })
    },
  },
  effects: {
    *query({ payload }, { call, put, select }) {
      const response = yield call(service.getPlaybook, payload)
      if (response.success) {
        const list = response.data
        yield put({
          type: 'querySuccess',
          payload: {
            list,
            currentItem: {},
          },
        })
      } else {
        throw response
      }
    },
    *update({ payload }, { call, put, select }) {
      const file = yield select(s => s.playbook.file)
      if (!file) {
        return message.warning('invalid file')
      }

      payload = Object.assign({}, file, payload)
      const response = yield call(service.editPlaybook, payload)
      if (response.success) {
        message.success('succss')
      } else {
        message.error(response.message)
      }
    },
    *upload({ payload }, { call, put }) {
      const formData = {}
      const { uploader } = payload
      const { file } = uploader
      const data = Object.assign({}, formData)
      data.files = file
      data._id = payload._id
      const response = yield call(service.uploadFile, data)
      if (response.success) {
        yield put({
          type: 'hideModal',
        })
        message.success('success')
      } else {
        message.error(response.message)
      }
    },
    *addFolder({ payload }, { call, put, select }) {
      const { file } = yield select(_ => _.playbook)
      const { data } = payload
      data.book_id = file.book_id
      data.parent = file.path
      const response = yield call(service.addFolder, data)
      if (response.success) {
        message.success('success')
        yield put({
          type: 'hideModal',
        })
      } else {
        message.error(response.message)
      }
    },
    *getFile({ payload }, { call, put }) {
      const response = yield call(service.getFile, payload)
      if (response.success) {
        const file = response.data
        yield put({
          type: 'updateState',
          payload: {
            file,
            currentItem: file,
            currentFileId: payload.id,
          },
        })
      } else {
        message.error(response.message)
      }
    },
    *updateFile({ payload }, { call, put, select }) {
      const id = yield select(_ => _.playbook.file._id || null)
      if (!id) {
        return message.warning('current file not found')
      }

      payload = yield select(_ => _.playbook.editFile)
      payload._id = id
      const response = yield call(service.editPlaybook, payload)
      if (response.success) {
        message.success('success')
      } else {
        message.error(response.message)
      }
    },
    *renameFile({ payload }, { call, put, select }) {
      yield put({
        type: 'updateState',
        payload: {
          pending: true,
        },
      })
      const response = yield call(service.renameFile, payload)
      if (response.success) {
        const query = yield select(_ => _.app.locationQuery)
        yield put({
          type: 'query',
          payload: query,
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
    *searchConfig({ payload }, { call, put }) {
      const response = yield call(service.searchConfig, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            configs: response.data || [],
          },
        })
      }
    },
    *registerConfig({ payload }, { call, put, select }) {
      const response = yield call(service.listConfigs, payload)
      if (response.success) {
        const list = response.data
        const bucket = {}
        for (const item of list) {
          const variables = item.variables
          if (!variables || typeof variables !== 'object') {
            continue
          }

          for (const key in variables) {
            const field = ['ECLOGUE_CONFIG', item.name, key].join('_')
            bucket[field] = variables[key]
          }
        }

        yield put({
          type: 'updateState',
          payload: {
            configVariables: stringifyYaml(bucket),
          },
        })
      }
    },
    *batchUpload({ payload }, { call, put, select }) {
      const state = yield select(_ => _.playbook)
      const { fileList, file } = state
      if (!file) {
        return false
      }

      const bookId = file.book_id
      const parent = file._id
      const params = {
        parent,
        bookId,
      }

      for (const item of fileList) {
        params.files = item
        const result = yield call(service.uploadFile, params)
        if (result.success) {
          yield put({
            type: 'removeFile',
            payload: { file },
          })
        }
      }

      message.success('success')
    },
    *delFile({ payload }, { put, call, select }) {
      const { id, query, pathname } = payload
      const response = yield call(service.removeFile, { id })
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            file: null,
          },
        })
        const res = routerRedux.push({
          pathname: pathname,
          query: { id: query.id },
        })
        yield put(res)
      }
    },
    *run({ payload }, { call, put }) {
      const response = yield call(service.run, payload)
      if (response.success) {
        message.ok('fuck')
      } else {
        message.error('world')
      }
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    showModal(state, { payload }) {
      const currentItem = payload
      return { ...state, currentItem, modalVisible: true }
    },
    hideModal(state) {
      return { ...state, modalVisible: false }
    },
    appendFile(state, { payload }) {
      const { formData } = state
      const { uploader } = payload
      const { file } = uploader
      const data = Object.assign({}, formData)
      data.files = file

      return { ...state, uploader, formData: data }
    },
    addFile(state, { payload }) {
      const { uploader } = payload
      const fileList = state.fileList
      fileList.push(uploader)
      return { ...state, fileList }
    },
    resetFileList(state) {
      return { ...state, fileList: [], uploader: null }
    },
  },
})
