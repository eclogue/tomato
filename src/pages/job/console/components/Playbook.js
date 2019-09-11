import React from 'react'
import { Form, Select, Button, Tooltip, Input, TreeSelect } from 'antd'
import { CodeMirror } from 'components'
import styles from '../index.less'

const Option = Select.Option
const FormItem = Form.Item
const { TextArea } = Input
const InputGroup = Input.Group
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
}

const Index = ({form, ...props}) => {
  const { getFieldDecorator, validateFields } = form
  const { pending, searchInventory, onSelectInventory, onCodeChange } = props

  const taskContent = '---\n\n\n\n\n'
  const codeptions = {
    lineNumbers: true,
    readOnly: false,
    CodeMirror: 'auto',
    viewportMargin: 50,
    theme: 'monokai',
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    validateFields((err, values) => {
      if (!err) {
        values.type = 'playbook'
        props.onSubmit(values)
      }
    })
  }

  const handleInventory = () => {
    const result = form.getFieldsValue(['inventory'])
    if (!result.inventory) {
      return
    }
    result.inventory_type = 'cmdb'
    onSelectInventory(result)
  }

  const handleCodeChange = (...params) => {
    onCodeChange(params[2])
  }

  return (
    <Form onSubmit={handleSubmit} {...formItemLayout}>
      <FormItem label="tasks" required >
        <div style={{lineHeight: '20px'}}>
          <CodeMirror value={taskContent} options={codeptions} onChange={handleCodeChange}/>
        </div>
      </FormItem>
      <FormItem label="inventory">
      {getFieldDecorator('inventory', {
          rules: [{
            required: true,
          }],
        })(
          <TreeSelect treeData={props.pendingInventory}
            onFocus={() => searchInventory('')}
            onSearch={searchInventory}
            onSelect={handleInventory}
            onChange={handleInventory}
            allowClear
            multiple
          />
        )}
      </FormItem>
      <FormItem label="private_key">
        {getFieldDecorator('private_key', {
          rules: [{
            required: true,
          }],
        })(
          <Select
            placeholder="select ssh_private_key"
          >
            {props.credentials.map(item => {
              return <Option value={item._id} key={item._id}>{item.name}</Option>
            })}
          </Select>
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="become">
        <InputGroup compact>
          {getFieldDecorator('become_method', {
            rules: [{
              required: false,
            }],
          })(
            <Select style={{ width: '25%'}}
              placeholder="method"
              allowClear
            >
              <Option value="sudo">sudo</Option>
              <Option value="su">su</Option>
              <Option value="pbrun">pbrun</Option>
              <Option value="pfexec">pfexec</Option>
              <Option value="doas">doas</Option>
              <Option value="dzdo">dzdo</Option>
              <Option value="ksu">ksu</Option>
              <Option value="runas">runas</Option>
              <Option value="pmrun">pmrun</Option>
              <Option value="enable">enable</Option>
              <Option value="machinectl">machinectl</Option>
            </Select>
          )}
          {getFieldDecorator('become_user', {
            rules: [{
              required: false,
            }],
          })(
            <Input placeholder="become user" style={{ width: '75%'}}/>
          )
        }
        </InputGroup>
      </FormItem>
      <FormItem label="verbosity">
        {getFieldDecorator('verbosity', {
          rules: [{
            required: false,
          }],
        })(
          <Select
            placeholder="debug level"
          >
            <Option value={0} key={1}>0</Option>
            <Option value={1} key={1}>1</Option>
            <Option value={2} key={2}>2</Option>
            <Option value={3} key={3}>3</Option>
          </Select>
        )}
      </FormItem>
      <FormItem label="more options">
        <div style={{lineHeight: 1.5}}>
          <CodeMirror value={'---\n\n\n'}
            options={{...codeptions, lineNumbers: true, readOnly: false}}
            onChange={props.onExtraOptionsChange}
          />
        </div>
      </FormItem>
      <div className={styles.executeButton}>
        <Button type="primary" htmlType="submit" loading={pending}>
          Execute
        </Button>
      </div>
    </Form>
  )
}

export default Form.create()(Index)
