import { request, config } from 'utils'

const { api } = config


export function getTaskDetail(params) {
  const { _id } = params
  if (!_id) {
    return Promise.reject('invalid params')
  }

  return request({
    url: api.getTaskDetail.replace(':id', _id),
    method: 'get',
    data: {},
  })
}
