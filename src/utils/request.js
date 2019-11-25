/* global window */
import axios from 'axios'
import qs from 'qs'
import jsonp from 'jsonp'
import pathToRegexp from 'path-to-regexp'
import { message } from 'antd'
import { YQL, CORS } from './config'
import storage from './storage'
import clonedeep from 'lodash.clonedeep'
import moment from 'moment'

const fetch = options => {
  let { method = 'get', data, fetchType, url, headers = {} } = options
  const requestOpt = options.options || {}
  for (const key in data) {
    if (data[key] === undefined) {
      data[key] = null
    }
  }
  const cloneData = clonedeep(data)
  axios.interceptors.request.use(
    function(config) {
      config.headers = Object.assign({}, config.headers, headers)
      const user = storage.get('user')
      if (user && user.token) {
        const author = {
          Authorization: 'Bearer ' + user.token,
        }
        config.headers = Object.assign(config.headers, author)
      }

      const contentType = headers['Content-Type']
      if (contentType && contentType.search('multipart/form-data') !== -1) {
        config.transformRequest = data => {
          const formData = new FormData()
          for (const key in data) {
            formData.append(key, data[key])
          }

          return formData
        }
      }
      return config
    },
    function(error) {
      return Promise.reject(error)
    }
  )

  try {
    let domain = ''
    if (url.match(/[a-zA-z]+:\/\/[^/]*/)) {
      ;[domain] = url.match(/[a-zA-z]+:\/\/[^/]*/)
      url = url.slice(domain.length)
    }

    const match = pathToRegexp.parse(url)
    url = pathToRegexp.compile(url)(data)
    for (let item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name]
      }
    }
    url = domain + url
  } catch (e) {
    message.error(e.message)
  }

  if (fetchType === 'JSONP') {
    return new Promise((resolve, reject) => {
      jsonp(
        url,
        {
          param: `${qs.stringify(data)}&callback`,
          name: `jsonp_${new Date().getTime()}`,
          timeout: 4000,
        },
        (error, result) => {
          if (error) {
            reject(error)
          }
          resolve({ statusText: 'OK', status: 200, data: result })
        }
      )
    })
  }

  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(url, {
        ...requestOpt,
        params: cloneData,
      })
    case 'delete':
      return axios.delete(url, {
        ...requestOpt,
        data: cloneData,
      })
    case 'post':
      return axios.post(url, cloneData, { ...requestOpt })
    case 'put':
      return axios.put(url, cloneData, { ...requestOpt })
    case 'patch':
      return axios.patch(url, cloneData, { ...requestOpt })
    default:
      return axios(options)
  }
}

export default function request(options) {
  if (options.url && options.url.indexOf('//') > -1) {
    const origin = `${options.url.split('//')[0]}//${
      options.url.split('//')[1].split('/')[0]
    }`
    if (window.location.origin !== origin) {
      if (CORS && CORS.indexOf(origin) > -1) {
        options.fetchType = 'CORS'
      } else if (YQL && YQL.indexOf(origin) > -1) {
        options.fetchType = 'YQL'
      } else {
        options.fetchType = 'JSONP'
      }
    }
  }

  return fetch(options)
    .then(response => {
      const { statusText, status } = response
      const headers = response.headers

      let data =
        options.fetchType === 'YQL'
          ? response.data.query.results.json
          : response.data
      if (data.data && Array.isArray(data.data.list)) {
        let list = data.data.list
        data.data.list = list.map(item => {
          if (item && item.created_at) {
            item.created_time = item.created_at
            item.created_at = moment(new Date(item.created_at * 1000)).format(
              'YYYY-MM-DD HH:mm:ss'
            )
          }

          return item
        })
      }

      if (data instanceof Array) {
        data = {
          list: data,
        }
      }
      if (headers['content-type'] !== 'application/json') {
        return Promise.resolve({
          success: true,
          message: statusText,
          statusCode: status,
          headers,
          data,
        })
      }

      return Promise.resolve({
        success: true,
        message: statusText,
        statusCode: status,
        headers,
        ...data,
      })
    })
    .catch(error => {
      const { response } = error
      let msg
      let statusCode
      if (response && response instanceof Object) {
        const { data, statusText, status } = response
        if (status === 401 && data.code === 401401) {
          storage.remove('user')
          statusCode = response.status
          msg = data.message || statusText
          return Promise.reject({
            success: false,
            statusCode,
            message: msg,
            code: data.code,
          })
        }

        statusCode = response.status
        msg = data.message || statusText

        return Promise.resolve({
          success: false,
          statusCode,
          message: msg,
          code: data.code,
        })
      } else {
        statusCode = 500
        msg = error.message || 'Network Error'
      }

      /* eslint-disable */
      return Promise.resolve({ success: false, statusCode, message: msg })
    })
}
