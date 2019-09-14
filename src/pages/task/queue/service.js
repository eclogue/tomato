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


export const deleteTask = ({id, state}) => {
  if (!id || !state) {
    return Promise.reject('invalid params')
  }
  const url = api.deleteTask.replace(':id', id).replace(':state', state)
  return request({
    url: url,
    method: 'delete',
    data: { state },
  })
}

