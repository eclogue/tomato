import React from 'react'
import { Form, Divider, Input, Button, Tag } from 'antd'
import PropTypes from 'prop-types'
import { Page } from 'components'
import styles from './security.less'

const tailStyle = {
  textAlign: 'center',
}
class Security extends React.Component {
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
    const { currentItem = {} } = this.props
    console.log(this.props, currentItem)
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    }
    return (
      <Page inner>
        <div className={styles.wrapper}>
          <Divider>Reset password</Divider>
          <Form {...formItemLayout} onSubmit={console.log}>
            <Form.Item label="old password">
              {getFieldDecorator('password', {
                rules: [{ required: true }],
              })(<Input placeholder="old password" type="password" />)}
            </Form.Item>
            <Form.Item label="new password">
              {getFieldDecorator('newPwd', {
                rules: [{ required: true }],
              })(<Input placeholder="new password" type="password" />)}
            </Form.Item>
            <Form.Item label="confirm">
              {getFieldDecorator('confirm', {
                roles: [{ required: true }],
              })(<Input placeholder="confirm" type="password" />)}
            </Form.Item>
            <div style={tailStyle}>
              <Button type="primary" htmlType="submit">
                reset
              </Button>
            </div>
          </Form>
          <Divider>Verfiy phone</Divider>
          <Form {...formItemLayout}>
            <Form.Item label="phone number">
              {getFieldDecorator('phone', {
                rules: [{ required: true }],
                initialValue: currentItem.slack
                  ? currentItem.slack.server
                  : undefined,
              })(<Input placeholder="phone number" disabled />)}
            </Form.Item>
            <Form.Item label="verfy code">
              {getFieldDecorator('code', {
                rules: [{ required: false }],
              })(
                <Input
                  placeholder="verify code"
                  addonAfter={<div className={styles.verfiyButton}>send</div>}
                />
              )}
            </Form.Item>
            <div style={tailStyle}>
              <Button type="primary" htmlType="submit">
                verify
              </Button>
            </div>
          </Form>
        </div>
      </Page>
    )
  }
}

Security.propTypes = {
  currentItem: PropTypes.object,
  form: PropTypes.object,
  onVerifyPhone: PropTypes.func,
  onVerifyMail: PropTypes.func,
  onResetPassword: PropTypes.func,
}

export default Form.create({ name: 'setting' })(Security)
