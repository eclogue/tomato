import modelExtend from 'dva-model-extend'
import { pageModel } from 'utils/model'
import * as service from './service'
import { message } from 'antd';


export default modelExtend(pageModel, {
  namespace: 'dashboard',
  state: {
    currentItem: {},
    jobs: {},
    jobDuration: {},
    hosts: {},
    apps: {},
    playbooks: {},
    config: 0,
  },
  subscriptions: {
    setup({ dispatch, history}) {
      history.listen(location => {
        if (location.pathname === '/dashboard') {
          dispatch({
            type: 'query',
            payload: {
              ...location.query
            }
          })
        }
      })
    }
  },
  effects: {
    * query({ payload }, { call, put }) {
      const response = yield call(service.dashboard, payload)
      if (response.success) {
        const { hosts, apps, jobs, playbooks, taskHistogram, taskPies, jobDuration, config } = response.data
        yield put({
          type: 'loadHosts',
          payload: { hosts },
        })
        yield put({
          type: 'loadApps',
          payload: { apps },
        })
        yield put({
          type: 'loadPlaybooks',
          payload: { playbooks },
        })
        yield put({
          type: 'loadJobs',
          payload: { jobs },
        })
        yield put({
          type: 'updateState',
          payload: {
            taskHistogram,
            taskPies,
            jobDuration,
            config,
          }
        })
      } else {
        message.error(response.message)
      }
    }
  },
  reducers: {
    loadHosts(state, { payload }) {
      let counter = 0
      const extra = []
      const states = {
        'active': 'processing',
        'unreachable': 'error'
      }
      const list = payload.hosts.map(item => {
        counter += item.count
        extra.push({
          label: item._id,
          value: item.count,
          status: states[item._id] || 'default',
        })

        return item
      })

      const hosts = {
        list,
        total: counter,
        extra: extra,
      }

      return { ...state, hosts }
    },
    loadApps(state, { payload }) {
      let total = 0
      const extra = []
      const colors = ['volcano', 'geekblue', 'lime', 'green']
      const list = payload.apps.map((item, index) => {
        total += item['count']
        extra.push({
          label: item._id,
          value: item.count,
          status: colors[index % 4],
        })

        return item
      })
      const apps = {
        list,
        total,
        extra,
      }

      return { ...state, apps}
    },
    loadPlaybooks(state, { payload }) {
      let total = 0
      const extra = []
      const stats = ['disable', 'active', 'unkown']
      const colors = ['pink', 'green']
      const list = payload.playbooks.map((item, index) => {
        total += item['count']
        extra.push({
          label: stats[item._id],
          value: item.count,
          status: colors[item._id],
        })

        return item
      })
      const playbooks = {
        list,
        total,
        extra,
      }

      return { ...state, playbooks}
    },
    loadJobs(state, { payload }) {
      let total = 0
      const extra = []
      const stats = {
        'playbook': 'cyan',
        'adhoc': 'orange'
      }
      const list = payload.jobs.map(item => {
        total += item['count']
        extra.push({
          label: item._id,
          value: item.count,
          status: stats[item._id],
        })

        return item
      })
      const jobs = {
        list,
        total,
        extra,
      }

      return { ...state, jobs}
    },
  }
})
