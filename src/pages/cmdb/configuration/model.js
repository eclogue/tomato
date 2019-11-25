import modelExtend from 'dva-model-extend'
import { pageModel } from 'utils/model'
import * as service from './service'
import { getUserByName } from '../service'
import { message } from 'antd'
import Yaml from 'yaml'

export default modelExtend(pageModel, {
  namespace: 'config',
  state: {
    list: [],
    users: [],
    page: 1,
    total: 0,
    pageSize: 50,
    currentItem: {},
    selectedRowKeys: [],
    fileList: [],
    modalVisible: false,
    modalType: 'create',
    variables: '',
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/cmdb/configuration') {
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
      const response = yield call(service.getConfigurations, payload)
      if (response.success) {
        const { list, pageSize, page, total } = response.data
        yield put({
          type: 'updateState',
          payload: {
            list,
            page,
            total,
            pageSize,
          },
        })
        yield put({
          type: 'searchUser',
          payload: {},
        })
      } else {
        throw response
      }
    },
    *create({ payload }, { call, put, select }) {
      const variables = yield select(_ => _.config.variables)
      try {
        payload.variables = Yaml.parse(variables)
      } catch (err) {
        return message.error('yaml syntax error' + err.message)
      }

      const response = yield call(service.addConfig, payload)
      if (response.success) {
        message.success('success')
        yield put({
          type: 'hideModal',
        })
      } else {
        message.error('create failed', response.message)
      }
    },
    *edit({ payload }, { call, put, select }) {
      const variables = yield select(_ => _.config.variables)
      try {
        payload.variables = Yaml.parse(variables)
      } catch (err) {
        return message.error('yaml syntax error', err.message)
      }

      const response = yield call(service.editConfig, payload)
      if (response.success) {
        message.success('success')
        yield put({
          type: 'hideModal',
        })
      } else {
        message.error(response.message)
      }
    },
    *delete({ payload }, { call, put }) {
      const response = yield call(service.delConfig, payload)
      if (response.success) {
        message.success('ok')
      } else {
        message.error(response.message)
      }
    },
    *detail({ payload }, { put, call }) {
      const response = yield call(service.getConfiguration, payload)
      if (response.success) {
        const currentItem = response.data
        yield put({
          type: 'updateState',
          payload: {
            currentItem,
            modalType: 'edit',
            modalVisible: true,
            variables: currentItem.variables,
          },
        })
      } else {
        throw response
      }
    },
    *searchUser({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          pending: true,
        },
      })
      const response = yield call(getUserByName, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            users: response.data,
          },
        })
      } else {
        throw response
      }
      yield put({
        type: 'updateState',
        payload: {
          pending: false,
        },
      })
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
