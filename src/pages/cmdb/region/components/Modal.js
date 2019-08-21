import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, AutoComplete } from 'antd'

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 12,
  },
};

const modal = ({
  item = {},
  onOk,
  pending,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        id: item._id,
      };
      onOk(data);
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  };


  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label='name' hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
              {
                required: true,
              }
            ],
          })(<AutoComplete onChange={modalOpts.onChange} dataSource={pending} placeholder="unique name"/>)}
        </FormItem>
        <FormItem label='platform' hasFeedback {...formItemLayout}>
          {getFieldDecorator('platform', {
            initialValue: item.platform,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input placeholder="platform"/>)}
        </FormItem>
        <FormItem label='ip range' hasFeedback {...formItemLayout}>
          {getFieldDecorator('ip_range', {
            initialValue: item.ip_range,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input placeholder="ip range"/>)}
        </FormItem>
        <FormItem label='bandwidth' hasFeedback {...formItemLayout}>
          {getFieldDecorator('bandwidth', {
            initialValue: item.bandwidth,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input placeholder="bandwidth"/>)}
        </FormItem>
        <FormItem label='contact' hasFeedback {...formItemLayout}>
          {getFieldDecorator('contact', {
            initialValue: item.contact,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input placeholder="emergency contact"/>)}
        </FormItem>
        <FormItem label='description' hasFeedback {...formItemLayout}>
          {getFieldDecorator('description', {
            initialValue: item.description,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input.TextArea rows={4} placeholder="description"/>)}
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
