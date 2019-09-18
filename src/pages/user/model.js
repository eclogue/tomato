import modelExtend from 'dva-model-extend'
import { pageModel } from 'utils/model'
import * as service from './service'
import { message } from 'antd';


export default modelExtend(pageModel, {
  namespace: 'user',
  state: {
    currentItem: {},
    action: 'getProfile',
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location, action) => {
        if (location.pathname === '/user') {
          dispatch({
            type: 'query',
            payload: location.query,
          })
        }
      })
    }
  },
  effects: {
    * query({ payload }, { call, put }) {
      const action = payload.action || 'profle'
      if (!service[action]) {
        return
      }

      const response = yield call(service[action], payload)
      if (response.success) {
        let result = response.data
        if (action === 'getSSHKey') {
          const { list, total, pageSize, page } = response.data
          result = {
            list: list,
            pagination: {
              current: Number(page) || 1,
              pageSize: Number(pageSize) || 50,
              total: total,
            },
          }
        }

        yield put({
          type: 'updateState',
          payload: {
            currentItem: result,
            action: action,
          }
        })
      } else {
        throw response
      }
    }
  },
  reducers: {

  }
})
