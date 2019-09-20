import modelExtend from 'dva-model-extend'
import { pageModel } from 'utils/model'
import * as service from './service'
import { message } from 'antd';


export default modelExtend(pageModel, {
  namespace: 'dashboard',
  state: {
    currentItem: {},
  },
  subscriptions: {
    setup({ dispatch, history}) {
      history.listen(location => {
        if (location.pathname === '/dashboard') {
          console.log(location)
          dispatch({
            type: 'query',
            payload: {
              ...location.query
            }
          })
        }
      })
    }
  },
  effects: {
    * query({ payload }, { call, put }) {
      const response = yield call(service.dashboard, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: response.data,
        })
      } else {
        message.error(response.message)
      }
    }
  },
  reducers: {

  }
})
