import modelExtend from 'dva-model-extend'
import { pageModel } from 'utils/model'
import {message} from 'antd'
import * as service from './service'

export default modelExtend(pageModel, {
  namespace: 'taskHistory',
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
    credentialType: null
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/task/history') {
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
    * query ({ payload }, { call, put }) {
      const response = yield call(service.getTaskHistory, payload)
      if (response.success) {
        const {list, pageSize, page, total} = response.data
        yield put({
          type: 'querySuccess',
          payload: {
            list,
            pagination: {
              current: page,
              pageSize: pageSize,
              total,
            }
          }
        })
      } else {
        throw response
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
  }
});
