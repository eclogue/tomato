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
    },
    logs: [],
    logPagination: {
      current: 1,
      pageSize: 1000,
      total: 0,
    },
    currentTask: null,
    currentTaskState: null,
  },
  subscriptions: {
    sutup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/job/detail') {
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
      const response = yield call(service.getJobDetail, payload)
      if (response.success) {
        const { job, tasks, logs } = response.data

        yield put({
          type: 'updateState',
          payload: {
            jobInfo: job,
            tasks: tasks,
            logs: logs.map(item => item['message']),
          },
        })
        // if (tasks.length) {
        //   const params = {
        //     _id: tasks[0]._id,
        //     // _id: '5d677b6fe3f7e01bbefc7f17',
        //   }
        //   yield put({
        //     type: 'getTaskLogs',
        //     payload: params,
        //   })
        // }
      }
    },
    *manual({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          pending: true,
          logs: ['waiting...'],
        },
      })
      const { currentItem, income } = payload
      const body = {
        token: currentItem.token,
        income,
      }
      const response = yield call(service.runManual, body)
      if (response.success) {
        yield put({
          type: 'query',
          payload: {
            id: currentItem._id,
          },
        })
      } else {
        message.error(response.message)
      }

      yield put({
        type: 'updateState',
        payload: {
          pending: false,
        },
      })
    },
    *getTaskLogs({ payload }, { call, put }) {
      if (!payload._id) {
        return
      }

      yield put({
        type: 'updateState',
        payload: {
          fetching: true,
        },
      })

      const response = yield call(service.getTaskLogs, payload)
      if (response.success) {
        const { list, state } = response.data
        yield put({
          type: 'updateState',
          payload: {
            currentTask: payload._id,
            currentTaskState: state,
            logs: list,
          },
        })
      }

      yield put({
        type: 'updateState',
        payload: {
          fetching: false,
        },
      })
    },
    *rollback({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          pending: true,
          logs: ['waiting...'],
        },
      })

      const response = yield call(service.rollback, payload)
      if (response.success) {
        message.success('ok')
        yield put({
          type: 'getTaskLogs',
          payload: {
            _id: response.data,
          },
        })
      } else {
        message.error(response.message)
      }

      yield put({
        type: 'updateState',
        payload: {
          pending: false,
        },
      })
    },
  },
  reduecers: {},
})
