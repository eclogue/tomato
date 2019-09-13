import modelExtend from 'dva-model-extend'
import { pageModel } from 'utils/model'
import * as serivce from './service'

export default modelExtend(pageModel, {
  namespace: 'schedule',
  state: {
    schedule: null,
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const query = location.query
        console.log(query)
        if (location.pathname === '/task/schedule' && query.id) {
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
      const response = yield call(serivce.getSchedule, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            schedule: response.data,
          }
        })
      } else {
        throw response
      }
    },
  },
  reducers: {
  }
})

