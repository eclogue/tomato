import modelExtend from 'dva-model-extend'
import { pageModel } from 'utils/model'
import * as service from './service'
import { message } from 'antd'
import { pathMatchRegexp } from 'utils'


export default modelExtend(pageModel, {
  namespace: 'taskDetail',
  state: {
    currentItem: {},
  },
  subscriptions: {
    setup({ history, dispatch }){
      history.listen(location => {
        const match = pathMatchRegexp('/task/history/:id', location.pathname)
        console.log('mm', match)
        if (match) {
          const _id = match[1]
          dispatch({
            type: 'query',
            payload: {
              _id
            }
          })
        }
      })
    }
  },
  effects: {
    * query({ payload }, { call, put }) {
      const response = yield call(service.getTaskDetail, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: response.data
          }
        })
      } else {
        message.error(response.message)
      }
    }
  },
  reducers: {

  }
})
