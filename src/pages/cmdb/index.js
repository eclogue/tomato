import React from 'react'
import { connect } from 'dva'
import { Page } from 'components'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import List from './components/List'
import Filter from './components/Filter'
import Modal from './components/Modal'

const Index = ({ cmdb, location, loading, dispatch }) => {
  const { query, pathname } = location
  const { list, pagination, modalVisible, modalType } = cmdb
  const { users, currentItem, fileList, regions, groups, credentials } = cmdb
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

  const listProps = {
    dataSource: list,
    loading: loading.effects['cmdb/query'],
    pagination,
    location,
    onChange(page) {
      handleRefresh({
        page: page.current,
        pageSize: page.pageSize,
      })
    },
    onEditItem(item) {
      dispatch(
        routerRedux.push({
          pathname: 'cmdb/inventory/' + item._id,
        })
      )
    },
    onSave() {
      dispatch({
        type: 'cmdb/updateDeviceInfo',
      })
    },
    onDelete(record) {
      dispatch({
        type: 'cmdb/delete',
        payload: record,
      }).then(_ => handleRefresh())
    },
  }
  const filterProps = {
    filter: {
      ...query,
    },
    regions,
    groups,
    onFilterChange(value) {
      handleRefresh({
        ...value,
      })
    },
    onAdd() {
      dispatch({
        type: 'cmdb/showModal',
        payload: {
          modalType: 'create',
        },
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
  }

  const modalProps = {
    dispatch,
    fileList,
    regions,
    groups,
    users,
    credentials,
    pending: cmdb.pending,
    currentItem: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects[`operator/${modalType}`],
    title: `${modalType === 'create' ? 'Create operator' : 'Update operator'}`,
    onOk(data) {
      dispatch({
        type: `cmdb/${modalType}`,
        payload: data,
      }).then(() => handleRefresh())
    },
    onAddFile(data) {
      dispatch({
        type: 'cmdb/addFile',
        payload: data,
      })
    },
    onCancel() {
      dispatch({
        type: 'cmdb/hideModal',
      })
    },
    resetFileList() {
      dispatch({
        type: 'cmdb/resetFileList',
      })
    },
    searchMaintainer(user) {
      dispatch({
        type: 'cmdb/searchUser',
        payload: { user },
      })
    },
    searchRegions(keyword) {
      if (cmdb.pending) {
        return
      }
      dispatch({
        type: 'cmdb/searchRegions',
        payload: { keyword },
      })
    },
    searchGroups(keyword) {
      if (cmdb.pending) {
        return
      }
      dispatch({
        type: 'cmdb/searchGroups',
        payload: { keyword },
      })
    },
    searchCredentials(keyword) {
      if (cmdb.pending) {
        return
      }
      dispatch({
        type: 'cmdb/getCredentials',
        payload: { keyword },
      })
    },
  }

  return (
    <Page inner>
      <Filter {...filterProps} />
      <List {...listProps} />
      {modalVisible && <Modal {...modalProps} />}
    </Page>
  )
}

Index.propTypes = {
  cmdb: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ cmdb, loading }) => ({ cmdb, loading }))(Index)
