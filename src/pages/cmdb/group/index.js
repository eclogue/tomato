import React from 'react'
import { connect } from 'dva'
import { Page } from 'components'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import queryString from 'query-string'
import List from './components/List'
import Filter from './components/Filter'
import Modal from './components/Modal'

const Index = ({ cmdbGroup, loading, dispatch, location }) => {
  const { list, pagination, modalVisible, modalType, regions } = cmdbGroup
  const { pathname, query } = location
  const listProps = {
    pagination,
    dataSource: list,
    loading: loading.effects['cmdbGroup/query'],
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
        type: 'cmdbGroup/showModal',
        payload: {
          modalType: 'update',
          currentItem: currentItem,
        },
      })
    },
    onDelete(record) {
      dispatch({
        type: 'cmdbGroup/delete',
        payload: record,
      }).then(_ => handleRefresh())
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
        type: 'cmdbGroup/showModal',
        payload: {
          modalType: 'create',
          currentItem: {},
        },
      })
    },
  }

  const modalProps = {
    regions: regions || [],
    item: modalType === 'create' ? {} : cmdbGroup.currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects[`cmdbGroup/${modalType}`],
    title: `${modalType === 'create' ? 'Add cmdbGroup' : 'Update cmdbGroup'}`,
    wrapClassName: 'vertical-center-modal',
    pending: cmdbGroup.pending || [],
    onOk(data) {
      dispatch({
        type: `cmdbGroup/${modalType}`,
        payload: data,
      }).then(() => {
        handleRefresh()
      })
    },
    onCancel() {
      dispatch({
        type: 'cmdbGroup/hideModal',
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
  cmdbGroup: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
  location: PropTypes.object,
}

export default connect(({ cmdbGroup, loading }) => ({ cmdbGroup, loading }))(
  Index
)
