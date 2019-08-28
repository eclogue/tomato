import ModelExtend from 'dva-model-extend'
import { pageModel } from 'utils/model'
import { message } from 'antd'
import * as service from './service'

export default ModelExtend(pageModel, {
  namespace: 'jobDetail',
  state: {
    jobInfo: {},
    tasks: [],
    pagination: {
      current: 1,
      total: 0,
      pageSize: 50,
    }
  },
  subscriptions: {
    sutup({ dispatch, history }) {
      history.listen(location => {
        console.log(location.pathname)
        if (location.pathname === '/job/detail') {
          dispatch({
            type: 'query',
            payload: {
              ...location.query,
            }
          })
        }
      })
    }
  },
  effects: {
    * query({ payload }, { call, put }) {
      const response = yield call(service.getJobDetail, payload)
      if (response.success) {
        const { job, tasks } = response.data
        yield put({
          type: 'updateState',
          payload: {
            jobInfo: job,
            tasks: tasks,
          }
        })
      }
    },
    * manual({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          pending: true
        }
      })
      const { currentItem, income } = payload
      const body = {
        token: currentItem.token,
        ...income
      }
      const response = yield call(service.runManual, body)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            taskId: response.data,
          }
        })
      } else {
        message.error(response.message)
      }

      yield put({
        type: 'updateState',
        payload: {
          pending: false
        }
      })
    }
  },
  reduecers: {

  }
})
