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


export const pauseSchedule = params => {
  const { id } = params
  if (!id) {
    return Promise.reject('invalid ID')
  }

  return request({
    url: api.pauseSchedule,
    method: 'put',
    data: params,
  })
}

export const resumeSchedule = params => {
  const { id } = params
  if (!id) {
    return Promise.reject('invalid ID')
  }

  return request({
    url: api.resumeSchedule,
    method: 'put',
    data: params,
  })
}

export const removeSchedule = params => {
  const { id } = params
  if (!id) {
    return Promise.reject('invalid ID')
  }

  return request({
    url: api.removeSchedule,
    method: 'delete',
    data: params,
  })
}

export const reschedule = params => {
  const { id } = params
  if (!id) {
    return Promise.reject('invalid ID')
  }

  return request({
    url: api.reschedule,
    method: 'put',
    data: params,
  })
}
