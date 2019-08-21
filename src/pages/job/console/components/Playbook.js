import React from 'react'
import { Form, Select, Button, Tooltip, Input, TreeSelect } from 'antd'
import { CodeMirror } from 'components'
import styles from '../index.less'

const Option = Select.Option
const FormItem = Form.Item
const { TextArea } = Input
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
    console.log(params)
    onCodeChange(params[2])
  }

  return (
    <Form onSubmit={handleSubmit} {...formItemLayout}>
      <FormItem label="tasks" required >
        <div style={{lineHeight: '20px'}}>
          <CodeMirror value={taskContent} options={codeptions} onChange={handleCodeChange}/>
        </div>
      </FormItem>
      <FormItem   label="args">
        {getFieldDecorator('args',{
          initialValue: '',
          rules: [{ required: false}]
        })(
          <TextArea placeholder="Autosize height based on content lines" autosize />
        )}
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
      <div className={styles.executeButton}>
        <Button type="primary" htmlType="submit" loading={pending}>
          Execute
        </Button>
      </div>
    </Form>
  )
}

export default Form.create()(Index)
