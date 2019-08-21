import { request, config, storage } from 'utils'

const { api } = config


export function getProfile(params) {
  const user = storage.get('user')
  return request({
    url: api.getProfile.replace(':id', user.user_id),
    method: 'get',
    data: params,
  })
}
