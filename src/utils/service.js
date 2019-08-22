import { request, config } from 'utils'
const { api } = config

export const getUserByName = params => {
  const url = api.searchUsers
  return request({
    url: url,
    method: 'get',
    data: params,
  })
}
