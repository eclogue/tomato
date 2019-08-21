import { request, config } from 'utils'
const { api } = config


export function getConfigurations(params) {
  return request({
    url: api.getConfig,
    method: 'get',
    data: params,
  })
}

export const getConfig = params => {
  const id = params._id
  if (!id) {
    return false
  }

  return request({
    url: api.getConfig.replace(':id', id),
    method: 'get',
    data: params,
  })
}


export const addConfig = params => {
  return request({
    url: api.addConfigs,
    method: 'post',
    data: params,
  })
}
