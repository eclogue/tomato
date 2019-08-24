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


export const saveInventory = params => {
  const { _id } = params
  return request({
    url: api.editInventory.replace(':id', _id),
    method: 'put',
    data: params,
  })
}
