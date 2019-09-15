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
        if (match) {
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
      console.log(payload)
    }
  },
  reducers: {

  }
})
