import React from 'react'
import { connect } from 'dva'
import { Page } from 'components'
import PropTypes from 'prop-types'
import { Icon, Layout, Row, Col } from 'antd'
import { routerRedux } from 'dva/router'


const Index = ({ xx, loading, dispatch, location }) => {


  return (
    <Page inner>
    </Page>
  )
}

export default connect(({xx, loading, dispatch}) => ({xx, loading, dispatch}))(Index)
