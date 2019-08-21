import modelExtend from 'dva-model-extend'
import { pageModel } from 'utils/model'
import * as service from './service'
import { message } from 'antd'


export default modelExtend(pageModel, {
  namespace: 'hostTree',
  state: {
    groups: [],
    treeData: [],
    currentItem: {},
    nodeInfo: null,
    nodeType: '',
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen(location => {
        if (location.pathname === '/cmdb/hosttree') {
          dispatch({
            type: 'query',
            payload: location.query,
          })
        }
      })
    }
  },
  effects: {
    * query ({ payload }, { call, put }) {
      const response = yield call(service.getCurrentGroups, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            treeData: response.data
          }
        })
      } else {
        throw response
      }
    },
    * getGroupInfo({ payload }, { call, put }) {
      const response = yield call(service.getGroupInfo, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            nodeInfo: response.data,
            nodeType: 'group'
          }
        })
      } else {
        throw response
      }
    },
    * getNodeInfo({ payload }, { call, put }) {
      const response = yield call(service.getNodeInfo, payload)
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            nodeInfo: response.data,
            nodeType: 'node'
          }
        })
      } else {
        throw response
      }
    },
    * getGroupNodes({ payload }, { call, put }) {
      const response = yield call(service.getGroupNodes, payload)
      if (response.success) {
        yield put({
          type: 'loadTree',
          payload: response.data
        })

        return response.data
      } else {
        throw response
      }
    }
  },
  reducers: {
    loadTree(state, { payload }) {
      const { groups, group, hosts } = payload
      let data = []
      if (groups) {
        data = groups.map(item => {
          item.title = item.name
          item.key = item._id
          return item
        })
        state.groups = groups
      } else if (group && hosts) {
        data = state.groups.map(item => {
          if (item._id === group) {
            item.children = hosts.map(node => {
              return {
                _id: node._id,
                key: node._id,
                title: node.hostname,
                isLeaf: true,
              }
            })
          }
          return item
        })
      }

      return { ...state, treeData: data}
    }
  }
})
