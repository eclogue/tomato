
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
        {getFieldDecorator('minute', {
          initialValue: data.minute,
          rules: [{
            required: false,
            type: 'number'
          }],
        })(
          <Input placeholder="minute" style={{ width: '10%' }}/>
        )}
        {getFieldDecorator('hour', {
          initialValue: data.hour,
          rules: [{
            required: false,
            type: 'number'
          }],
        })(
          <Input placeholder="hour" style={{ width: '10%' }}/>
        )}
        {getFieldDecorator('day', {
          initialValue: data.day,
          rules: [{
            required: false,
          }],
        })(
          <InputNumber placeholder="day" style={{ width: '10%' }}/>
        )}
        {getFieldDecorator('month', {
          initialValue: data.month,
          rules: [{
            required: false,
            type: 'number'
          }],
        })(
          <InputNumber placeholder="month" style={{ width: '10%' }}/>
        )}
        {getFieldDecorator('week', {
          initialValue: data.week,
          rules: [{
            required: false,
            type: 'number'
          }],
        })(
          <InputNumber placeholder="week" style={{ width: '10%' }}/>
        )}
        {getFieldDecorator('year', {
          initialValue: data.year,
          rules: [{
            required: false,
            type: 'number'
          }],
        })(
          <InputNumber placeholder="year" style={{ width: '10%' }}/>
        )}
        </InputGroup>
      </FormItem>
      <Divider>extra_vars</Divider>
      <Row gutter={12}>
        <Col {...formItemLayout.labelCol}>
        </Col>
        <Col>
          <div>
            <CodeMirror value={codeData || ''} onChange={console.log} options={codeOptions} />
          </div>
        </Col>
      </Row>
      <Divider>inventory</Divider>
      <Row gutter={12}>
        <Col {...formItemLayout.labelCol}></Col>
        <Col>
          <div>
            <CodeMirror value={inventoryContent || ''} options={codeOptions} />
          </div>
        </Col>
      </Row>
    </Form>
  )
}

export default Form.create()(Index)
