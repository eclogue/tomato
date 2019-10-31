import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Select, Tree, Radio } from 'antd'
import { Checkbox, Row, Col } from 'antd'
import { arrayToTree } from 'utils'

const FormItem = Form.Item
const Option = Select.Option
const { TextArea } = Input
const { TreeNode } = Tree

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({
  menus = [],
  currentItem = {},
  onSave,
  pending,
  form: { getFieldDecorator, validateFields },
  checkedList,
  onCheck,
  ...modalProps
}) => {
  const modalOpts = {
    ...modalProps,
    width: '80%',
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

  const onCheckAll = e => {
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

  const onSelectAll = checkedList => {
    const bucket = []
    if (!checkedList.length) {
      return onCheck([])
    }

    for (const item of menus) {
      const readValue = item._id + '[read]'
      const editValue = item._id + '[edit]'
      const deleteValue = item._id + '[delete]'
      if (checkedList.includes('all')) {
        bucket.push(item._id)
        bucket.push(readValue)
        bucket.push(editValue)
        bucket.push(deleteValue)
        continue
      }
      if (checkedList.includes('read')) {
        bucket.push(readValue)
      }

      if (checkedList.includes('edit')) {
        bucket.push(editValue)
      }

      if (checkedList.includes('delete')) {
        bucket.push(deleteValue)
      }
    }
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

  const getParentKey = (current, bucket) => {
    for (let i = 0; i < menus.length; i++) {
      const node = menus[i]
      if (node.id === current.bpid) {
        bucket.unshift(node.name)
        if (parseInt(node.bpid) > 0) {
          getParentKey(node, bucket)
        }
      }
    }

    return bucket
  }

  const menuRows = menus.map((item, index) => {
    const readValue = item._id + '[read]'
    const editValue = item._id + '[edit]'
    const deleteValue = item._id + '[delete]'
    const moduleName = getParentKey(item, [])
    moduleName.push(item.name)
    return (
      <Row key={index}>
        <Col span={8}>
          <span>{moduleName.join('/')}</span>
        </Col>
        <Col span={4}>
          <Checkbox
            value={item._id}
            onChange={onCheckAll}
            checked={isChecked(item._id)}
          >
            All
          </Checkbox>
        </Col>
        <Col span={4}>
          <Checkbox
            value={readValue}
            checked={isChecked(readValue)}
            onChange={onCheckItem}
          >
            Read
          </Checkbox>
        </Col>
        <Col span={4}>
          <Checkbox
            value={editValue}
            checked={isChecked(editValue)}
            onChange={onCheckItem}
          >
            Edit
          </Checkbox>
        </Col>
        <Col span={4}>
          <Checkbox
            value={deleteValue}
            checked={isChecked(deleteValue)}
            onChange={onCheckItem}
          >
            Delete
          </Checkbox>
        </Col>
      </Row>
    )
  })

  // const renderTreeNodes = data =>
  //   data.map(item => {
  //     if (item.children) {
  //       return (
  //         <TreeNode title={item.name} key={item._id} dataRef={item}>
  //           {renderTreeNodes(item.children)}
  //         </TreeNode>
  //       )
  //     }

  //     return <TreeNode title={item.name} key={item._id} dataRef={item} />
  //   })

  return (
    <Modal {...modalOpts} onOk={handelSubmit}>
      <Form layout="horizontal" onSubmit={handelSubmit}>
        <FormItem label="name" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: currentItem.name,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input placeholder="Role name" />)}
        </FormItem>
        <FormItem label="type" hasFeedback {...formItemLayout}>
          {getFieldDecorator('type', {
            initialValue: currentItem.type,
            rules: [
              {
                required: true,
              },
            ],
          })(
            <Select placeholder="type" onSelect={modalProps.changeType}>
              <Option value="team">Team</Option>
              <Option value="write">developer</Option>
              <Option value="read">guest</Option>
            </Select>
          )}
        </FormItem>
        <FormItem label="description" hasFeedback {...formItemLayout}>
          {getFieldDecorator('description', {
            initialValue: currentItem.description,
            rules: [
              {
                required: false,
              },
            ],
          })(<TextArea placeholder="role description" autosize />)}
        </FormItem>
        <FormItem label="status" hasFeedback {...formItemLayout}>
          {getFieldDecorator('status', {
            initialValue: currentItem.status || 1,
            rules: [
              {
                required: false,
              },
            ],
          })(
            <Select placeholder="status">
              <Option value={1}>enable</Option>
              <Option value={0}>disable</Option>
            </Select>
          )}
        </FormItem>
        <FormItem label="tags" hasFeedback {...formItemLayout}>
          {getFieldDecorator('tags', {
            initialValue: currentItem.tags,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input placeholder="tags" />)}
        </FormItem>
        <FormItem label="permissions" hasFeedback {...formItemLayout}>
          <Checkbox.Group onChange={onSelectAll}>
            <Checkbox value="all">All</Checkbox>
            <Checkbox value="read">Read</Checkbox>
            <Checkbox value="edit">Edit</Checkbox>
            <Checkbox value="delete">Delete</Checkbox>
          </Checkbox.Group>
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
