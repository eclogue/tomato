import React from 'react'
import { connect } from 'dva'
import { Page, CodeMirror } from 'components'
import PropTypes from 'prop-types'
import Yaml from 'yaml'
import { Icon, Layout, AutoComplete, Form, Input, Select,
Collapse, Button, Tooltip, Tree, Empty } from 'antd'
import styles from './index.less'

const { Panel } = Collapse
const Option = Select.Option
const FormItem = Form.Item
const { TextArea } = Input
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
}

const Index = ({ inventoryDetail, dispatch, loading, form }) => {
  const { getFieldDecorator, validateFields } = form
  const { users, currentItem, pending } = inventoryDetail
  const codeOptions = {
    lineNumbers: true,
    readOnly: true,
    CodeMirror: 'auto',
    viewportMargin: 40,
  }

  const disableEdit = [
    'ansible_hostname',
    'ansible_ssh_host',
    'ansible_ssh_port',
    'ansible_ssh_user',
    'tags',
    'description',
    '_id',
    'group',
  ]


  const info = {}
  for (const key in currentItem) {
    if (disableEdit.indexOf(key) === -1) {
      info[key] = currentItem[key]
    }
  }
  const content = Yaml.stringify(info)


  return (
   <Page inner>
    <Form {...formItemLayout}>
      <FormItem   label="ansible_ssh_host">
        {getFieldDecorator('ansible_ssh_host',{
          initialValue:  currentItem.ansible_ssh_host,
          rules: [{ required: true}]
        })(
          <Input placeholder="ansible ssh host" autosize />
        )}
      </FormItem>
      <FormItem   label="ansible_ssh_user">
        {getFieldDecorator('ansible_ssh_user',{
          initialValue:  currentItem.ansible_ssh_user,
          rules: [{ required: true}]
        })(
          <Input placeholder="ansible ssh user" autosize />
        )}
      </FormItem>
      <FormItem   label="ansible_ssh_port">
        {getFieldDecorator('ansible_ssh_port',{
          initialValue: currentItem.ansible_ssh_port,
          rules: [{ required: false}]
        })(
          <Input placeholder="ansible ssh port" autosize />
        )}
      </FormItem>
      <FormItem   label="tags">
        {getFieldDecorator('tags',{
          initialValue: currentItem.tags,
          rules: [{ required: false}]
        })(
          <Input placeholder="tags" />
        )}
      </FormItem>
      <FormItem label="description">
        {getFieldDecorator('description',{
          initialValue: currentItem.description,
          rules: [{ required: false}]
        })(
          <TextArea placeholder="description" autosize />
        )}
      </FormItem>
      <FormItem label="factors" required >
        <div style={{lineHeight: '20px'}}>
          <CodeMirror value={content} options={codeOptions} onChange={console.log}/>
        </div>
      </FormItem>
      <div className={styles.submit}>
        <Button type="primary" htmlType="submit" loading={pending}>
          Save
        </Button>
      </div>
    </Form>
   </Page>
  )
}

Index.props = {
  inventoryDetail: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object
}

export default connect(({ inventoryDetail, loading, dispatch }) => ({
  inventoryDetail, loading, dispatch }))(Form.create()(Index))
