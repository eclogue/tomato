import modelExtend from 'dva-model-extend'
import { pageModel } from 'utils/model'
import * as service from './service'
import { message } from 'antd';


export default modelExtend(pageModel, {
  namespace: 'notification',
  state: {
    list: [],
    currentItem: {},
  },
  subscriptions: {
    setup({ dispatch, history}) {
      history.listen((location) => {
        if (location.pathname === '/notification') {
          dispatch({
            type: 'query',
            payload: location.query
          })
        }
      })
    }
  },
  effects: {
    * query({ payload }, { call, put }) {
      const response = yield call(service.getNotifications, payload)
      if (response.success) {
        const { page, pageSize, total, list } = response.data
        yield put({
          type: 'querySuccess',
          payload: {
            list,
            pagination: {
              current: page,
              pageSize,
              total: total,
            }
          }
        })
      } else {
        throw response
      }
    },
    * read({ payload }, { call, put }) {
      const response = yield call(service.markRead, payload)
      if (response.success) {
        message.success('ok')
      } else {
        throw response
      }
    },
  },
  reducers: {

  }
})
