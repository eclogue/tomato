import { routerRedux } from 'dva/router'
import { login } from './service'
import storage from '../../utils/storage'

export default {
  namespace: 'login',

  state: {},

  effects: {
    *login({ payload }, { put, call, select }) {
      const response = yield call(login, payload)
      const { locationQuery } = yield select(_ => _.app)
      if (response.success) {
        const user = response.data
        storage.set('user', user)
        const { from } = locationQuery
        yield put({ type: 'app/query' })
        if (from && from !== '/login') {
          yield put(routerRedux.push(from === '/' ? '/dashboard' : from))
        } else {
          yield put(routerRedux.push('/dashboard'))
        }
      } else {
        throw response
      }
    },
  },
}
