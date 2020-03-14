import modelExtend from 'dva-model-extend'
import { pageModel } from 'utils/model'
import * as service from './service'
import { pathMatchRegexp } from 'utils'

export default modelExtend(pageModel, {
  namespace: 'configDetail',
  state: {
    users: [],
    currentItem: {},
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const match = pathMatchRegexp('/cmdb/configuration/:id', location.pathname)
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
      const response = yield call(service.getConfig, payload)
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
    }
  },
  reducers: {

  }

})
