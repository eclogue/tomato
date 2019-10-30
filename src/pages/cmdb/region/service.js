import { request, config } from 'utils'

const { api } = config
export function getRegions(params) {
  console.log(api.getRegion)
  return request({
    url: api.getRegions,
    method: 'get',
    data: params,
  })
}

export const addRegions = params => {
  return request({
    url: api.addRegions,
    method: 'post',
    data: params,
  })
}

export const updateRegions = params => {
  const id = params.id
  return request({
    url: api.editRegions.replace(':id', id),
    method: 'put',
    data: params,
  })
}

export const addGroups = params => {
  return request({
    url: api.addGroups,
    method: 'post',
    data: params,
  })
}

export const updateGroups = params => {
  return request({
    url: api.editGroups,
    method: 'put',
    data: params,
  })
}

export const getGroups = params => {
  return request({
    url: api.getGroups,
    method: 'get',
    data: params,
  })
}
