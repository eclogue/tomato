import modelExtend from 'dva-model-extend'
import { pageModel } from 'utils/model'
import * as serivce from './service'

export default modelExtend(pageModel, {
  namespace: 'task',
  state: {
    monitor: [],
    currentItem: {},
    selectedRowKeys: [],
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/task') {
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
      const response = yield call(serivce.monitor, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            monitor: response.data
          }
        })
      } else {
        throw response
      }
    },
  },
  reducers: {

  }
});
