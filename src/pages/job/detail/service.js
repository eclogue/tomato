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

export const runManual = params => {
  const { token } = params

  return request({
    url: api.jobWebhook + '?token=' + token,
    method: 'post',
    data: params,
  })
}

export const getTaskLogs = params => {
  const { _id } = params

  return request({
    url: api.getTaskLogs.replace(':id', _id),
    method: 'get',
  })
}

export const getTaskLogBuffer = params => {
  const { _id } = params

  return request({
    url: api.getTaskLogBuffer.replace(':id', _id),
    method: 'get',
  })
}

export const rollback = params => {
  const { taskId } = params
  if (!taskId) {
    return Promise.reject('invalid task')
  }

  return request({
    url: api.rollbackTask.replace(':id', taskId),
    method: 'post',
  })
}
