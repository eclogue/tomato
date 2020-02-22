import modelExtend from 'dva-model-extend'
import { pageModel } from 'utils/model'
import { message } from 'antd'
import { getCredentials, addCredential, updateCredential } from './service'

export default modelExtend(pageModel, {
  namespace: 'credential',
  state: {
    list: [],
    page: 1,
    total: 0,
    pageSize: 50,
    currentItem: {},
    selectedRowKeys: [],
    loading: true,
    modalVisible: false,
    modalType: 'create',
    credentialType: null,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/credential') {
          dispatch({
            type: 'query',
            payload: {
              ...location.query,
            },
          })
        }
      })
    },
  },

  effects: {
    *query({ payload }, { call, put }) {
      const response = yield call(getCredentials, payload)
      if (response.success) {
        const { list, pageSize, page, total } = response.data
        yield put({
          type: 'updateState',
          payload: {
            list,
            page,
            total,
            pageSize,
          },
        })
      } else {
        throw response
      }
    },
    *create({ payload }, { call, put }) {
      const response = yield call(addCredential, payload)
      if (response.success) {
        message.success('success')
        yield put({
          type: 'hideModal',
        })
      } else {
        message.error(response.message)
      }
    },
    *update({ payload }, { call, put }) {
      const response = yield call(updateCredential, payload)
      if (response.success) {
        message.success('success')
        yield put({
          type: 'hideModal',
        })
      } else {
        message.error(response.message)
      }
    },
  },
  reducers: {
    showModal(state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },
    hideModal(state) {
      return { ...state, modalVisible: false }
    },
  },
})
