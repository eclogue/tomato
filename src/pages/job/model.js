import modelExtend from 'dva-model-extend'
import { pageModel } from 'utils/model'
import * as service from './service'
import { message } from 'antd';

export default modelExtend(pageModel, {
  namespace: 'job',
  state: {
    list: [],
    page: 1,
    total: 0,
    pageSize: 50,
    currentItem: {},
    selectedRowKeys: [],
    previewContent: '',
    visible: false,
    pending: false,
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/job') {
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
    * query ({ payload }, { call, put, select }) {
      const pending = yield select(_ => _.job.pending)
      if (pending) {
        return false
      }
      yield put({
        type: 'updateState',
        payload: {
          pending: !pending,
        }
      })
      const response = yield call(service.getJobs, payload)
      if (response.success) {
        yield put({
          type: 'querySuccess',
          payload: response.data
        })
      } else {
        throw response
      }
      yield put({
        type: 'updateState',
        payload: {
          pending: false,
        }
      })
    },
    * checkJob({ payload }, { call, put, select }) {
      const pending = yield select(_ => _.job.pending)
      if (pending) {
        return false
      }
      yield put({
        type: 'updateState',
        payload: {
          pending: !pending,
        }
      })
      const response = yield call(service.checkJob, payload)
      if (response.success) {
        yield put({
          type: 'showDrawer',
          payload: {
            previewContent: response.data
          }
        })
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
    }
  },
  reducers: {
    showDrawer(state, { payload }) {
      return { ...state, ...payload, visible: true }
    }
  }
});
