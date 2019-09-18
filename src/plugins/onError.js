import { message } from 'antd'
import { routerRedux } from 'dva/router'
import queryString from 'query-string'
import url from 'url'

export default {
  onError(err, dispatch) {
    err.preventDefault()
    if (err.statusCode === 401 && err.code === 401401) {
      const location = window.location
      const queryStr = queryString.extract(location.href)
      const query = queryString.parse(queryStr)

      // let fromPath = location.hash.find('from')
      if (!query.from) {
        query.from = location.hash.replace('#', '')
      }
      
      return dispatch(routerRedux.push({
        pathname: '/login',
        query: query
      }))
    }
    message.error(err.message)
  },
}

