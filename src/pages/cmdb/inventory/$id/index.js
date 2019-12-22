import React from 'react'
import { connect } from 'dva'
import { Page, CodeMirror } from 'components'
import PropTypes from 'prop-types'
import { stringifyYaml } from 'utils'
import { Form, Input, Select, Button } from 'antd'
import styles from './index.less'

const Option = Select.Option
const FormItem = Form.Item
const { TextArea } = Input
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
}

const Index = ({ inventoryDetail, dispatch, loading, form }) => {
  const { getFieldDecorator, validateFields } = form
  const { users, currentItem, pending, facts } = inventoryDetail
  const codeOptions = {
    lineNumbers: true,
    readOnly: false,
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

  const content = stringifyYaml(info)
  const handleCodeChange = (params) => {
    const content = params[2]
    dispatch({
      type: 'inventoryDetail/updateState',
      payload: {
        facts: content
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        const payload = Object.assign({}, info, values)
        payload._id = currentItem._id
        dispatch({
          type: 'inventoryDetail/save',
          payload: payload,
        })
      }
    })

  }

  return (
   <Page inner>
    <Form {...formItemLayout} onSubmit={handleSubmit}>
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
          <Select mode="tags" placeholder="custom tags">
            <Option value="router">router</Option>
            <Option value="switch">switch</Option>
            <Option value="firewall">firewall</Option>
            <Option value="balancer">balancer</Option>
            <Option value="App node">App node</Option>
          </Select>
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
          <CodeMirror value={content} options={codeOptions} onChange={handleCodeChange}/>
        </div>
      </FormItem>
      <div className={styles.submit}>
        <Button type="primary" htmlType="submit" loading={Boolean(pending)}>
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
