import React from 'react'
import { connect } from 'dva'
import { Page } from 'components'
import PropTypes from 'prop-types'
import { Empty } from 'antd'
import { routerRedux } from 'dva/router'


const Index = ({ setting, loading, dispatch, location }) => {


  return (
    <Page inner>
      <Empty />
    </Page>
  )
}

export default connect(({setting, loading, dispatch}) => ({setting, loading, dispatch}))(Index)
