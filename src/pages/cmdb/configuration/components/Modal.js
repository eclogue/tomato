import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select, Icon, Tooltip } from 'antd'
import { CodeMirror } from 'components'
import Yaml from 'yaml'
import styles from './modal.css'

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({
  currentItem = {},
  onOk,
  onVariablesChange,
  pending,
  users,
  form: { getFieldDecorator, validateFields, getFieldsValue },
  ...modalProps
}) => {
  const variables = currentItem.variables || ''
  const handleOk = () => {
    validateFields(errors => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        _id: currentItem._id,
      }
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    width: '60%',
    onOk: handleOk,
  }

  const onSearch = keyword => {
    if (!keyword || keyword.length < 2) {
      return false
    }

    modalProps.searchUser(keyword)
  }

  const codeOptions = {
    lineNumbers: true,
    readOnly: false,
    CodeMirror: 'auto',
    viewportMargin: 50,
  }

  let yamlVars = '---\n'
  if (variables && typeof variables === 'object') {
    yamlVars += Yaml.stringify(variables)
  } else if (typeof variableDeclaration === 'string') {
    yamlVars += variables
  }

  yamlVars += '\n'

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="name" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: currentItem.name,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input placeholder="unique name" />)}
        </FormItem>
        <FormItem label="description" hasFeedback {...formItemLayout}>
          {getFieldDecorator('description', {
            initialValue: currentItem.description,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input placeholder="description" />)}
        </FormItem>
        <FormItem label="maintainer" hasFeedback {...formItemLayout}>
          {getFieldDecorator('maintainer', {
            initialValue: currentItem.maintainer,
            rules: [
              {
                required: false,
              },
            ],
          })(
            <Select
              onSearch={onSearch}
              showArrow={false}
              filterOption={false}
              showSearch
              mode="multiple"
              placeholder="search username"
            >
              {users.map((user, i) => (
                <Option value={user.username} key={i}>
                  {user.username}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="status" hasFeedback {...formItemLayout}>
          {getFieldDecorator('status', {
            initialValue: currentItem.status || 1,
            rules: [
              {
                required: true,
              },
            ],
          })(
            <Select placeholder="status">
              <Option value={1} key={1}>
                enable
              </Option>
              <Option value={0} key={2}>
                disable
              </Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          label={
            <span>
              registry&nbsp;
              <Tooltip title="register variables to config center, use yaml syntax">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
          style={{ lineHeight: '20px' }}
          hasFeedback
          {...formItemLayout}
        >
          <div style={{ lineHeight: '20px' }}>
            <CodeMirror
              value={yamlVars}
              onChange={onVariablesChange}
              options={codeOptions}
            />
          </div>
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
