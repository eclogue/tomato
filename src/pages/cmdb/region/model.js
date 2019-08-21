import modelExtend from 'dva-model-extend'
import { pageModel } from 'utils/model'
import { message } from 'antd'
import { getRegions, addRegions, updateRegions } from './service'

export default modelExtend(pageModel, {
  namespace: 'cmdbRegion',
  state: {
    list: [],
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
    currentItem: {},
    pending: [],
    regions: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/cmdb/region') {
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
     const response = yield call(getRegions, payload)
     if (response.success) {
       const { list } = response.data
       yield put({
         type: 'querySuccess',
         payload: {
           list,
         },
       })
     } else {
       throw response
     }
   },
   * create({ payload }, { put, call }) {
      const response = yield call(addRegions, payload)
      if (response) {
        yield put({
          type: 'hideModal'
        })
      } else {
        throw response
      }
   },
   * update({ payload }, { put, call }) {
      const response = yield call(updateRegions, payload)
      if (response) {
        yield put({
          type: 'hideModal'
        })
      } else {
        throw response
      }
   }
  },

  reducers: {
    showModal(state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },
    hideModal(state) {
      return { ...state, modalVisible: false }
    },
  },
})
