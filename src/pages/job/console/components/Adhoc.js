import React from 'react'
import { Icon, Layout, AutoComplete, Form, Input, Select,
Collapse, Button, Tooltip, TreeSelect } from 'antd'
import { CodeMirror } from 'components'
import Yaml from 'yaml'
import styles from '../index.less'

const { Panel } = Collapse
const Option = Select.Option
const FormItem = Form.Item
const { TextArea } = Input
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
}



const Index = ({form, ...props}) => {
  const { getFieldDecorator, validateFields } = form
  const { doc, searchModules, pending, queryModuleDoc } = props
  const { preview, searchInventory, onSelectInventory, modules } = props
  const moduleOptions = modules.map(item => {
    return <Option value={item.name} key={item._id}>{item.name}</Option>
  })

  const docContent = doc && typeof doc === 'object' ? Yaml.stringify(doc) : doc
  const codeptions = {
    lineNumbers: false,
    readOnly: true,
    CodeMirror: 'auto',
    viewportMargin: 50,
  }

  const handleInventory = () => {
    console.log('haaaadle')
    const result = form.getFieldsValue(['inventory'])
    if (!result.inventory) {
      return
    }

    result.inventory_type = 'cmdb'
    onSelectInventory(result)
  }

  const fetchDoc = () => {
    validateFields(['module'], (err, values) => {
      if (!err) {
        queryModuleDoc(values)
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        values.type = 'adhoc'
        props.onSubmit(values)
      }
    })
  }

  return (
    <Form onSubmit={handleSubmit} {...formItemLayout}>
      <FormItem label="module">
        {getFieldDecorator('module',{
          initialValue: '',
          rules: [{ required: true}]
        })(
            <AutoComplete placeholder="Search project"
              dataSource={moduleOptions}
              onSearch={searchModules}
              loading={pending}
            >
              <Input suffix={<Icon type="search" onClick={fetchDoc} className="certain-category-icon" />} />
            </AutoComplete>
        )}
      </FormItem>
      {!preview ? null :
        <FormItem label="doc">
          <Collapse bordered={false}>
            <Panel header="show doc" key="1">
            <CodeMirror value={docContent} options={codeptions} />
            </Panel>
          </Collapse>
        </FormItem>
      }
      <FormItem label="args">
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
      <div className={styles.executeButton}>
        <Button type="primary" htmlType="submit" loading={pending}>
          Execute
        </Button>
      </div>
    </Form>
  )
}

export default Form.create()(Index)
