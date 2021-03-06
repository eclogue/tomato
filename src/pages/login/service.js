import request from '../../utils/request'
import config from '../../utils/config'

const { api } = config
const { userLogin } = api

export const login = data => {
  return request({
    url: userLogin,
    method: 'post',
    data: data,
  })
}
