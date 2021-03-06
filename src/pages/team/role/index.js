import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Page } from 'components'
import PropTypes from 'prop-types'
import { Table, Button } from 'antd'
import List from './components/List'
import Modal from './components/Modal'
import Filter from './components/Filter'
import styles from './index.less'

const Index = ({ role, dispatch, loading, location }) => {
  const { list, pagination, modalType, modalVisible, menus } = role
  const { query, pathname } = location
  const tableProps = {
    dataSource: list,
    pagenation: pagination,
    loading: loading.models.role,
    showEditForm(currentItem) {
      dispatch({
        type: 'role/updateState',
        payload: {
          currentItem,
          modalType: 'update',
          modalVisible: true,
        },
      })
      dispatch({
        type: 'role/getRoleMenus',
        payload: {
          _id: currentItem._id,
        },
      })
    },
    onChange(page) {
      dispatch(
        routerRedux.push({
          pathname,
          query: {
            ...query,
            page: page.current,
            pageSize: page.pageSize,
          },
        })
      )
    },
  }

  const handleRefresh = newQuery => {
    dispatch(
      routerRedux.push({
        pathname,
        query: {
          ...newQuery,
        },
      })
    )
  }

  const filterProps = {
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
      handleAdd()
    },
  }

  const modalProps = {
    menus: menus,
    checkedList: role.checkedList,
    currentItem: modalType === 'create' ? {} : role.currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects[`role/${modalType}`],
    title: `${modalType === 'create' ? 'Add role' : 'Update role'}`,
    wrapClassName: 'vertical-center-modal',
    onSave(data) {
      dispatch({
        type: `role/${modalType}`,
        payload: data,
      }).then(() => {
        handleRefresh()
      })
    },
    onCancel() {
      dispatch({
        type: 'role/hideModal',
      })
    },
    onCheck(values) {
      dispatch({
        type: 'role/updateState',
        payload: {
          checkedList: values,
        },
      })
    },
  }

  const handleAdd = () => {
    dispatch({
      type: 'role/getMenus',
      payload: {},
    }).then(() => {
      dispatch({
        type: 'role/showModal',
        payload: {
          modalType: 'create',
          currentItem: {},
          checkedList: [],
        },
      })
    })
  }

  return (
    <Page inner>
      <div>
        <Filter {...filterProps} />
      </div>
      <List {...tableProps} />
      {modalVisible ? <Modal {...modalProps} /> : null}
    </Page>
  )
}

export default connect(({ role, loading, dispatch }) => ({
  role,
  dispatch,
  loading,
}))(Index)
