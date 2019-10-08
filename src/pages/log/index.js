import React from 'react'
import { connect } from 'dva'
import { Page, CodeMirror } from 'components'
import { routerRedux } from 'dva/router'
import PropTypes from 'prop-types'
import { Icon, Layout, Collapse, Form, Input, Tag, Empty } from 'antd'
import styles from './index.less'
import stringifyObject from 'stringify-object'
import moment from 'moment'
import Filter from './components/Filter'
import List from './components/List'

const Panel = Collapse.Panel
const Content = Layout.Content
const panelStyle = {
  borderRadius: 4,
  marginBottom: 0,
  border: 0,
  overflow: 'hidden',
}

const Index = ({ logger, loading, dispatch, location }) => {
  const { list, pagination } = logger
  const { query, pathname } = location

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
          query: {},
        })
      )
    },
  }

  const colors = {
    info: '#6699CC',
    debug: '#e8e8e8',
    warning: '#F99157',
    error: '#EC5f67',
    default: '#a8b8e8',
  }
  const codeOptions = {
    lineNumbers: false,
    readOnly: true,
    CodeMirror: 'auto',
    viewportMargin: 50,
    theme: 'monokai',
  }

  const handleRefresh = newQuery => {
    dispatch(
      routerRedux.push({
        pathname,
        query: {
          ...query,
          ...newQuery,
        },
      })
    )
  }

  const listProps = {
    dataSource: list,
    pagination: pagination,
  }

  return (
    <Page inner>
      <Layout className={styles.layoutWrapper}>
        <Content>
          <Filter {...filterProps} />
          {list.length ? <List {...listProps} /> : <Empty />}
        </Content>
      </Layout>
    </Page>
  )
}
export default connect(({ logger, loading, dispatch }) => ({
  logger,
  loading,
  dispatch,
}))(Index)
