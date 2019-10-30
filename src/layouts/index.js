import React from 'react'
import { LocaleProvider, ConfigProvider } from 'antd'
import enUS from 'antd/lib/locale-provider/en_US'
import withRouter from 'umi/withRouter'
import App from './app'

export default withRouter(props => {
  return (
    <ConfigProvider locale={enUS}>
      <App>{props.children}</App>
    </ConfigProvider>
  )
})
