import modelExtend from 'dva-model-extend'
import { pageModel } from 'utils/model'
import * as service from './service'
import { getUserByName} from '../cmdb/service'
import { message } from 'antd'
import fileDownload from 'js-file-download'


export default modelExtend(pageModel, {
  namespace: 'books',
  state: {
    pending: false,
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
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/book') {
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
    * query ({ payload }, { call, put }) {
      const response = yield call(service.getBooks, payload)
      if (response.success) {
        const {list, pageSize, page, total} = response.data
        yield put({
          type: 'updateState',
          payload: {
            list,
            page,
            total,
            pageSize,
          }
        })
        yield put({
          type: 'searchUser',
          payload: {
            keyword: '',
          }
        })
      } else {
        throw response
      }
    },
    * create({ payload }, { call, put, select }) {
      const files = yield select(_ => _.books.fileList)
      const response = yield call(service.addBook, payload)
      if (response.success) {
        for (const file of files) {
          const { _id } = response.data
          if (!_id) {
            return message.warn('miss book id')
          }

          const params = {
            _id,
            file
          }
          const result = yield call(service.uploadFile, params)
          if (result.success) {
            yield put({
              type: 'removeFile',
              payload: { file }
            })
          }
        }
        message.success('success')
      } else {
        throw response
      }
    },
    * edit({ payload }, { call, put, select }) {
      const [files, currentItem] = yield select(_ => [_.books.fileList, _.books.currentItem])
      payload._id = currentItem._id
      const response = yield call(service.editBook, payload)
      if (response.success) {
        for (const file of files) {
          const { _id } = response.data
          if (!_id) {
            return message.warn('miss book id')
          }

          const params = {
            _id,
            file
          }
          const result = yield call(service.uploadFile, params)
          if (result.success) {
            yield put({
              type: 'removeFile',
              payload: { file }
            })
          }
        }
        message.success('success')
      } else {
        throw response
      }
    },
    * detail({ payload }, { put, call }) {
      const { currentItem } = payload
      const { _id } = currentItem
      const response = yield call(service.bookDetail, { _id })
      if (response.success) {
        const currentItem = response.data
        yield put({
          type: 'updateState',
          payload: { currentItem }
        })
        yield put({
          type: 'showModal',
          payload: { modalType: 'edit' }
        })
      }

    },
    * searchUser({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: { pending: true}
      })
      const response = yield call(getUserByName, payload)
      yield put({
        type: 'updateState',
        payload: { pending: false}
      })
      if (response.success) {
        yield put({
          type: 'updateState',
          payload: {
            users: response.data
          }
        })
      } else {
        throw response
      }
    },
    * download({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: { pending: true}
      })
      const response = yield call(service.downloadBook, payload)
      yield put({
        type: 'updateState',
        payload: { pending: false}
      })
      if (response.success) {
        const headers = response.headers
        const contentType = headers['content-type']
        const blob = new Blob([response.data], {type: contentType})
        fileDownload(blob, payload.name + '.zip')
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
    appendFile(state, { payload }) {
      const { file } = payload
      state.fileList.push(file)

      return { ...state }
    },
    removeFile(state, { payload }) {
      const { file } = payload
      const { webkitRelativePath } = file.originFileObj || file
      const fileList = state.fileList.filter(item => {
        return item.webkitRelativePath !== webkitRelativePath
      })

      return { ...state, fileList }
    },
  },
})
