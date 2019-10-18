import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select, Tag, Icon } from 'antd'

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
  menus,
  pending,
  form: { getFieldDecorator, validateFields, getFieldsValue },
  menuType,
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors, fieldsValue) => {
      if (errors) {
        return
      }

      const data = {
        ...fieldsValue,
        id: currentItem.id,
        apis: apis,
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

  const [inputVisible, setInputVisible] = useState(false)
  const [input, setInput] = useState(null)
  const [apis, setApis] = useState(currentItem.apis || [])

  const [inputApi, setInputApi] = useState('')

  const inputRef = input => setInput(input)
  const handleInputChange = e => {
    const value = e.target.value
    if (value && !inputApi.includes(value)) {
      setInputApi(value)
    }
  }
  const handleInputConfirm = () => {
    setInputVisible(false)
    if (inputApi && !apis.includes(inputApi)) {
      setApis([...apis, inputApi])
    }
  }

  const handleTagCancel = tag => {
    const tags = apis.filter(api => api !== tag)
    setApis(tags)
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal" onSubmit={handelSubmit}>
        <FormItem label="name" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: currentItem.name,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input placeholder="menu name" />)}
        </FormItem>
        <FormItem label="route" hasFeedback {...formItemLayout}>
          {getFieldDecorator('route', {
            initialValue: currentItem.route,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input placeholder="menu route" />)}
        </FormItem>
        <FormItem label="type" hasFeedback {...formItemLayout}>
          {getFieldDecorator('icon', {
            initialValue: currentItem.icon,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input placeholder="menu icon" />)}
        </FormItem>
        <FormItem label="status" hasFeedback {...formItemLayout}>
          {getFieldDecorator('status', {
            initialValue: currentItem.status,
            rules: [
              {
                required: true,
              },
            ],
          })(
            <Select placeholder="status">
              <Option value={1}>enable</Option>
              <Option value={0}>disable</Option>
            </Select>
          )}
        </FormItem>
        <FormItem label="menu pid" hasFeedback {...formItemLayout}>
          {getFieldDecorator('mpid', {
            initialValue: currentItem.mpid,
            rules: [
              {
                required: false,
              },
            ],
          })(
            <Select placeholder="menu parent ID">
              {menus.map((menu, index) => {
                return (
                  <Option value={menu.id} key={index}>
                    {menu.name}
                  </Option>
                )
              })}
              <Option value="-1">admin only</Option>
              <Option value="0">root</Option>
            </Select>
          )}
        </FormItem>
        <FormItem label="breadcrum pid" hasFeedback {...formItemLayout}>
          {getFieldDecorator('bpid', {
            initialValue: currentItem.bpid,
            rules: [
              {
                required: false,
              },
            ],
          })(
            <Select placeholder="breadcrum parent ID">
              {menus.map((menu, index) => {
                return (
                  <Option value={menu.id} key={index}>
                    {menu.name}
                  </Option>
                )
              })}
              <Option value="-1">admin only</Option>
              <Option value="0">root</Option>
            </Select>
          )}
        </FormItem>
        <FormItem label="bind apis" hasFeedback {...formItemLayout}>
          {apis.map((item, index) => {
            return (
              <Tag
                closable
                onClose={e => {
                  e.preventDefault()
                  handleTagCancel(item)
                }}
                key={index}
              >
                {item}
              </Tag>
            )
          })}
          {!inputVisible ? (
            <div
              onClick={_ => setInputVisible(true)}
              style={{ display: 'inlne-block', cursor: 'pointer' }}
            >
              <Icon type="plus" /> Add api
            </div>
          ) : (
            <Input
              ref={inputRef}
              onChange={handleInputChange}
              onBlur={handleInputConfirm}
              onPressEnter={handleInputConfirm}
            />
          )}
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
