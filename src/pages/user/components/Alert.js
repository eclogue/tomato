import React from 'react'
import { Form, Checkbox, Input, Button, Radio } from 'antd'
import { Page } from 'components'
import PropTypes from 'prop-types'

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
}
const CheckboxGroup = Checkbox.Group

const Alert = ({ currentItem, form }) => {
  const setting = currentItem.setting || {}
  const { getFieldDecorator } = form
  const plainOptions = [
    {
      label: 'Slack',
      value: 'slack',
      disabled: !setting.slack,
    },
    {
      label: 'Email',
      value: 'email',
      disabled: !setting.smtp,
    },
    {
      label: 'Phone',
      value: 'phone',
      disabled: !setting.sms,
    },
    {
      label: 'Wechat',
      value: 'wechat',
      disabled: !setting.wechat,
    },
    {
      label: 'Web',
      value: 'web',
    },
  ]
  return (
    <div>
      <Form {...formItemLayout}>
        <Form.Item label="task except">
          {getFieldDecorator('task', {
            initialValue: currentItem.task_alert || ['slack'],
          })(<Checkbox.Group options={plainOptions} onChange={console.log} />)}
        </Form.Item>
        <Form.Item label="server error">
          {getFieldDecorator('server', {
            initialValue: currentItem.task_alert || ['slack'],
          })(<Checkbox.Group options={plainOptions} onChange={console.log} />)}
        </Form.Item>
      </Form>
    </div>
  )
}

export default Form.create({ name: 'alert' })(Alert)
