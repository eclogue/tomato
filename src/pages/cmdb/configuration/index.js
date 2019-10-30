import React from 'react'
import { connect } from 'dva'
import { Page } from 'components'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import queryString from 'query-string'
import List from './components/List'
import Filter from './components/Filter'
import Modal from './components/Modal'
import Yaml from 'yaml'

const Index = ({ config, dispatch, loading, location }) => {
  const { list, pagination, users, currentItem, variables } = config
  const { modalVisible, modalType } = config
  const { pathname, query } = location
  const listProps = {
    pagination,
    dataSource: list,
    loading: loading.effects['job/query'],
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
    onEdit(item) {
      dispatch({
        type: 'config/detail',
        payload: item,
      }).then(() => {
        handleRefresh()
      })
    },
    onDelete(item) {
      dispatch({
        type: 'config/delete',
        payload: item,
      }).then(() => {
        handleRefresh()
      })
    },
  }

  const handleRefresh = newQuery => {
    dispatch(
      routerRedux.push({
        pathname,
        search: queryString.stringify({
          ...query,
          ...newQuery,
        }),
      })
    )
  }

  const filterProps = {
    users: users,
    filter: {
      ...query,
    },
    onFilterChange(value) {
      handleRefresh({
        ...value,
        page: 1,
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
        type: 'config/showModal',
        payload: {
          modalType: 'create',
          currentItem: {},
        },
      })
    },
  }
  const modalProps = {
    currentItem,
    users,
    configType: config.configType,
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects[`config/${modalType}`],
    title: `${modalType === 'create' ? 'Add config' : 'Edit config'}`,
    wrapClassName: 'vertical-center-modal',
    pending: config.pending || [],
    onOk(data) {
      dispatch({
        type: `config/${modalType}`,
        payload: data,
      }).then(() => {
        handleRefresh()
      })
    },
    onVariablesChange(codeInstance, form, value) {
      if (value) {
        dispatch({
          type: 'config/updateState',
          payload: {
            variables: value,
          },
        })
      }
    },
    onCancel() {
      dispatch({
        type: 'config/hideModal',
      })
    },
    searchUser(user) {
      dispatch({
        type: 'config/searchUser',
        payload: { user },
      })
    },
    changeType(type) {
      dispatch({
        type: 'config/updateState',
        payload: {
          configType: type,
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

Index.props = {
  config: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ config, loading, dispatch }) => ({
  config,
  loading,
  dispatch,
}))(Index)
