import modelExtend from 'dva-model-extend'
import { pageModel } from 'utils/model'
import { message } from 'antd'
import * as service from './service'

export default modelExtend(pageModel, {
  namespace: 'cmdbApp',
  state: {
    list: [],
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
    currentItem: {},
    pending: [],
    regions: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/cmdb/application') {
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
    * query({ payload }, { put, call }) {
      const response = yield call(service.getApps, payload)
      if (response.success) {
        yield put({
          type: 'querySuccess',
          payload: response.data
        })
      } else {
        throw response
      }
    },
    * create({ payload }, { put, call }) {
      const response = yield call(service.addApps, payload)
      if (response.success) {
        yield put({
          type: 'hideModal'
        })
      } else {
        throw response
      }
    },
    * update({ payload }, { put, call }) {
      const response = yield call(service.editApps, payload)
      if (response.success) {
        yield put({
          type: 'hideModal'
        })
      } else {
        throw response
      }
    }
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
