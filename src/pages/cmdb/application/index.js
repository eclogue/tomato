import React from 'react'
import { connect } from 'dva'
import { Page } from 'components'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import queryString from 'query-string'
import List from './components/List'
import Filter from './components/Filter'
import Modal from './components/Modal'

const Index = ({ cmdbApp, loading, dispatch, location }) => {
  const { list, pagination, modalVisible, modalType, regions } = cmdbApp
  const { pathname, query } = location
  const listProps = {
    pagination,
    dataSource: list,
    loading: loading.effects['cmdbApp/query'],
    onChange(page) {
      dispatch(
        routerRedux.push({
          pathname,
          search: queryString.stringify({
            ...query,
            page: page.current,
            pageSize: page.pageSize,
          }),
        })
      )
    },
    onEditItem(currentItem) {
      dispatch({
        type: 'cmdbApp/showModal',
        payload: {
          modalType: 'update',
          currentItem: currentItem,
        },
      })
    },
  }
  const handleRefresh = newQuery => {
    dispatch(
      routerRedux.push({
        pathname,
        query: {
          ...query,
          ...newQuery,
        },
      })
    )
  }

  const filterProps = {
    regions,
    filter: {
      ...query,
    },
    onFilterChange(value) {
      handleRefresh({
        ...value,
      })
    },
    onReset() {
      dispatch(
        routerRedux.push({
          pathname,
          search: '',
        })
      )
    },
    onNew() {
      dispatch({
        type: 'cmdbApp/showModal',
        payload: {
          currentItem: {},
        },
      })
    },
  }

  const modalProps = {
    regions: regions || [],
    currentItem: modalType === 'create' ? {} : cmdbApp.currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects[`cmdbApp/${modalType}`],
    title: `${modalType === 'create' ? 'Add cmdbApp' : 'Update cmdbApp'}`,
    wrapClassName: 'vertical-center-modal',
    pending: cmdbApp.pending || [],
    onOk(data) {
      dispatch({
        type: `cmdbApp/${modalType}`,
        payload: data,
      }).then(() => {
        handleRefresh()
      })
    },
    onCancel() {
      dispatch({
        type: 'cmdbApp/hideModal',
      })
    },
    changeIncome(value) {
      dispatch({
        type: 'cmdbApp/updateState',
        payload: {
          income: value,
        },
      })
    },
  }

  return (
    <Page inner>
      <Filter {...filterProps} />
      <List {...listProps} />
      {modalVisible ? <Modal {...modalProps} /> : null}
    </Page>
  )
}

Index.propTypes = {
  cmdbApp: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
  location: PropTypes.object,
}

export default connect(({ cmdbApp, loading }) => ({ cmdbApp, loading }))(Index)
