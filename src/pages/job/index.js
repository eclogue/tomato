import React from 'react'
import { connect } from 'dva'
import { Page } from 'components'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import queryString from 'query-string'
import List from './components/List'
import Filter from './components/Filter'
import Drawer from './components/Drawer'

const Index = ({job, loading, dispatch, location}) => {
  const { list, pagination, visible, previewContent, pending } = job
  const { pathname, query } = location
  const listProps = {
    pagination,
    dataSource: list,
    loading: pending,
    onEdit(id) {
      dispatch(routerRedux.push({
        pathname: 'job/playbook',
        query: {
          id: id
        },
      }))
    },
    onCheck(record) {
      dispatch({
        type: 'job/checkJob',
        payload: {
          id: record._id
        }
      })
    },
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
  }

  const handleRefresh = (newQuery) => {
    dispatch(routerRedux.push({
      pathname,
      search: queryString.stringify({
        ...query,
        ...newQuery,
      }),
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
      })
    },
    onReset () {
      dispatch(routerRedux.push({
        pathname,
        search: '',
      }))
    },
  }

  const drawerProps = {
    visible,
    title: 'Job check result',
    previewContent,
    closeDrawer() {
      dispatch({
        type: 'job/updateState',
        payload: {
          visible: false,
        }
      })
    },
    showDrawer() {
      dispatch({
        type: 'job/showDrawer',
        payload: {
          visible: true,
        }
      })
    },
  }

  return (
    <Page inner>
      <Filter {...filterProps}/>
      <List {...listProps}/>
      <Drawer {...drawerProps}/>
    </Page>
  )
}

Index.propTypes = {
  job: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
  location: PropTypes.object,
}

export default connect(({ job, loading, dispatch }) => ({ job, loading, dispatch }))(Index)
