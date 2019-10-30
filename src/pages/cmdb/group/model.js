import modelExtend from 'dva-model-extend'
import { pageModel } from 'utils/model'
import { message } from 'antd'
import * as service from './service'
import { searchRegions } from '../service'

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
          dispatch({
            type: 'searchRegions',
          })
        }
      })
    },
  },
  effects: {
    *query({ payload }, { put, call }) {
      const response = yield call(service.getGroups, payload)
      if (response.success) {
        const { list } = response.data
        yield put({
          type: 'querySuccess',
          payload: {
            list,
          },
        })
        const res = yield call(service.getRegions, payload)
        if (res.success) {
          yield put({
            type: 'updateState',
            payload: {
              regions: res.data.list,
            },
          })
        }
      } else {
        throw response
      }
    },
    *create({ payload }, { put, call }) {
      const response = yield call(service.addGroups, payload)
      if (response) {
        yield put({
          type: 'hideModal',
        })
      } else {
        throw response
      }
    },
    *update({ payload }, { put, call }) {
      const response = yield call(service.updateGroups, payload)
      if (response) {
        yield put({
          type: 'hideModal',
        })
      } else {
        throw response
      }
    },
    *delete({ payload }, { call, put }) {
      const response = yield call(service.deleteGroup, payload)
      if (response.success) {
        message.success('ok')
      } else {
        message.error(response.message)
      }
    },
    *searchRegions({ payload }, { call, put }) {
      const response = yield call(searchRegions, payload)
      if (response.success) {
        const { list } = response.data || []
        yield put({
          type: 'updateState',
          payload: {
            regions: list,
          },
        })
      } else {
        throw response
      }
    },
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
