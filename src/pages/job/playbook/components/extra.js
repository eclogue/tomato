
import React from 'react'
import {Row, Col, Form, Input, Switch, Select, InputNumber, Divider} from 'antd'
import {CodeMirror} from 'components'
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
const Index = ({ extraVars = '', codeOptions, form, data={}, users=[], ...options }) => {
  const { getFieldDecorator } = form
  const codeData = '---\n' + YAML.stringify(extraVars || '') + '\n\n\n'
  let previewInventory = options.previewInventory
  if (previewInventory && typeof previewInventory === 'string') {
    previewInventory = JSON.parse(previewInventory)
  }

  const inventoryContent = YAML.stringify(previewInventory || '')
  const handleSearchUser = (user) => {
    if ((user && user.length < 3) || options.loading) {
      return
    }
    options.searchUser(user)
  }

  return (
    <Form {...formItemLayout}>
      <FormItem {...formItemLayout} label="code check">
        {getFieldDecorator('code_check', {
          initialValue: data.code_check || [],
          rules: [{
            required: false,
            type: 'array'
          }],
        })(
          <Switch defaultChecked={false} onChange={console.log} />
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="notification">
        {getFieldDecorator('notification', {
          initialValue: data.entry || [],
          rules: [{
            required: false,
            type: 'array'
          }],
        })(
          <Input placeholder="notification" />
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="maintainer">
        {getFieldDecorator('maintainer', {
          initialValue: data.maintainer,
          rules: [{
            required: false,
          }],
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
            {users.map((user, key) => <Option value={user.username} key={key}>{user.username}</Option>)}
          </Select>
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="schedule">
        <InputGroup compact>
        {getFieldDecorator('shedule[minute]', {
          initialValue: data.minute,
          rules: [{
            required: false,
          }],
        })(
          <Input placeholder="minute" style={{ width: '20%' }}/>
        )}
        {getFieldDecorator('shedule[hour]', {
          initialValue: data.hour,
          rules: [{
            required: false,
          }],
        })(
          <Input placeholder="hour" style={{ width: '20%' }}/>
        )}
        {getFieldDecorator('shedule[day]', {
          initialValue: data.day,
          rules: [{
            required: false,
          }],
        })(
          <Input placeholder="day" style={{ width: '20%' }}/>
        )}
        {getFieldDecorator('shedule[month]', {
          initialValue: data.month,
          rules: [{
            required: false,
          }],
        })(
          <Input placeholder="month" style={{ width: '20%' }}/>
        )}
        {getFieldDecorator('shedule[week]', {
          initialValue: data.week,
          rules: [{
            required: false,
          }],
        })(
          <Input placeholder="week" style={{ width: '20%' }}/>
        )}
        </InputGroup>
      </FormItem>
      <Divider>extra_vars</Divider>
      <Row gutter={12}>
        <FormItem {...formItemLayout.labelCol}>
        </FormItem>
        <FormItem label="extra vars">
          <div style={{lineHeight: 1.5}}>
            <CodeMirror value={codeData || ''} onChange={console.log} options={codeOptions} />
          </div>
        </FormItem>
      </Row>
      <Divider>inventory</Divider>
      <Row gutter={12}>
        <FormItem {...formItemLayout.labelCol}></FormItem>
        <FormItem label="inventory">
          <div style={{lineHeight: 1.5}}>
            <CodeMirror value={inventoryContent || ''} options={codeOptions} />
          </div>
        </FormItem>
      </Row>
    </Form>
  )
}

export default Form.create()(Index)
