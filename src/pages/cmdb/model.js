import modelExtend from 'dva-model-extend'
import * as service from './service'
import { pageModel } from 'utils/model'
import { message } from 'antd'

export default modelExtend(pageModel, {
  namespace: 'cmdb',
  state: {
    pending: false,
    list: [],
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
    currentItem: {},
    formData: [],
    fileList: [],
    uploader: null,
    users: [],
    updateBucket: null,
    regions: [],
    groups: [],
    credentials: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location, action) => {
        if (location.pathname === '/cmdb') {
          dispatch({
            type: 'query',
            payload: {
              ...location.query,
              pathname: location.pathname,
            },
          })
          dispatch({
            type: 'queryCredentials',
            payload: {
              ...location.query,
            },
          })
          dispatch({
            type: 'searchRegions',
            payload: {
              keyword: '',
            },
          })
          dispatch({
            type: 'searchGroups',
            payload: {
              keyword: '',
            },
          })
        }
      })
    },
  },
  effects: {
    *query({ payload }, { put, call }) {
      const response = yield call(service.getDevices, payload)
      if (response.success) {
        const { list, page, pageSize, total } = response.data
        yield put({
          type: 'querySuccess',
          payload: {
            list,
            pagination: {
              current: page,
              pageSize: pageSize,
              total: total,
            }
          },
        })
      } else {
        throw response
      }
    },
    * queryCredentials({ payload }, { put, call, select }) {
      const result = yield select(_ => _.cmdb.credentials)
      if (result && result.length) {
        return
      }

      const response = yield call(service.getCredentials, payload)
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
    *importInventory({ payload }, { put, call}) {
      const response = yield call(service.addInventory(payload))
      if (response.success) {
      } else {
        throw response
      }
    },
    * create({ payload }, { put, call, select}) {
      if (payload.type === 'file') {
        const inventory = yield select(_ => _.cmdb.fileList)
        if (!inventory.length) {
          return message.error('inventory file is empty~!')
        }

        payload.inventory = inventory[0]
      }

      const response = yield call(service.addInventory, payload)
      if (response.success) {
        message.success('success')
        yield put({
          type: 'hideModal'
        })
      } else {
        throw response
      }
    },
    * updateDeviceInfo({ payload }, { call, select}) {
      const updateBucket = yield select(_ => _.cmdb.updateBucket)
      const response = yield call(service.updateInventory, updateBucket)
      if (response.success) {
        message.success('success')
      } else {
        throw response
      }
    },
    * searchUser({ payload }, { call, put, select }) {
      const result = yield select(_ => _.cmdb.users)
      if (result && result.length) {
        return
      }

      const response = yield call(service.getUserByName, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            users: response.data
          }
        })
      } else {
        throw response
      }
    },
    * searchRegions({ payload }, { call, put }) {
      const response = yield call(service.searchRegions, payload)
      if (response.success) {
        const { list } = response.data || []
        yield put({
          type: 'updateState',
          payload: {
            regions: list
          }
        })
      } else {
        throw response
      }
    },
    * searchGroups({ payload }, { call, put }) {
      put({
        type: 'updateState',
        payload: { pending: true}
      })
      const response = yield call(service.searchGroups, payload)
      if (response.success) {
        const { list } = response.data || []
        yield put({
          type: 'updateState',
          payload: {
            groups: list
          }
        })
      } else {
        throw response
      }
      put({
        type: 'updateState',
        payload: { pending: false}
      })
    },
  },

  reducers: {
    showModal(state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },
    hideModal(state) {
      return { ...state, modalVisible: false }
    },
    addFile(state, { payload }) {
      const { uploader } = payload

      return { ...state, uploader, fileList: [uploader.file] }
    },
    setFileList(state, { payload }) {
      const { fileList } = state
      const { data, file } = payload
      const preview = {
        ...file,
        status: 'done',
        url: data,
        thumbUrl: data,
      }

      fileList.push(preview)

      return { ...state, fileList }
    },
    resetFileList(state) {
      return { ...state, fileList: [], uploader: null }
    },

  },
})
