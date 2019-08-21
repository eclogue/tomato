import React from 'react'
import { connect } from 'dva'
import { Page } from 'components'
import PropTypes from 'prop-types'
import { Card, Col, Row } from 'antd'

const Index = () => {
  return (
    <Page inner>
      <div style={{ background: '#ECECEC', padding: '30px' }}>
        <Row gutter={16}>
          <Col span={8}>
            <Card title="Card title" bordered={false}>
              Card content
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Card title" bordered={false}>
              Card content
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Card title" bordered={false}>
              Card content
            </Card>
          </Col>
        </Row>
      </div>
      ,
    </Page>
  )
}

export default connect(({ console, loading }) => ({ console, loading }))(Index)
