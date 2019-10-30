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
        const { from_url } = locationQuery
        yield put({ type: 'app/query' })
        if (from_url && from_url !== '/login') {
          yield put(
            routerRedux.push(from_url === '/' ? '/dashboard' : from_url)
          )
        } else {
          yield put(routerRedux.push('/dashboard'))
        }
      } else {
        throw response
      }
    },
  },
}
