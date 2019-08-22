import React from 'react'
import { connect } from 'dva'
import { Page } from 'components'
import PropTypes from 'prop-types'
import { Icon, Layout, Menu } from 'antd'
import { routerRedux } from 'dva/router'
import Profile from './components/Profile'
import SSH from './components/SSH'
import styles from './index.less'

const { Content, Sider } = Layout


const Index = ({ dispatch, user, loading, location }) => {
  const { query, pathname } = location
  const { currentItem, action } = user
  const itemNav = e => {
    dispatch(routerRedux.replace({
      pathname,
      query: {
        action: e.key
      }
    }))
  }

  const currentContent = () => {
    if (query.action === 'getProfile') {
      return <Profile currentItem={currentItem} />
    } else if (query.action === 'getSSHKey') {
      return <SSH currentItem={currentItem} />
    }
  }

  return (
    <Page inner>
      <Layout className={styles.layout}>
        <Sider className={styles.sider}>
          <Menu defaultSelectedKeys={[action]}>
            <Menu.Item key="getProfile" onClick={itemNav}>Your Profile</Menu.Item>
            <Menu.Item key="getSetting" onClick={itemNav}>Settings</Menu.Item>
            <Menu.Item key="getSSHKey" onClick={itemNav}>SSH Key</Menu.Item>
            <Menu.Item key="getAlerts" onClick={itemNav}>Alerts</Menu.Item>
          </Menu>
        </Sider>
        <Content className={styles.content}>
          {currentContent()}
        </Content>
      </Layout>
    </Page>
  )
}

export default connect(({ user, dispatch, loading }) => ({ user, dispatch, loading }))(Index)
