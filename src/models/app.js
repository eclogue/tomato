/* global window */
/* global document */
/* global location */
/* eslint no-restricted-globals: ["error", "event"] */

import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import { EnumRoleType } from '../utils/enums'
import { logout, getUser, getMenus } from '../services/app'
import config from '../utils/config'
// import * as menusService from 'services/menus'
import queryString from 'query-string'
import { storage } from 'utils'

const { prefix } = config

export default {
  namespace: 'app',
  state: {
    user: storage.get('user') || {},
    permissions: {
      visit: [],
    },
    menu: [
      {
        id: 1,
        icon: 'laptop',
        name: 'Dashboard',
        router: '/dashboard',
      },
    ],
    menuPopoverVisible: false,
    siderFold: window.localStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: window.localStorage.getItem(`${prefix}darkTheme`) === 'true',
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys:
      JSON.parse(window.localStorage.getItem(`${prefix}navOpenKeys`)) || [],
    locationPathname: '',
    locationQuery: {},
  },
  subscriptions: {
    setupHistory({ dispatch, history }) {
      history.listen(location => {
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: location.pathname,
            locationQuery: location.query,
          },
        })
      })
    },

    setup({ dispatch }) {
      dispatch({ type: 'query' })
      let tid = null
      window.onresize = () => {
        clearTimeout(tid)
        tid = setTimeout(() => {
          dispatch({ type: 'changeNavbar' })
        }, 300)
      }
    },
  },
  effects: {
    *query({ payload }, { call, put, select }) {
      // 获取登录用户
      // const { success, user } = yield call(query, payload);
      const user = yield call(getUser, payload)
      const { locationPathname } = yield select(_ => _.app)
      // 检查登录状态
      if (user) {
        const result = yield call(getMenus, { user })
        const list = result.data
        let permissions = { role: EnumRoleType.ADMIN, vist: list }
        let menu = list
        if (
          permissions.role === EnumRoleType.ADMIN ||
          permissions.role === EnumRoleType.DEVELOPER
        ) {
          permissions.visit = list.map(item => item.id)
        } else {
          menu = list.filter(item => {
            const cases = [
              permissions.visit.includes(item.id),
              item.mpid
                ? permissions.visit.includes(item.mpid) || item.mpid === '-1'
                : true,
              item.bpid ? permissions.visit.includes(item.bpid) : true,
            ]
            return cases.every(_ => _)
          })
        }
        yield put({
          type: 'updateState',
          payload: {
            user,
            permissions,
            menu,
          },
        })
        if (location.pathname === '/login') {
          yield put(
            routerRedux.push({
              pathname: '/dashboard',
            })
          )
        }
      } else if (
        config.openPages &&
        config.openPages.indexOf(locationPathname) < 0
      ) {
        yield put(
          routerRedux.push({
            pathname: '/login',
            search: queryString.stringify({
              from: locationPathname,
            }),
          })
        )
      }
    },

    *logout({ payload }, { call, put }) {
      const data = yield call(logout, parse(payload))
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            user: {},
            permissions: { visit: [] },
            menu: [
              {
                id: 1,
                icon: 'laptop',
                name: 'Dashboard',
                router: '/dashboard',
              },
            ],
          },
        })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    *changeNavbar(action, { put, select }) {
      const { app } = yield select(_ => _)
      const isNavbar = document.body.clientWidth < 769
      if (isNavbar !== app.isNavbar) {
        yield put({ type: 'handleNavbar', payload: isNavbar })
      }
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

    switchSider(state) {
      window.localStorage.setItem(`${prefix}siderFold`, !state.siderFold)
      return {
        ...state,
        siderFold: !state.siderFold,
      }
    },

    switchTheme(state) {
      window.localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme)
      return {
        ...state,
        darkTheme: !state.darkTheme,
      }
    },

    switchMenuPopver(state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      }
    },

    handleNavbar(state, { payload }) {
      return {
        ...state,
        isNavbar: payload,
      }
    },

    handleNavOpenKeys(state, { payload: navOpenKeys }) {
      return {
        ...state,
        ...navOpenKeys,
      }
    },
  },
}
