import React from 'react'
import { Drawer, Form, Button, Col, Row, Input, Select } from 'antd'

const { Option } = Select

const Index = ({ visible, onClose, form, teams, ...options}) => {
  const { getFieldDecorator } = form

  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        options.onSubmit(values)
      }
    })

  }

  return (
    <div>
      <Drawer
        title="Add new user"
        width={720}
        onClose={onClose}
        visible={visible}
      >
        <Form layout="vertical" onSubmit={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Username">
                {getFieldDecorator('username', {
                  rules: [{ required: true, message: 'Please enter user name' }],
                })(<Input placeholder="Please enter user name" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Nickname">
                {getFieldDecorator('nickname', {
                  rules: [{ required: true, message: 'Please enter email' }],
                })(
                  <Input
                    style={{ width: '100%' }}
                    placeholder="Please enter url"
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Email">
                {getFieldDecorator('email', {
                  rules: [{ required: true, message: 'Please enter email' }],
                })(<Input placeholder="Please enter email" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Phone">
                {getFieldDecorator('phone', {
                  rules: [{ required: false, message: 'Please enter phone' }],
                })(
                  <Input
                    style={{ width: '100%' }}
                    placeholder="Please enter url"
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Team">
                {getFieldDecorator('team_id', {
                  rules: [{ required: true, message: 'Please select team' }],
                })(
                  <Select placeholder="Please select a team">
                  {teams.map( team => {
                      return <Option value={team.key} key={team.key}>{team.title}</Option>
                    })
                  }
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Role">
                {getFieldDecorator('role', {
                  rules: [{ required: false, message: 'Please choose the type' }],
                })(
                  <Select placeholder="Please choose the type">
                    <Option value="private">Private</Option>
                    <Option value="public">Public</Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>
            <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Address">
                {getFieldDecorator('address', {
                  rules: [
                    {
                      required: false,
                      message: 'please enter address',
                    },
                  ],
                })(<Input.TextArea rows={4} placeholder="please enter address" />)}
              </Form.Item>
            </Col>
          </Row>
          <div
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
            }}
          >
            <Button onClick={onClose} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </div>
        </Form>
      </Drawer>
    </div>
  )
}

const App = Form.create()(Index)

export default App
