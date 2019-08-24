import modelExtend from 'dva-model-extend'
import { pageModel } from 'utils/model'
import * as service from './service'
import { pathMatchRegexp } from 'utils'
import { message } from 'antd';

export default modelExtend(pageModel, {
  namespace: 'inventoryDetail',
  state: {
    pending: false,
    users: [],
    currentItem: {},
    facts: null
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const match = pathMatchRegexp('/cmdb/inventory/:id', location.pathname)
        if (match) {
          dispatch({
            type: 'query',
            payload: {
              _id: match[1],
            },
          })
        }
      })
    },
  },
  effects: {
    * query({ payload }, { put, call }) {
      const response = yield call(service.getInventory, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: response.data
          }
        })
      } else {
        throw response
      }
    },
    * save({ payload }, { put, call }) {
      yield put({
        type: 'updateState',
        payload: {
          pending: true,
        }
      })
      const response = yield call(service.saveInventory, payload)
      if (response.success) {
        message.success('ok')
      } else {
        message.error(response.message)
      }
      yield put({
        type: 'updateState',
        payload: {
          pending: false,
        }
      })
    },
  },
  reducers: {

  }

})
