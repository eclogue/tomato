import React from 'react'
import { connect } from 'dva'
import { Form, Select, Input, InputNumber, Switch, Button, Card } from 'antd'
import PropTypes from 'prop-types'
import { Page } from 'components'
import styles from './index.less'

class Setting extends React.Component {
  handleSubmit = e => {
    e.preventDefault()
    const { setting, dispatch } = this.props
    const { currentItem } = setting
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (currentItem && currentItem._id) {
          values._id = currentItem._id
        }
        dispatch({
          type: 'setting/add',
          payload: values,
        })
      }
    })
  }

  render() {
    const { setting } = this.props
    const { currentItem = {} } = setting
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    }
    return (
      <Page inner>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Card title="Slack" className={styles.itemCard}>
            <Form.Item label="slack webhook">
              {getFieldDecorator('slack[webhook]', {
                rules: [{ required: false }],
                initialValue: currentItem.slack
                  ? currentItem.slack.webhook
                  : undefined,
              })(<Input placeholder="slack webhook" />)}
            </Form.Item>
            <Form.Item label="enable">
              {getFieldDecorator('slack[enable]', {
                valuePropName: 'checked',
                initialValue: currentItem.slack
                  ? currentItem.slack.enable
                  : undefined,
              })(<Switch />)}
            </Form.Item>
          </Card>
          <Card title="SMTP" className={styles.itemCard}>
            <Form.Item label="smtp server">
              {getFieldDecorator('smtp[server]', {
                rules: [{ required: false }],
                initialValue: currentItem.smtp
                  ? currentItem.smtp.server
                  : undefined,
              })(<Input placeholder="smtp server" />)}
            </Form.Item>
            <Form.Item label="smtp port">
              {getFieldDecorator('smtp[port]', {
                rules: [{ required: false }],
                initialValue: currentItem.smtp
                  ? currentItem.smtp.port
                  : undefined,
              })(<InputNumber placeholder="smtp port" />)}
            </Form.Item>
            <Form.Item label="smtp sender">
              {getFieldDecorator('smtp[sender]', {
                rules: [{ required: false }],
                initialValue: currentItem.smtp
                  ? currentItem.smtp.sender
                  : undefined,
              })(<Input placeholder="smtp sender" />)}
            </Form.Item>
            <Form.Item label="smtp from">
              {getFieldDecorator('smtp[from]', {
                rules: [{ required: false }],
                initialValue: currentItem.smtp
                  ? currentItem.smtp.from
                  : undefined,
              })(<Input placeholder="smtp from" />)}
            </Form.Item>
            <Form.Item label="smtp user">
              {getFieldDecorator('smtp[user]', {
                rules: [{ required: false }],
                initialValue: currentItem.smtp
                  ? currentItem.smtp.user
                  : undefined,
              })(<Input placeholder="smtp user" />)}
            </Form.Item>
            <Form.Item label="smtp password">
              {getFieldDecorator('smtp[password]', {
                rules: [{ required: false }],
                initialValue: currentItem.smtp
                  ? currentItem.smtp.password
                  : undefined,
              })(<Input type="password" placeholder="smtp password" />)}
            </Form.Item>
            <Form.Item label="tls">
              {getFieldDecorator('smtp[tls]', {
                valuePropName: 'checked',
                initialValue: currentItem.smtp
                  ? currentItem.smtp.enable
                  : undefined,
              })(<Switch />)}
            </Form.Item>
            <Form.Item label="enable">
              {getFieldDecorator('smtp[enable]', {
                valuePropName: 'checked',
                initialValue: currentItem.smtp
                  ? currentItem.smtp.enable
                  : undefined,
              })(<Switch />)}
            </Form.Item>
          </Card>
          <Card title="SMS(nexmo)" className={styles.itemCard}>
            <Form.Item label="api key">
              {getFieldDecorator('nexmo[key]', {
                rules: [{ required: false }],
                initialValue: currentItem.nexmo
                  ? currentItem.nexmo.key
                  : undefined,
              })(<Input placeholder="nexmo api key" />)}
            </Form.Item>
            <Form.Item label="nexmo secret">
              {getFieldDecorator('nexmo[secret]', {
                rules: [{ required: false }],
                initialValue: currentItem.nexmo
                  ? currentItem.nexmo.secret
                  : undefined,
              })(<Input placeholder="nexmo api secret" />)}
            </Form.Item>
            <Form.Item label="enable">
              {getFieldDecorator('nexmo[enable]', {
                valuePropName: 'checked',
                initialValue: currentItem.nexmo
                  ? currentItem.nexmo.enable
                  : undefined,
              })(<Switch />)}
            </Form.Item>
          </Card>
          <Card title="Wechat" className={styles.itemCard}>
            <Form.Item label="wechat corp id">
              {getFieldDecorator('wechat[corp_id]', {
                rules: [{ required: false }],
                initialValue: currentItem.wechat
                  ? currentItem.wechat.corp_id
                  : undefined,
              })(<Input placeholder="wechat corp id" />)}
            </Form.Item>
            <Form.Item label="wechat secret">
              {getFieldDecorator('wechat[secret]', {
                rules: [{ required: false }],
                initialValue: currentItem.wechat
                  ? currentItem.wechat.secret
                  : undefined,
              })(<Input placeholder="wechat secret" />)}
            </Form.Item>
            <Form.Item label="wechat agentId">
              {getFieldDecorator('wechat[agent_id]', {
                rules: [{ required: false }],
                initialValue: currentItem.wechat
                  ? currentItem.wechat.agentId
                  : undefined,
              })(<Input placeholder="wechat agent ID" />)}
            </Form.Item>
            <Form.Item label="enable">
              {getFieldDecorator('wechat[enable]', {
                valuePropName: 'checked',
                initialValue: currentItem.wechat
                  ? currentItem.wechat.enable
                  : undefined,
              })(<Switch />)}
            </Form.Item>
          </Card>
          <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Page>
    )
  }
}

Setting.propTypes = {
  setting: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
  form: PropTypes.object,
}

const WrappedSetting = Form.create({ name: 'setting' })(Setting)

export default connect(({ setting, loading, dispatch }) => ({
  setting,
  loading,
  dispatch,
}))(WrappedSetting)
