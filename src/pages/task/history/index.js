import React from 'react'
import { connect } from 'dva'
import { Page } from 'components'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import queryString from 'query-string'
import List from './components/List'
import Filter from './components/Filter'
import Modal from './components/Modal'

const Index = ({ taskHistory, dispatch, loading, location }) => {

  const { list, pagination } = taskHistory
  const { modalVisible, modalType } = taskHistory
  const { pathname, query } = location
  const listProps = {
    pagination,
    dataSource: list,
    loading: loading.effects['taskHistory/query'],
    onChange (page) {
      dispatch(routerRedux.push({
        pathname,
        search: queryString.stringify({
          ...query,
          page: page.current,
          pageSize: page.pageSize,
        }),
      }));
    },
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
        type: 'taskHistory./showModal'
      })
    }
  }


  return (
   <Page inner>
     <Filter {...filterProps}/>
     <List {...listProps}/>
   </Page>
  )
}

Index.props = {
  taskHistory: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object
}

export default connect(({ taskHistory, loading, dispatch }) => ({ taskHistory, loading, dispatch }))(Index)
