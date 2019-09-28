import modelExtend from 'dva-model-extend'
import { pageModel } from 'utils/model'
import * as service from './service'
import { message } from 'antd'
import { storage } from 'utils'
import { routerRedux } from 'dva/router'

export default modelExtend(pageModel, {
  namespace: 'user',
  state: {
    currentItem: {},
    action: 'profile',
    sshFormVisible: false,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location, action) => {
        if (location.pathname === '/user') {
          dispatch({
            type: 'query',
            payload: location.query,
          })
        }
      })
    },
  },
  effects: {
    *query({ payload }, { call, put }) {
      const action = payload.action || 'profle'
      if (!service[action]) {
        return
      }

      const response = yield call(service[action], payload)
      if (response.success) {
        let result = response.data
        if (action === 'sshkey') {
          const { list, total, pageSize, page } = response.data
          result = {
            list: list,
            pagination: {
              current: Number(page) || 1,
              pageSize: Number(pageSize) || 50,
              total: total,
            },
          }
        } else if (action === 'alert') {
        } else {
        }

        yield put({
          type: 'updateState',
          payload: {
            action,
            currentItem: result,
          },
        })
      } else {
        message.error(response.message)
      }

      yield put({
        type: 'updateState',
        payload: { action },
      })
    },
    *saveProfile({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          pending: true,
        },
      })

      const response = yield call(service.saveProfile, payload)
      if (response.success) {
        message.success('ok')
      } else {
        message.error(response.message)
      }
      yield put({
        type: 'updateState',
        payload: {
          pending: false,
        },
      })
    },
    *sendMail({ payload }, { call, put }) {
      const response = yield call(service.sendMail, payload)
      if (response.success) {
        message.success('ok')
      } else {
        message.error(response.message)
      }
    },
    *resetPassword({ payload }, { call, put }) {
      const response = yield call(service.resetPassword, payload)
      if (response.success) {
        message.success('ok')
        storage.remove('user')
        yield put(routerRedux.push({ pathname: '/login' }))
      } else {
        message.error(response.message)
      }
    },
    *addPublicKey({ payload }, { call, put }) {
      const response = yield call(service.addPublicKey, payload)
      if (response.success) {
        message.success('ok')
      } else {
        message.error(response.message)
      }
    },
    *saveAlert({ payload }, { call }) {
      const response = yield call(service.saveAlert, payload)
      if (response.success) {
        message.success('ok')
      } else {
        message.error(response.message)
      }
    },
  },
  reducers: {},
})
