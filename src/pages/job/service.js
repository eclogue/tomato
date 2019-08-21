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
