import { request, config } from 'utils'
const { api } = config

export function getBooks(params) {
  return request({
    url: api.getBooks,
    method: 'get',
    data: params,
  })
}

export const uploadFile = params => {
  const id = params._id
  if (!id) {
    return false
  }
  return request({
    url: api.getPlaybook.replace(':id', id),
    method: 'post',
    data: params,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const addBook = params => {
  return request({
    url: api.addBooks,
    method: 'post',
    data: params,
  })
}

export const bookDetail = params => {
  const { _id } = params
  return request({
    url: api.bookDetail.replace(':id', _id),
    method: 'get',
    data: {},
  })
}

export const editBook = params => {
  const { _id } = params
  return request({
    url: api.bookDetail.replace(':id', _id),
    method: 'put',
    data: params,
  })
}

export const downloadBook = params => {
  const { _id } = params
  return request({
    url: api.downloadBook.replace(':id', _id),
    method: 'get',
    data: {},
    options: {
      responseType: 'blob',
    },
  })
}

export const deleteBook = params => {
  const { _id } = params
  return request({
    url: api.bookDetail.replace(':id', _id),
    method: 'delete',
    data: params,
  })
}
