import { request, config } from 'utils'

const { api } = config
export function getQueueTasks(params) {
  const {queue, state} = params
  if (!queue || !state) {
    return Promise.reject('invalid params')
  }

  return request({
    url: api.getQueueTasks,
    method: 'get',
    data: params,
  })
}

