import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Form, Input } from 'antd'
import config from '../../utils/config'
import styles from './index.less'
import Page from '../../components/Page'

const Dashboard = ({ dashboard, loading, location }) => {
  return <Page inner>1231231313</Page>
}

Dashboard.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ dashboard, loading }) => ({ dashboard, loading }))(
  Dashboard
)
