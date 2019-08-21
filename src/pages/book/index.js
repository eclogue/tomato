import React from 'react'
import { connect } from 'dva'
import { Page } from 'components'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import queryString from 'query-string'
import List from './components/List'
import Filter from './components/Filter'
import Modal from './components/Modal'
import { message } from 'antd';

const Index = ({ books, dispatch, loading, location }) => {

  const { list, pagination, users, currentItem } = books
  const { modalVisible, modalType, fileList, pending } = books
  const { pathname, query } = location
  const listProps = {
    pagination,
    dataSource: list,
    loading: loading.effects['job/query'],
    onChange (page) {
      dispatch(routerRedux.push({
        pathname,
        search: queryString.stringify({
          ...query,
          page: page.current,
          pageSize: page.pageSize,
        }),
      }))
    },
    onEdit(item) {
      dispatch({
        type: 'books/detail',
        payload: {
          currentItem: item
        }
      })
    },
    onDownload(record) {
      if (pending) {
        return message.warn('pending')
      }
      dispatch({
        type: 'books/download',
        payload: record
      })
    }
  }

  const handleRefresh = (newQuery) => {
    dispatch(routerRedux.push({
      pathname,
      search: queryString.stringify({
        ...query,
        ...newQuery,
      }),
    }));
  };

  const filterProps = {
    filter: {
      ...query,
    },
    onFilterChange (value) {
      handleRefresh({
        ...value,
        page: 1,
      });
    },
    onReset () {
      dispatch(routerRedux.push({
        pathname,
        search: '',
      }));
    },
    onNew() {
      dispatch({
        type: 'books/showModal',
        payload: {
          modalType: 'create',
          currentItem: {},
        }
      })
    },
  }
  const modalProps = {
    currentItem,
    users,
    fileList,
    booksType: books.booksType,
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects[`books/${modalType}`],
    title: `${modalType === 'create' ? 'Add books' : 'Edit books'}`,
    wrapClassName: 'vertical-center-modal',
    pending: books.pending || [],
    onOk(data) {
      dispatch({
        type: `books/${modalType}`,
        payload: data,
      }).then(() => {
        handleRefresh()
      });
    },
    onAddFile(fileObject) {
      return dispatch({
        type: 'books/appendFile',
        payload: {
          file: fileObject,
        },
      })
    },
    onRemoveFile(fileObject) {
      return dispatch({
        type: 'books/removeFile',
        payload: {
          file: fileObject,
        },
      })
    },
    onCancel() {
      dispatch({
        type: 'books/hideModal',
      })
    },
    searchUser(user) {
      dispatch({
        type: 'books/searchUser',
        payload: {user}
      })
    },
    changeType(type) {
      dispatch({
        type: 'books/updateState',
        payload: {
          booksType: type,
        }
      })
    }
  }

  return (
   <Page inner>
     <Filter {...filterProps}/>
     <List {...listProps}/>
     { modalVisible ? <Modal {...modalProps} /> : null}
   </Page>
  )
}

Index.props = {
  books: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object
}

export default connect(({ books, loading, dispatch }) => ({ books, loading, dispatch }))(Index)
