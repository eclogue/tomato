import React from 'react'
import { connect } from 'dva'
import { Page, CodeMirror } from 'components'
import { routerRedux } from 'dva/router'
import PropTypes from 'prop-types'
import { Icon, Layout, Collapse, Form, Input, Button, Empty } from 'antd'
import styles from './index.less'
import stringifyObject from 'stringify-object'
import moment from 'moment'
import Filter from './components/Filter'

const Panel = Collapse.Panel
const Header = Layout.Header
const Content = Layout.Content
const panelStyle = {
  borderRadius: 4,
  marginBottom: 0,
  border: 0,
  overflow: 'hidden',
}
console.log('cccccccc', styles)

const Index = ({ logger,  loading, dispatch, location }) => {
  const { list, pagination} = logger
  const { query, pathname } = location

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
  }

  const colors = {
    'info': '#6699CC',
    'debug': '#e8e8e8',
    'warning': '#F99157',
    'error': '#EC5f67',
    'default': '#a8b8e8'
  }
  const codeOptions = {
    lineNumbers: false,
    readOnly: true,
    CodeMirror: 'auto',
    viewportMargin: 50,
    theme: 'monokai',
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

  const loggerViewer = (
    <Collapse
      bordered={false}
      defaultActiveKey={[]}
      expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
    >
      {
        list.map((item, index) => {
          const { message, level } = item
          const colorIndex = level ? level.toLocaleLowerCase() : 'default'
          const color = colors[colorIndex] || 'cyan'
          const title = (
            <code>
              <span className={styles.level} style={{color}}>{level}</span>
              <span className={styles.message} style={{color}}>{message}</span>
              <span style={{color: 'gray'}}>{moment(item.timestamp).format()}</span>
            </code>
          )
          const pretty = stringifyObject(item, {
              indent: '  ',
              singleQuotes: false
          })
          return (
            <Panel header={title} key={index} style={panelStyle}>
              <div><CodeMirror value={pretty} options={codeOptions}></CodeMirror></div>
            </Panel>
          )
        })
      }
    </Collapse>
  )
  return (
    <Page inner>
      <Layout className={styles.layoutWrapper}>
        <Header className={styles.header}>
          <Filter {...filterProps}/>
        </Header>
        <Content>
          {list.length ? loggerViewer : <Empty />}
        </Content>
      </Layout>
    </Page>
  )
}
export default connect(({logger, loading, dispatch}) => ({logger, loading, dispatch}))(Index)
