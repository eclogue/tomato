import React from 'react'
import { connect } from 'dva'
import { Page } from 'components'
import PropTypes from 'prop-types'
import { Card, Col, Row } from 'antd'
import { routerRedux } from 'dva/router'
import queryString from 'query-string'
import List from './components/List'
import Filter from './components/Filter'
import Modal from './components/Modal'

const Index = ({ credential, dispatch, loading, location }) => {

  const { list, pagination } = credential
  const { modalVisible, modalType, regions } = credential
  const { pathname, query } = location
  const listProps = {
    pagination,
    dataSource: list,
    loading: loading.effects['credential/query'],
    onChange (page) {
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize,
        },
      }))
    },
  }

  const handleRefresh = (newQuery) => {
    dispatch(routerRedux.push({
      pathname,
      query: {
        ...query,
        ...newQuery,
      },
    }))
  }

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
        type: 'credential/showModal'
      })
    }
  }
  const modalProps = {
    credentialType: credential.credentialType,
    item: modalType === 'create' ? {} : credential.currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects[`credential/${modalType}`],
    title: `${modalType === 'create' ? 'Add credential' : 'Update credential'}`,
    wrapClassName: 'vertical-center-modal',
    pending: credential.pending || [],
    onOk(data) {
      dispatch({
        type: `credential/${modalType}`,
        payload: data,
      }).then(() => {
        handleRefresh()
      });
    },
    onCancel() {
      dispatch({
        type: 'credential/hideModal',
      })
    },
    changeType(type) {
      dispatch({
        type: 'credential/updateState',
        payload: {
          credentialType: type,
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
  credential: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object
}

export default connect(({ credential, loading, dispatch }) => ({ credential, loading, dispatch }))(Index)
