import { request, config } from 'utils'

const { api } = config
export function getJobs(params) {
  return request({
    url: api.getJobs,
    method: 'get',
    data: params,
  })
}

export function checkJob(params) {
  const { id } = params
  return request({
    url: api.checkJob.replace(':id', id),
    method: 'post',
    data: params,
  })
}

export const delJob = params => {
  const { _id } = params
  if (!_id) {
    return Promise.reject('invalid param')
  }

  return request({
    url: api.delJob.replace(':id', _id),
    method: 'delete',
    data: params,
  })
}
