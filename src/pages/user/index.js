import React from 'react'
import { connect } from 'dva'
import { Page } from 'components'
import PropTypes from 'prop-types'
import { Icon, Layout, Menu, Tabs } from 'antd'
import { routerRedux } from 'dva/router'
import Profile from './components/Profile'
import SSH from './components/SSH'
import Security from './components/Security'
import Alert from './components/Alert'
import styles from './index.less'

const { TabPane } = Tabs

const Index = ({ dispatch, user, loading, location }) => {
  const { query, pathname } = location
  const { currentItem, pending } = user
  const action = query.action || 'profile'
  const itemNav = key => {
    dispatch(
      routerRedux.push({
        pathname,
        query: {
          action: key,
        },
      })
    )
  }

  const profileProps = {
    pending,
    currentItem,
    onSave: values => {
      dispatch({
        type: 'user/saveProfile',
        payload: values,
      })
    },
    onSendMail(email) {
      dispatch({
        type: 'user/sendMail',
        payload: { email },
      })
    },
  }

  const securityProps = {
    pending,
    currentItem,
    onVerifyPhone(params) {
      console.log('phone', params)
    },
    onResetPassword(params) {
      dispatch({
        type: 'user/resetPassword',
        payload: params,
      })
    },
  }

  const sshProps = {
    currentItem,
    pending,
    visible: user.sshFormVisible,
    setVisible(value) {
      dispatch({
        type: 'user/updateState',
        payload: {
          sshFormVisible: value,
        },
      })
    },
    onSave(params) {
      dispatch({
        type: 'user/addPublicKey',
        payload: params,
      }).then(() => {
        dispatch(
          routerRedux.push({
            pahtname: location.pahtname,
            query: location.query,
          })
        )
      })
    },
    onUpdate() {},
    onDelete() {},
  }

  const alertProps = {
    currentItem,
    onChange(type, value) {
      dispatch({
        type: 'user/saveAlert',
        payload: {
          alerts: value,
          type: type,
        },
      })
    },
  }

  return (
    <Page inner>
      <Tabs
        tabPosition="left"
        tabBarGutter={12}
        onTabClick={itemNav}
        activeKey={action}
      >
        <TabPane
          tab={
            <div>
              <Icon type="user" />
              profile
            </div>
          }
          key="profile"
        >
          <Profile {...profileProps} />
        </TabPane>
        <TabPane
          tab={
            <div>
              <Icon type="safety-certificate" />
              security
            </div>
          }
          key="security"
        >
          <Security {...securityProps} />
        </TabPane>
        <TabPane
          tab={
            <div>
              <Icon type="key" />
              ssh key
            </div>
          }
          key="sshkey"
        >
          <SSH {...sshProps} />
        </TabPane>
        <TabPane
          tab={
            <div>
              <Icon type="alert" />
              alert
            </div>
          }
          key="alert"
        >
          <Alert {...alertProps} />
        </TabPane>
      </Tabs>
    </Page>
  )
}

export default connect(({ user, dispatch, loading }) => ({
  user,
  dispatch,
  loading,
}))(Index)
