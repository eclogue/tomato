/* global window */
/* global document */
import React from 'react'
import NProgress from 'nprogress'
import PropTypes from 'prop-types'
import pathToRegexp from 'path-to-regexp'
import { connect } from 'dva'
import * as MyLayout from '../components/Layout'
import Loader from '../components/Loader'
import { BackTop, Layout } from 'antd'
import classnames from 'classnames'
import config from '../utils/config'
import { Helmet } from 'react-helmet'
import { withRouter, routerRedux } from 'dva/router'
import Error from '../pages/404'
import '../themes/index.less'
import './app.less'
// import storage from 'utils/storage'
// const user = storage.get('user');
// const socketClient = require('socket.io-client');
// const socket = socketClient('http://127.0.0.1:5000/chat', {
//   transportOptions: {
//     polling: {
//       extraHeaders: {
//         Authorization: 'Bearer ' + user.token
//       }
//     }
//   }
// });
// socket.on('connect', function() {
//   socket.emit('test', user);
// });

const { Content, Footer, Sider } = Layout
const { Header, Bread, styles } = MyLayout
const { prefix, openPages } = config
let lastHref

const App = ({ children, dispatch, app, loading, location }) => {
  const {
    user,
    siderFold,
    darkTheme,
    isNavbar,
    menuPopoverVisible,
    navOpenKeys,
    menu,
    permissions,
    notifications,
  } = app
  let { pathname, query } = location
  pathname = pathname.startsWith('/') ? pathname : `/${pathname}`
  const { iconFontJS, iconFontCSS, logo } = config
  const current = menu.filter(item =>
    pathToRegexp(item.route || '').exec(pathname)
  )
  const hasPermission = current.length
    ? permissions.visit.includes(current[0].id)
    : false
  const { href } = window.location

  if (lastHref !== href) {
    NProgress.start()
    if (!loading.global) {
      NProgress.done()
      lastHref = href
    }
  }

  const headerProps = {
    menu,
    user,
    location,
    siderFold,
    isNavbar,
    notifications,
    menuPopoverVisible,
    navOpenKeys,
    switchMenuPopover() {
      dispatch({ type: 'app/switchMenuPopver' })
    },
    logout() {
      dispatch({ type: 'app/logout' })
    },
    switchSider() {
      dispatch({ type: 'app/switchSider' })
    },
    changeOpenKeys(openKeys) {
      dispatch({
        type: 'app/handleNavOpenKeys',
        payload: { navOpenKeys: openKeys },
      })
    },
    viewProfile() {
      dispatch(
        routerRedux.push({
          pathname: '/user',
        })
      )
    },
    markAsRead(ids) {
      dispatch({
        type: 'app/markAsRead',
        payload: { ids },
      })
    },
    viewNotify() {
      dispatch(
        routerRedux.push({
          pathname: '/notification',
        })
      )
    },
  }

  const siderProps = {
    menu,
    location,
    siderFold,
    darkTheme,
    navOpenKeys,
    changeTheme() {
      dispatch({ type: 'app/switchTheme' })
    },
    changeOpenKeys(openKeys) {
      window.localStorage.setItem(
        `${prefix}navOpenKeys`,
        JSON.stringify(openKeys)
      )
      dispatch({
        type: 'app/handleNavOpenKeys',
        payload: { navOpenKeys: openKeys },
      })
    },
  }

  const breadProps = {
    menu,
    location,
  }

  if (openPages && openPages.includes(pathname)) {
    return (
      <div>
        <Loader fullScreen spinning={loading.effects['app/query']} />
        {children}
      </div>
    )
  }
  return (
    <div>
      <Loader fullScreen spinning={loading.effects['app/query']} />
      <Helmet>
        <title>Eclogue devops</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href={logo} type="image/x-icon" />
        {iconFontJS && <script src={iconFontJS} />}
        {iconFontCSS && <link rel="stylesheet" href={iconFontCSS} />}
      </Helmet>

      <Layout
        className={classnames({
          [styles.dark]: darkTheme,
          [styles.light]: !darkTheme,
        })}
      >
        {!isNavbar && (
          <Sider trigger={null} collapsible collapsed={siderFold}>
            {siderProps.menu.length === 0 ? null : (
              <MyLayout.Sider {...siderProps} />
            )}
          </Sider>
        )}
        <Layout
          style={{ height: '100vh', overflow: 'scroll' }}
          id="mainContainer"
        >
          <BackTop target={() => document.getElementById('mainContainer')} />
          <Header {...headerProps} />
          <Content>
            <Bread {...breadProps} />
            {hasPermission ? children : <Error />}
          </Content>
          <Footer>{config.footerText}</Footer>
        </Layout>
      </Layout>
    </div>
  )
}

App.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
  loading: PropTypes.object,
}

export default withRouter(
  connect(({ app, loading }) => ({ app, loading }))(App)
)
