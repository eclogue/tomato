import modelExtend from 'dva-model-extend'
import { pageModel } from 'utils/model'
import * as service from './service'
import { message } from 'antd';


export default modelExtend(pageModel, {
  namespace: 'logger',
  state: {
    currentItem: {},
    list:[],
  },
  subscriptions: {
    setup({history, dispatch}){
      history.listen(location => {
        if (location.pathname === '/log') {
          dispatch({
            type: 'query',
            payload: {
              ...location.query
            }
          })
        }
      })
    }
  },
  effects: {
    * query({ payload }, { call, put }) {
      const response = yield call(service.queryLogs, payload)
      if (response.success) {
        const { list, page, total, pageSize } = response.data

        yield put({
          type: 'querySuccess',
          payload: {
            list,
            pagination: {
              current: page,
              pageSize,
              total,
            },
          },
        })
      }
    }
  },
  reducers: {

  }
})
