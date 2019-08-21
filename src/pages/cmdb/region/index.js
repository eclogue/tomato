import React from 'react'
import { connect } from 'dva'
import { Page } from 'components'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import queryString from 'query-string'
import List from './components/List'
import Filter from './components/Filter'
import Modal from './components/Modal'

const Index = ({ cmdbRegion, loading, dispatch, location }) => {
  const { list, pagination, modalVisible, modalType, regions } = cmdbRegion
  const { pathname, query } = location
  const listProps = {
    pagination,
    dataSource: list,
    loading: loading.effects['cmdbRegion/query'],
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
    onEditItem(currentItem) {
      dispatch({
        type: 'cmdbRegion/showModal',
        payload: {
          modalType: 'update',
          currentItem: currentItem,
        },
      });
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
    regions,
    filter: {
      ...query,
    },
    onFilterChange (value) {
      handleRefresh({
        page: 1,
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
        type: 'cmdbRegion/showModal'
      })
    }
  }

  const modalProps = {
    regions: regions || [],
    item: modalType === 'create' ? {} : cmdbRegion.currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects[`cmdbRegion/${modalType}`],
    title: `${modalType === 'create' ? 'Add cmdbRegion' : 'Update cmdbRegion'}`,
    wrapClassName: 'vertical-center-modal',
    pending: cmdbRegion.pending || [],
    onOk(data) {
      dispatch({
        type: `cmdbRegion/${modalType}`,
        payload: data,
      }).then(() => {
        handleRefresh()
      });
    },
    onCancel() {
      dispatch({
        type: 'cmdbRegion/hideModal',
      })
    },
  }

  return (
    <Page inner>
      <Filter {...filterProps}/>
      <List {...listProps}/>
      { modalVisible ? <Modal {...modalProps} /> : null}
    </Page>
  )
}

Index.propTypes = {
  cmdbRegion: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
  location: PropTypes.object,
}

export default connect(({ cmdbRegion, loading }) => ({ cmdbRegion, loading }))(Index)
