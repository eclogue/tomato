import React from 'react'
import { Row, Form, Input, Switch, Select, Divider } from 'antd'
import { CodeMirror } from 'components'
import YAML from 'yaml'

const InputGroup = Input.Group
const FormItem = Form.Item
const Option = Select.Option
const formItemLayout = {
  labelCol: {
    xs: { span: 16 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 10 },
  },
}
const Index = ({
  extraVars = '',
  codeOptions,
  form,
  data = {},
  users = [],
  ...options
}) => {
  const { getFieldDecorator } = form
  const codeData = '---\n' + YAML.stringify(extraVars || '') + '\n\n\n'
  let previewInventory = options.previewInventory
  if (previewInventory && typeof previewInventory === 'string') {
    previewInventory = JSON.parse(previewInventory)
  }

  const inventoryContent = YAML.stringify(previewInventory || '')
  const handleSearchUser = user => {
    if ((user && user.length < 3) || options.loading) {
      return
    }
    options.searchUser(user)
  }

  const schedule = data.schedule || {}

  return (
    <Form {...formItemLayout}>
      <FormItem {...formItemLayout} label="code check">
        {getFieldDecorator('code_check', {
          initialValue: data.code_check || [],
          rules: [
            {
              required: false,
            },
          ],
        })(<Switch defaultChecked={false} disabled={true} />)}
      </FormItem>
      <FormItem {...formItemLayout} label="enable">
        {getFieldDecorator('status', {
          initialValue: data.status,
          valuePropName: 'checked',
          rules: [
            {
              required: false,
            },
          ],
        })(<Switch />)}
      </FormItem>
      <FormItem {...formItemLayout} label="notification">
        {getFieldDecorator('notification', {
          initialValue: data.notification,
          rules: [
            {
              required: false,
            },
          ],
        })(
          <Select placeholder="notification" allowClear mode="multiple">
            <Option value="wechat">wechat</Option>
            <Option value="slack">slack</Option>
            <Option value="email">email</Option>
            <Option value="sms">sms</Option>
          </Select>
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="maintainer">
        {getFieldDecorator('maintainer', {
          initialValue: data.maintainer,
          rules: [
            {
              required: false,
            },
          ],
        })(
          <Select
            showSearch
            allowClear
            dropdownMatchSelectWidth={false}
            placeholder="search user"
            onSearch={handleSearchUser}
            onFocus={options.searchUser}
            mode="multiple"
            loading={options.loading}
          >
            {users.map((user, key) => (
              <Option value={user.username} key={key}>
                {user.username}
              </Option>
            ))}
          </Select>
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="schedule" helper="crontab format">
        <InputGroup compact>
          {getFieldDecorator('schedule[minute]', {
            initialValue: schedule.minute,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input placeholder="minute" style={{ width: '20%' }} />)}
          {getFieldDecorator('schedule[hour]', {
            initialValue: schedule.hour,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input placeholder="hour" style={{ width: '20%' }} />)}
          {getFieldDecorator('schedule[day]', {
            initialValue: schedule.day,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input placeholder="day" style={{ width: '20%' }} />)}
          {getFieldDecorator('schedule[month]', {
            initialValue: schedule.months,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input placeholder="month" style={{ width: '20%' }} />)}
          {getFieldDecorator('schedule[day_of_week]', {
            initialValue: schedule.weeks,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input placeholder="day of week" style={{ width: '20%' }} />)}
        </InputGroup>
      </FormItem>
      <Divider>extra_vars</Divider>
      <Row gutter={12}>
        <FormItem {...formItemLayout.labelCol}></FormItem>
        <FormItem label="extra vars">
          <div style={{ lineHeight: 1.5 }}>
            <CodeMirror
              value={codeData || ''}
              onChange={console.log}
              options={codeOptions}
            />
          </div>
        </FormItem>
      </Row>
      <Divider>inventory</Divider>
      <Row gutter={12}>
        <FormItem {...formItemLayout.labelCol}></FormItem>
        <FormItem label="inventory">
          <div style={{ lineHeight: 1.5 }}>
            <CodeMirror value={inventoryContent || ''} options={codeOptions} />
          </div>
        </FormItem>
      </Row>
    </Form>
  )
}

export default Form.create()(Index)
