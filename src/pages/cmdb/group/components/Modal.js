import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, AutoComplete, Select } from 'antd'
import { getRegions } from '../service';

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
  regions,
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
        id: item.id,
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
        <FormItem label='group name' hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
              {
                required: true,
              },
            ],
          })(<AutoComplete onChange={modalOpts.onChange} dataSource={pending}/>)}
        </FormItem>
        <FormItem label='data center' hasFeedback {...formItemLayout}>
          {getFieldDecorator('region', {
            initialValue: item.region,
            rules: [
              {
                required: true,
              },
            ],
          })(
            <Select placeholder='select region'>
              {regions.map(item => {
                return <Select.Option value={item._id} key={item._id}>{item.name}</Select.Option>
              })}
            </Select>
          )}
        </FormItem>
        <FormItem label='description' hasFeedback {...formItemLayout}>
          {getFieldDecorator('description', {
            initialValue: item.description,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input />)}
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
