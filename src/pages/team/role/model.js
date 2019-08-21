import modelExtend from 'dva-model-extend'
import { pageModel } from 'utils/model'
import * as service from './service'
import { message } from 'antd';


export default modelExtend(pageModel, {
  namespace: 'role',
  state: {
    title: '',
    roles: [],
    menus: [],
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    checkedList: [],
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location, action) => {
        if (location.pathname === '/team/role') {
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
    * query({ payload }, { call, put }) {
      const response = yield call(service.getRoles, payload)
      if (response.success) {
        const { list, total } = response.data
        yield put({
          type: 'querySuccess',
          payload: {
            list: list,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 50,
              total: total,
            },
          }
        })
      } else {
        throw response
      }
    },
    * getMenus({ payload }, { call, put }) {
      const response = yield call(service.getMenus, payload)
      if (response.success) {
        yield put({
          type: 'loadMenus',
          payload: {
            menus: response.data,
          }
        })
      } else {
        throw response
      }
    },
    * bindRoles({ payload }, { call, put, select }) {
      const user = yield select(_ => _.team.user)
      if (!user._id) {
        return message.error('invalid user')
      }

      payload.userId = user._id
      const response = yield call(service.bindRoles, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            isEdit: false,
          }
        })
        message.success('ok')
      } else {
        throw response
      }
    },
    * create({ payload }, { call, put, select }) {
      const checkedList = yield select(_ => _.role.checkedList)
      const bucket = {}
      checkedList.map(item => {
        const pattern = /(.*?)\[(.*?)\]/
        const match = item.match(pattern)
        if (match) {
          const group = match[1]
          const action = match[2]
          if (!bucket[group]) {
            bucket[group] = [action]
          } else if (!bucket[group].includes(action)) {
            bucket[group].push(action)
          }
        } else {
          bucket[item] = ['read', 'edit', 'delete']
        }

        return item
      })
      payload.permissions = bucket
      const response = yield call(service.addRole, payload)
      if (response.success) {
        yield put({
          type: 'hideModal'
        })
        message.success('ok')
      } else {
        throw response
      }
    },
    * update({ payload }, { call, put, select }) {
      const checkedList = yield select(_ => _.role.checkedList)
      const bucket = {}
      checkedList.map(item => {
        const pattern = /(.*?)\[(.*?)\]/
        const match = item.match(pattern)
        if (match) {
          const group = match[1]
          const action = match[2]
          if (!bucket[group]) {
            bucket[group] = [action]
          } else if (!bucket[group].includes(action)) {
            bucket[group].push(action)
          }
        } else {
          bucket[item] = ['read', 'edit', 'delete']
        }

        return item
      })
      payload.permissions = bucket
      const response = yield call(service.updateRole, payload)
      if (response.success) {
        yield put({
          type: 'hideModal'
        })
        message.success('ok')
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
    loadMenus(state, { payload }) {
      const { menus } = payload
      const modules = menus.filter(item => {
        return Number(item.bpid) < 1
      })

      const checkedList = []
      modules.map(item => {
        const actions = item.actions || []
        const readValue = item._id + '[read]'
        const editValue = item._id + '[edit]'
        const deleteValue = item._id + '[delete]'
        if (actions.includes('get')) {
          checkedList.push(readValue)
        }

        if (actions.includes('post') || actions.includes('put') || actions.includes('patch')) {
          checkedList.push(editValue)
        }

        if (actions.includes('delete')) {
          checkedList.push(deleteValue)
        }

        return item
      })

      console.log('xxxxmmmm', modules)

      return { ...state, menus: modules, checkedList }
    }
  }
})
