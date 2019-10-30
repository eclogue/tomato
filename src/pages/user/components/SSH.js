import React, { useState } from 'react'
import { List, Avatar, Form, Button, Modal, Input } from 'antd'

const { TextArea } = Input

const Index = ({ currentItem, ...props }) => {
  const { list = [], pagination } = currentItem
  const { visible, setVisible } = props
  const header = (
    <div style={{ textAlign: 'right' }}>
      <Button type="dashed" onClick={() => setVisible(true)}>
        add
      </Button>
    </div>
  )

  const [currentRecord, setCurrentRecord] = useState({})

  const addForm = ({ form, item = {} }) => {
    const getFieldDecorator = form.getFieldDecorator
    const handleSubmit = e => {
      e.preventDefault()
      form.validateFields((err, values) => {
        if (!err) {
          if (item && item._id) {
            values._id = item._id
          }
          props.onSave(values)
        }
      })
    }

    return (
      <Modal
        title="Add public key"
        visible={visible}
        onOk={handleSubmit}
        onCancel={() => setVisible(false)}
      >
        <Form.Item label="name">
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [{ required: true }],
          })(<Input placeholder="name" />)}
        </Form.Item>
        <Form.Item label="public key">
          {getFieldDecorator('public_key', {
            rules: [{ required: true }],
          })(
            <TextArea
              placeholder="Paste your public key here"
              autosize={{ minRows: 4, maxRows: 10 }}
            />
          )}
        </Form.Item>
      </Modal>
    )
  }
  const ModalComponent = Form.create({ name: 'sshkey' })(addForm)
  const editItem = item => {
    setVisible(true)
    setCurrentRecord(item)
  }

  return (
    <div>
      <List
        header={header}
        itemLayout="horizontal"
        pagination={{
          ...pagination,
          onChange: page => {
            console.log(page)
          },
        }}
        dataSource={list}
        renderItem={item => (
          <List.Item
            key={item.title}
            actions={[
              <Button type="dashed" icon="edit" onClick={_ => editItem(item)}>
                edit
              </Button>,
              <Button type="danger" icon="delete">
                delete
              </Button>,
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar icon="key" theme="twoTone" />}
              title={item.title}
              description={item.fingerprint}
            />
            <div>{item.content}</div>
          </List.Item>
        )}
      />
      <ModalComponent item={currentRecord} />
    </div>
  )
}

export default Index
