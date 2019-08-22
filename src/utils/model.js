import modelExtend from 'dva-model-extend'
import { getUserByName } from './service'

export const model = {
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}

export const pageModel = modelExtend(model, {
  state: {
    list: [],
    users: [],
    pending: false,
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `Total ${total} Items`,
      current: 1,
      total: 0,
      pageSize: 10,
    },
  },
  effects: {
    * searchUser({ payload }, { call, put }) {
      const response = yield call(getUserByName, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            users: response.data
          }
        })
      } else {
        throw response
      }
    },
  },
  reducers: {
    querySuccess(state, { payload }) {
      const { list, pagination } = payload
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
        ...payload,
      }
    },
    updateState(state, { payload }) {
      return { ...state, ...payload }
    }
  },
})
