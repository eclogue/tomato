import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, AutoComplete, Select } from 'antd'

const FormItem = Form.Item
const Option = Select.Option
const { TextArea } = Input

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const modal = ({
  item = {},
  onOk,
  regions,
  pending,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  credentialType,
  ...modalProps
}) => {
  const credentialBody = () => {
    const body = []
    if (credentialType === 'private_key') {
      body.push(<FormItem label='private key' hasFeedback {...formItemLayout} key="private_key">
        {getFieldDecorator('body[private_key]', {
          initialValue: item.private_key,
          rules: [
            {
              required: true,
            },
          ],
        })(<TextArea rows={4}  placeholder="ssh private key"/>)}
      </FormItem>)
      body.push(<FormItem label='ssh user' hasFeedback {...formItemLayout} key="ssh_user">
        {getFieldDecorator('body[ssh_user]', {
          initialValue: item.ssh_user,
          rules: [
            {
              required: true,
            },
          ],
        })(<Input  placeholder="ssh user"/>)}
      </FormItem>)
      body.push(<FormItem label='ssh port' hasFeedback {...formItemLayout} key="ssh_port">
        {getFieldDecorator('body[ssh_port]', {
          initialValue: item.ssh_port,
          rules: [
            {
              required: true,
            },
          ],
        })(<Input  placeholder="ssh_port"/>)}
      </FormItem>)
    } else if (credentialType === 'vault_pass') {
      body.push(<FormItem label='vault pass' hasFeedback {...formItemLayout} key="vault_pass">
        {getFieldDecorator('body[vault_pass]', {
          initialValue: item.vault_pass,
          rules: [
            {
              required: true,
            },
          ],
        })(<TextArea rows={4}  placeholder="vault pass"/>)}
      </FormItem>)
    } else {
      body.push(<FormItem label='token' hasFeedback {...formItemLayout} key="token">
        {getFieldDecorator('body[token]', {
          initialValue: item.token,
          rules: [
            {
              required: true,
            },
          ],
        })(<Input  placeholder="token"/>)}
      </FormItem>)
    }

    return body
  }
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        id: item.id,
      }
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    width: '60%',
    onOk: handleOk,
  }

  const handelSubmit = e => {
    e.preventDefault()
    validateFields((err, fieldsValue) => {
      console.log(err, fieldsValue)
    })
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal" onSubmit={handelSubmit}>
        <FormItem label='name' hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input placeholder="credential name"/>)}
        </FormItem>
        <FormItem label='description' hasFeedback {...formItemLayout}>
          {getFieldDecorator('description', {
            initialValue: item.description,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input placeholder="credential description"/>)}
        </FormItem>
        <FormItem label='type' hasFeedback {...formItemLayout}>
          {getFieldDecorator('type', {
            initialValue: item.type,
            rules: [
              {
                required: true,
              },
            ],
          })(
            <Select placeholder='type' onSelect={modalProps.changeType}>
              <Option value="private_key">private key</Option>
              <Option value="vault_pass">vault pass</Option>
              <Option value="token">token</Option>
            </Select>
          )}
        </FormItem>
        {credentialBody()}
        <FormItem label='status' hasFeedback {...formItemLayout}>
          {getFieldDecorator('status', {
            initialValue: item.status || 1,
            rules: [
              {
                required: true,
              },
            ],
          })(
            <Select placeholder='status'>
              <Option value={1}>enable</Option>
              <Option value={0}>disable</Option>
            </Select>
          )}
        </FormItem>
        <FormItem label='scope' hasFeedback {...formItemLayout}>
          {getFieldDecorator('scope', {
            initialValue: item.scope,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input placeholder="scope"/>)}
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
