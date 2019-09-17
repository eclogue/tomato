import React from 'react'
import { connect } from 'dva'
import { Page } from 'components'
import PropTypes from 'prop-types'
import { Icon, Layout, Menu } from 'antd'
import { routerRedux } from 'dva/router'
import List from './components/List'
import Modal from './components/Modal'


const Index = ({ menu, loading, dispatch, location }) => {
  const list = menu.list || []
  const { modalVisible, modalType } = menu
  const { pathname, query } = location
  const handleRefresh = (newQuery) => {
    dispatch(routerRedux.push({
      pathname,
      query: {
        ...query,
        ...newQuery,
      },
    }))
  }
  const listProps = {
    dataSource: list,
    pagination: false,
    loading: loading.effects['menu/query'],
    onEditItem(record) {
      dispatch({
        type: 'menu/showModal',
        payload: {
          currentItem: record
        }
      })
    },
    onDelete(record) {
      console.log('delete', record)
    }
  }

  const modalProps = {
    menuType: menu.modalType,
    menus: list,
    currentItem: modalType === 'create' ? {} : menu.currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects[`menu/${modalType}`],
    title: `${modalType === 'create' ? 'Add menu' : 'Update menu'}`,
    wrapClassName: 'vertical-center-modal',
    pending: menu.pending || [],
    onOk(data) {
      dispatch({
        type: `menu/${modalType}`,
        payload: data,
      }).then(() => {
        handleRefresh()
      });
    },
    onCancel() {
      dispatch({
        type: 'menu/hideModal',
      })
    },
    changeType(type) {
      dispatch({
        type: 'menu/updateState',
        payload: {
          menuType: type,
        }
      })
    }
  }

  return (
    <Page inner>
    <List {...listProps}/>
    { modalVisible ? <Modal {...modalProps} /> : null}
    </Page>
  )
}

export default connect(({menu, loading, dispatch}) => ({menu, loading, dispatch}))(Index)
