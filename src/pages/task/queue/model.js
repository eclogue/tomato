import modelExtend from 'dva-model-extend'
import * as service from './service'
import { pageModel } from 'utils/model'
import { message } from 'antd'

export default modelExtend(pageModel, {
  namespace: 'queue',
  state: {
    tasks: [],
    total: 0,
    pagination: {
      current: 1,
      total: 0,
      pageSize: 50,
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/task/queue') {
          dispatch({
            type: 'query',
            payload: {
              ...location.query,
              pathname: location.pathname,
            },
          })
        }
      })
    },
  },
  effects: {
    *query({ payload }, { put, call }) {
      const response = yield call(service.getQueueTasks, payload)
      if (response.success) {
        const { list, total, page, pageSize } = response.data
        yield put({
          type: 'querySuccess',
          payload: {
            list: list,
            pagination: {
              current: Number(page) || 1,
              pageSize: Number(pageSize) || 50,
              total: total,
            },
          },
        })
      } else {
        throw response
      }
    },
  },

  reducers: {
    loadBookshelf(state, { payload }) {
      const books  = payload.books.map((book) => {
        return {
          value: book.name,
          label: book.name,
          isLeaf: false,
        }
      })

      return { ...state, books }
    },
  },

})
