import { request, config } from 'utils'

const { api } = config
export function getJobDetail(params) {
  const { id } = params
  if (!id) {
    return Promise.reject('invalid params')
  }

  return request({
    url: api.getJobTasks.replace(':id', id),
    method: 'get',
    data: params,
  })
}

