import modelExtend from 'dva-model-extend'
import { pageModel } from 'utils/model'
import * as service from './service'
import { message } from 'antd';


export default modelExtend(pageModel, {
  namespace: 'setting',
  state: {
    currentItem: {},
  },
  effects: {

  },
  reducers: {

  }
})
