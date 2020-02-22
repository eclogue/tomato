import React from 'react'
import { Form, Divider, Input, Button, Tag } from 'antd'
import PropTypes from 'prop-types'
import { Page } from 'components'
import styles from './security.less'

const tailStyle = {
  textAlign: 'center',
}

const Security = props => {
  const { currentItem = {} } = props
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 },
  }

  const PasswordForm = ({ form }) => {
    const { getFieldDecorator } = form
    const onResetPassword = e => {
      e.preventDefault()
      form.validateFields((err, values) => {
        if (!err) {
          props.onResetPassword(values)
        }
      })
    }

    return (
      <Form {...formItemLayout} onSubmit={onResetPassword}>
        <Form.Item label="old password">
          {getFieldDecorator('old_pwd', {
            rules: [{ required: true }],
          })(<Input placeholder="old password" type="password" />)}
        </Form.Item>
        <Form.Item label="new password">
          {getFieldDecorator('new_pwd', {
            rules: [{ required: true }],
          })(<Input placeholder="new password" type="password" />)}
        </Form.Item>
        <Form.Item label="confirm">
          {getFieldDecorator('confirm', {
            rules: [{ required: true }],
          })(<Input placeholder="confirm" type="password" />)}
        </Form.Item>
        <div style={tailStyle}>
          <Button type="primary" htmlType="submit">
            reset
          </Button>
        </div>
      </Form>
    )
  }

  const PasswordComponent = Form.create({ name: 'password' })(PasswordForm)

  const PhoneForm = ({ form }) => {
    const { getFieldDecorator } = form
    return (
      <Form {...formItemLayout}>
        <Form.Item label="phone number">
          {getFieldDecorator('phone', {
            rules: [{ required: true }],
            initialValue: currentItem.phone,
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
    )
  }

  const PhoneComponent = Form.create({ name: 'phone' })(PhoneForm)

  return (
    <Page inner>
      <div className={styles.wrapper}>
        <Divider>Reset password</Divider>
        <PasswordComponent />
        <Divider>Verfiy phone</Divider>
        <PhoneComponent />
      </div>
    </Page>
  )
}

Security.propTypes = {
  currentItem: PropTypes.object,
  form: PropTypes.object,
  onVerifyPhone: PropTypes.func,
  onVerifyMail: PropTypes.func,
  onResetPassword: PropTypes.func,
}

export default Form.create({ name: 'setting' })(Security)
