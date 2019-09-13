import { request, config } from 'utils'
const { api } = config


export const getSchedule = params => {
  const { id } = params
  if (!id) {
    return Promise.reject('invalid ID')
  }

  return request({
    url: api.getSchedule,
    method: 'get',
    data: params,
  })
}
