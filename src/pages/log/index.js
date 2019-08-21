import React from 'react'
import { connect } from 'dva'
import { Page } from 'components'
import PropTypes from 'prop-types'
import { Icon, Layout, Collapse, Form, Input, Button, Select } from 'antd'
import styles from './index.less'


const Panel = Collapse.Panel
const Header = Layout.Header
const Content = Layout.Content
const panelStyle = {
  borderRadius: 4,
  marginBottom: 0,
  border: 0,
  overflow: 'hidden',
}

const Index = ({ logger,  form, loading, dispatch, location }) => {
  const { getFieldDecorator, getFieldsError } = form
  const { list, pagination} = logger
  const text = `
    A dog is a type of domesticated animal.
    Known for its loyalty and faithfulness,
    it can be found as a welcome guest in many households across the world.
  `
  function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  return (
    <Page inner>
      <Layout className={styles.layoutWrapper}>
        <Header className={styles.header}>
        <Form layout="inline" onSubmit={console.log}>
            <Form.Item help={'enum: [eclogue, ansible]'}>
              {getFieldDecorator('type', {
                rules: [{ required: true, message: 'Please input your username!' }],
              })(
                <Select placeholder="select log type" style={{ width: 200 }}>
                  <Select.Option value="eclogue">eclogue</Select.Option>
                  <Select.Option value="ansible">ansible</Select.Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item help='message keyword'>
              {getFieldDecorator('keyword', {
                rules: [{ required: false, message: 'Please input your Password!' }],
              })(
                <Input
                  style={{ width: 200 }}
                  prefix={<Icon type="text" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="input keyword"
                />,
              )}
            </Form.Item>
            <Form.Item help={'extra query string,for example: foo=bar&q=test'}>
              {getFieldDecorator('kwargs', {
                rules: [{ required: false, message: 'Please input your Password!' }],
              })(
                <Input
                  style={{ width: 400 }}
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="query string"
                />,
              )}
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
                Search
              </Button>
            </Form.Item>
          </Form>
        </Header>
        <Content>
          <Collapse
            bordered={false}
            defaultActiveKey={['1']}
            expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
          >
            {
              list.map((item, index) => {
                return (
                  <Panel header={item.message || 'unknown'} key={index} style={panelStyle}>
                    <p>{item.message}</p>
                  </Panel>
                )
              })
            }
          </Collapse>
        </Content>
      </Layout>
    </Page>
  )
}
const WrappedForm = Form.create({ name: 'log_filter' })(Index)
export default connect(({logger, loading, dispatch}) => ({logger, loading, dispatch}))(WrappedForm)
