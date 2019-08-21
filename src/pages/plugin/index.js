import React from 'react'
import { connect } from 'dva'
import { Page } from 'components'
import PropTypes from 'prop-types'

const Index = () => {
  return (
    <Page inner>
      <h1>1123123123</h1>
    </Page>
  )
}

export default connect(({ console, loading }) => ({ console, loading }))(Index)
