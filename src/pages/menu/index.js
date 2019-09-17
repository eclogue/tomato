import React from 'react'
import { connect } from 'dva'
import { Page } from 'components'
import PropTypes from 'prop-types'
import { Button, Row, Col } from 'antd'
import { routerRedux } from 'dva/router'
import List from './components/List'
import Modal from './components/Modal'


const Index = ({ menu, loading, dispatch, location }) => {
  const list = menu.list || []
  const { modalVisible, modalType, currentItem } = menu
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
          currentItem: record,
          modalType: 'update'
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
    currentItem: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects[`menu/${modalType}`],
    title: `${modalType === 'create' ? 'Add menu' : 'Update menu'}`,
    wrapClassName: 'vertical-center-modal',
    pending: menu.pending || [],
    onOk(data) {
      if (modalType === 'update') {
        data['_id'] = currentItem._id

      }

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

  const filterProps = {
    filter: {
      ...query,
    },
    onFilterChange (value) {
      handleRefresh({
        ...value,
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
        type: 'menu/showModal',
        payload: {
          modalType: 'create',
          currentItem: {},
        }
      })
    }
  }

  const onNew = () => {
    dispatch({
      type: 'menu/showModal',
      payload: {
        modalType: 'create',
        currentItem: {},
      }
    })
  }

  return (
    <Page inner>
      <Row>
        <Col style={{float: 'right', margin: 10}}><Button onClick={onNew} type="primary">new</Button></Col>
      </Row>
      <List {...listProps}/>
      { modalVisible ? <Modal {...modalProps} /> : null}
    </Page>
  )
}

export default connect(({menu, loading, dispatch}) => ({menu, loading, dispatch}))(Index)
