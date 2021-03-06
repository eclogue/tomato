import modelExtend from 'dva-model-extend'
import { pageModel } from 'utils/model'
import * as service from './service'
import { message } from 'antd'

export default modelExtend(pageModel, {
  namespace: 'menu',
  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
  },
  subscriptions: {
    setup({ history, dispatch }) {
      history.listen(location => {
        if (location.pathname === '/menu') {
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
      if (payload.all === undefined) {
        payload.all = 1
      }

      const response = yield call(service.getMenus, payload)
      if (response.success) {
        yield put({
          type: 'loadMenu',
          payload: {
            list: response.data,
          },
        })
      } else {
        message.error(response.message)
      }
    },
    *create({ payload }, { call, put }) {
      const response = yield call(service.addMenu, payload)
      if (response.success) {
        message.success('ok')
        yield put({
          type: 'hideModal',
        })
      } else {
        message.error(response.message)
      }
    },
    *update({ payload }, { call, put }) {
      const response = yield call(service.updateMenu, payload)
      if (response.success) {
        message.success('ok')
        yield put({
          type: 'hideModal',
        })
      } else {
        message.error(response.message)
      }
    },
    *delete({ payload }, { call, put }) {
      const response = yield call(service.deleteMenu, payload)
      if (response.success) {
        message.success('ok')
      } else {
        message.error(response.message)
      }
    },
  },
  reducers: {
    loadMenu(state, { payload }) {
      const { list } = payload
      const menus = list.map(item => {
        item['parent'] = 'root'
        for (const index in list) {
          const menu = list[index]
          if (menu.id === item.bpid) {
            item['parent'] = menu.name
            break
          }
        }

        return item
      })

      return { ...state, list: menus }
    },
    showModal(state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },
    hideModal(state) {
      return { ...state, modalVisible: false, currentItem: {} }
    },
  },
})
