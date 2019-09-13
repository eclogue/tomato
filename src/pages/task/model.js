import modelExtend from 'dva-model-extend'
import { pageModel } from 'utils/model'
import * as serivce from './service'
import moment from 'moment'

export default modelExtend(pageModel, {
  namespace: 'task',
  state: {
    queues: [],
    taskHistogram: [],
    taskPies: [],
    currentItem: {},
    selectedRowKeys: [],
    taskStatePies: [],
    schedule: [],
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/task') {
          dispatch({
            type: 'query',
            payload: {
              ...location.query,
            },
          })
        }
      })
    },
  },

  effects: {
    * query ({ payload }, { call, put }) {
      const response = yield call(serivce.monitor, payload)
      if (response.success) {
        const { queues, taskHistogram, taskPies, taskStatePies, schedule } =response.data
        yield put({
          type: 'loadHistogram',
          payload: {
            taskHistogram
          }
        })
        yield put({
          type: 'updateState',
          payload: {
            queues,
            taskPies,
            taskStatePies,
            schedule,
          }
        })
      } else {
        throw response
      }
    },
  },
  reducers: {
    loadHistogram(state, { payload }) {
      console.log(payload)
      const { taskHistogram } = payload
      const histogram = taskHistogram.map(item => {
        item.date = moment(item.date * 1000).format('YYYY-MM-DD hh:mm:ss')

        return item
      })
      return { ...state, taskHistogram: histogram}
    }
  }
});
