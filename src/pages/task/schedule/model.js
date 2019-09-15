import modelExtend from 'dva-model-extend'
import { pageModel } from 'utils/model'
import * as serivce from './service'
import { message } from 'antd'
import { routerRedux } from 'dva/router'

export default modelExtend(pageModel, {
  namespace: 'schedule',
  state: {
    schedule: null,
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        const query = location.query
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
        message.erro(response.message)
      }
    },
    * pause({ payload }, { call, put, select }) {
      const response = yield call(serivce.pauseSchedule, payload)
      if (response.success) {
        const location = yield select(_ => _.routing.location)
        yield put(routerRedux.replace({...location}))
      } else {
        message.error(response.message)
      }
    },
    * resume({ payload }, { call, put, select }) {
      const response = yield call(serivce.resumeSchedule, payload)
      if (response.success) {
        const location = yield select(_ => _.routing.location)
        yield put(routerRedux.replace({...location}))
      } else {
        message.error(response.message)
      }
    },
    * remove({ payload }, { call, put, select }) {
      const response = yield call(serivce.resumeSchedule, payload)
      if (response.success) {
        const location = yield select(_ => _.routing.location)
        yield put(routerRedux.replace({...location}))
      } else {
        message.error(response.message)
      }
    },
    * reschedule({ payload }, { call, put, select }) {
      const response = yield call(serivce.resumeSchedule, payload)
      if (response.success) {
        const location = yield select(_ => _.routing.location)
        yield put(routerRedux.replace({...location}))
      } else {
        message.error(response.message)
      }
    }
  },
  reducers: {
  }
})

