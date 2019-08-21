import modelExtend from 'dva-model-extend'
import { pageModel } from 'utils/model'
import { message } from 'antd'
import { getRegions, getGroups, addGroups, updateGroups } from './service'

export default modelExtend(pageModel, {
  namespace: 'cmdbGroup',
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
        if (location.pathname === '/cmdb/group') {
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
     const response = yield call(getGroups, payload)
     if (response.success) {
       const { list } = response.data
       yield put({
         type: 'querySuccess',
         payload: {
           list,
         },
       })
       const res = yield call(getRegions, payload)
       if (res.success) {
         yield put({
           type: 'updateState',
           payload: {
             regions: res.data.list,
           }
         })
       }
     } else {
       throw response
     }
   },
   * create({ payload }, { put, call }) {
      const response = yield call(addGroups, payload)
      if (response) {
        yield put({
          type: 'hideModal'
        })
      } else {
        throw response
      }
   },
   * update({ payload }, { put, call }) {
      const response = yield call(updateGroups, payload)
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
