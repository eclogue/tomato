import modelExtend from 'dva-model-extend'
import { pageModel } from 'utils/model'
import * as service from './service'
import { message } from 'antd'

export default modelExtend(pageModel, {
  namespace: 'setting',
  state: {
    currentItem: {},
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        console.log(location)
        if (location.pathname === '/setting') {
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
      const response = yield call(service.getSetting, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: response.data || {},
          },
        })
      } else {
        message.error(response.message)
      }
    },
    *add({ payload }, { call, put }) {
      const response = yield call(service.addSetting, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: response.data || {},
        })
      } else {
        message.error(response.message)
      }
    },
  },
  reducers: {},
})
