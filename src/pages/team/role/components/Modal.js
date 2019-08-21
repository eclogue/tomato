import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select, Button } from 'antd'
import { Checkbox, Row, Col } from 'antd'

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
  menus=[],
  currentItem = {},
  onSave,
  pending,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  checkedList,
  onCheck,
  ...modalProps
}) => {

  const modalOpts = {
    ...modalProps,
    width: '65%',
  }

  const handelSubmit = e => {
    e.preventDefault()
    validateFields((err, fieldsValue) => {
      if (err) {
        return false
      }

      const params = Object.assign(currentItem, fieldsValue)

      onSave(params)
    })
  }

  const isChecked = value => {
    return checkedList.includes(value)
  }

  const onCheckAll = (e)=> {
    const name = e.target.value
    const readValue = name + '[read]'
    const editValue = name + '[edit]'
    const deleteValue = name + '[delete]'
    const hasChecked = e.target.checked
    if (!hasChecked) {
      const currentChecked = checkedList.filter(item => {
        return item.indexOf(name) < 0
      })
      onCheck(currentChecked)
    } else {
      if (!checkedList.includes(name)) {
        checkedList.push(name)
      }

      if (!checkedList.includes(readValue)) {
        checkedList.push(readValue)
      }

      if (!checkedList.includes(editValue)) {
        checkedList.push(editValue)
      }

      if (!checkedList.includes(deleteValue)) {
        checkedList.push(deleteValue)
      }
      onCheck(checkedList)
    }
  }

  const onSelectAll = (e) => {
    const bucket = []
    if (!e.target.checked) {
      return onCheck([])
    }

    menus.map(item => {
      const readValue = item._id + '[read]'
      const editValue = item._id + '[edit]'
      const deleteValue = item._id + '[delete]'
      bucket.push(item._id)
      bucket.push(readValue)
      bucket.push(editValue)
      bucket.push(deleteValue)

      return item
    })
    onCheck(bucket)
  }

  const onCheckItem = e => {
    const name = e.target.value
    if (!e.target.checked) {
      const currentChecked = checkedList.filter(item => item !== name)
      onCheck(currentChecked)
    } else if (!checkedList.includes(name)) {
      checkedList.push(name)
      onCheck(checkedList)
    }

  }

  const menuRows = menus.map((item, index) => {
    const readValue = item._id + '[read]'
    const editValue = item._id + '[edit]'
    const deleteValue = item._id + '[delete]'

    return (
        <Row key={index}>
          <Col span={5}>
            <span>{item.name}</span>
          </Col>
          <Col span={4}>
            <Checkbox value={item._id}
              onChange={onCheckAll}
              checked={isChecked(item._id)}
            >All</Checkbox>
          </Col>
          <Col span={4}>
            <Checkbox value={readValue}
              checked={isChecked(readValue)}
              onChange={onCheckItem}
            >Read</Checkbox>
          </Col>
          <Col span={4}>
            <Checkbox value={editValue}
              checked={isChecked(editValue)}
              onChange={onCheckItem}
            >Edit</Checkbox>
          </Col>
          <Col span={4}>
            <Checkbox value={deleteValue}
              checked={isChecked(deleteValue)}
              onChange={onCheckItem}
            >Delete</Checkbox>
          </Col>
        </Row>
    )
  })

  return (
    <Modal {...modalOpts} onOk={handelSubmit}>
      <Form layout="horizontal" onSubmit={handelSubmit}>
        <FormItem label='name' hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: currentItem.name,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input placeholder="Role name"/>)}
        </FormItem>
        <FormItem label='type' hasFeedback {...formItemLayout}>
          {getFieldDecorator('type', {
            initialValue: currentItem.type,
            rules: [
              {
                required: true,
              },
            ],
          })(
            <Select placeholder='type' onSelect={modalProps.changeType}>
              <Option value="team">Team</Option>
              <Option value="write">developer</Option>
              <Option value="read">guest</Option>
            </Select>
          )}
        </FormItem>
        <FormItem label='description' hasFeedback {...formItemLayout}>
          {getFieldDecorator('description', {
            initialValue: currentItem.description,
            rules: [
              {
                required: false,
              },
            ],
          })(<TextArea placeholder="role description" autosize/>)}
        </FormItem>
        <FormItem label='status' hasFeedback {...formItemLayout}>
          {getFieldDecorator('status', {
            initialValue: currentItem.status || 1,
            rules: [
              {
                required: false,
              },
            ],
          })(
            <Select placeholder='status'>
              <Option value={1}>enable</Option>
              <Option value={0}>disable</Option>
            </Select>
          )}
        </FormItem>
        <FormItem label='tags' hasFeedback {...formItemLayout}>
          {getFieldDecorator('tags', {
            initialValue: currentItem.tags,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input placeholder="tags"/>)}
        </FormItem>
        <FormItem label='permissions' hasFeedback {...formItemLayout}>
        <Checkbox onChange={onSelectAll} value="all">Select All</Checkbox>
          <Checkbox.Group
            style={{ width: '100%', marginTop: 1 }}
            value={checkedList}
          >
            {menuRows}
          </Checkbox.Group>
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  currentItem: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
