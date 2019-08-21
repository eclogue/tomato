import { request, config } from 'utils'
const { api } = config



export const getInventory = params => {
  const id = params._id
  if (!id) {
    return false
  }

  return request({
    url: api.getDevice.replace(':id', id),
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
