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
        }
      })
    },
  },
  effects: {
    *query({ payload }, { put, call, select }) {
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
            },
          },
        })
        const { credentials, users, groups, regions } = yield select(
          _ => _.cmdb
        )
        if (!credentials.length) {
          yield put({
            type: 'queryCredentials',
            payload: {},
          })
        }

        if (!users.length) {
          yield put({
            type: 'searchUsers',
            payload: {},
          })
        }

        if (!regions.length) {
          yield put({
            type: 'searchRegions',
            payload: {
              keyword: '',
            },
          })
        }

        if (!groups.length) {
          yield put({
            type: 'searchGroups',
            payload: {
              keyword: '',
            },
          })
        }
      } else {
        throw response
      }
    },
    *queryCredentials({ payload }, { put, call, select }) {
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
    *delete({ payload }, { call, put }) {
      const response = yield call(service.delInventory, payload)
      if (response.success) {
        message.success('ok')
      } else {
        message.error(response.message)
      }
    },
    *importInventory({ payload }, { put, call }) {
      // @todo import from galaxy
      const response = yield call(service.addInventory(payload))
      if (response.success) {
      } else {
        throw response
      }
    },
    *create({ payload }, { put, call, select }) {
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
          type: 'hideModal',
        })
      } else {
        message.error(response.message)
      }
    },
    *updateDeviceInfo({ payload }, { call, select }) {
      const updateBucket = yield select(_ => _.cmdb.updateBucket)
      const response = yield call(service.updateInventory, updateBucket)
      if (response.success) {
        message.success('success')
      } else {
        throw response
      }
    },
    *searchUser({ payload }, { call, put, select }) {
      const result = yield select(_ => _.cmdb.users)
      if (result && result.length) {
        return
      }

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
    },
    *searchRegions({ payload }, { call, put }) {
      const response = yield call(service.searchRegions, payload)
      if (response.success) {
        const { list } = response.data || []
        yield put({
          type: 'updateState',
          payload: {
            regions: list,
          },
        })
      } else {
        throw response
      }
    },
    *searchGroups({ payload }, { call, put }) {
      put({
        type: 'updateState',
        payload: { pending: true },
      })
      const response = yield call(service.searchGroups, payload)
      if (response.success) {
        const { list } = response.data || []
        yield put({
          type: 'updateState',
          payload: {
            groups: list,
          },
        })
      } else {
        throw response
      }
      put({
        type: 'updateState',
        payload: { pending: false },
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
