import React from 'react'
import { connect } from 'dva'
import { Page } from 'components'
import PropTypes from 'prop-types'
import { Empty } from 'antd'

const Index = () => {
  return (
    <Page inner>
      <Empty />
    </Page>
  )
}

export default connect(({ console, loading }) => ({ console, loading }))(Index)
