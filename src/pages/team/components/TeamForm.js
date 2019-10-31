import React from 'react'
import { Drawer, Form, Button, Col, Row, Input, Select } from 'antd'

const { Option } = Select

const Index = ({
  visible,
  onClose,
  form,
  teams,
  roles = [],
  currentItem = {},
  ...options
}) => {
  const currentRoleIds = roles.map(role => {
    return role._id
  })
  const UserForm = ({ form }) => {
    const { getFieldDecorator } = form
    const teamInfo = currentItem.team || {}
    const handleSubmit = e => {
      e.preventDefault()
      form.validateFields((err, values) => {
        if (!err) {
          if (currentItem._id) {
            values._id = currentItem._id
            return options.onEditUser(values)
          }

          options.onAddUser(values)
        }
      })
    }

    return (
      <Form layout="vertical" onSubmit={handleSubmit}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Username">
              {getFieldDecorator('username', {
                initialValue: currentItem.username,
                rules: [{ required: true, message: 'Please enter user name' }],
              })(<Input placeholder="Please enter user name" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Nickname">
              {getFieldDecorator('nickname', {
                initialValue: currentItem.nickname,
                rules: [{ required: true, message: 'Please enter email' }],
              })(
                <Input
                  style={{ width: '100%' }}
                  placeholder="Please enter url"
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Email">
              {getFieldDecorator('email', {
                initialValue: currentItem.email,
                rules: [{ required: true, message: 'Please enter email' }],
              })(<Input placeholder="Please enter email" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Phone">
              {getFieldDecorator('phone', {
                initialValue: currentItem.phone,
                rules: [{ required: false, message: 'Please enter phone' }],
              })(
                <Input
                  style={{ width: '100%' }}
                  placeholder="Please enter url"
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Team">
              {getFieldDecorator('team_id', {
                initialValue: teamInfo._id,
                rules: [{ required: true, message: 'Please select team' }],
              })(
                <Select placeholder="Please select a team">
                  {teams.map(team => {
                    return (
                      <Option value={team.key} key={team.key}>
                        {team.title}
                      </Option>
                    )
                  })}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Role">
              {getFieldDecorator('role', {
                initialValue: currentRoleIds,
                rules: [{ required: false, message: 'Please choose role' }],
              })(
                <Select placeholder="team role" allowClear mode="multiple">
                  {options.roleList.map(item => {
                    return (
                      <Option value={item._id} key={item._id}>
                        {item.name}
                      </Option>
                    )
                  })}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Address">
              {getFieldDecorator('address', {
                initialValue: currentItem.address,
                rules: [
                  {
                    required: false,
                    message: 'please enter address',
                  },
                ],
              })(
                <Input.TextArea rows={4} placeholder="please enter address" />
              )}
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
    )
  }

  const TeamForm = ({ form }) => {
    const { getFieldDecorator } = form
    const handleSubmit = e => {
      e.preventDefault()
      form.validateFields((err, values) => {
        if (!err) {
          if (currentItem._id) {
            values._id = currentItem._id
            return options.onEditTeam(values)
          }

          options.onAddTeam(values)
        }
      })
    }

    return (
      <Form layout="vertical" onSubmit={handleSubmit}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="team name">
              {getFieldDecorator('name', {
                initialValue: currentItem.name,
                rules: [{ required: true, message: 'Please enter team name' }],
              })(<Input placeholder="team name" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="role">
              {getFieldDecorator('role', {
                initialValue: currentRoleIds,
                rules: [{ required: false }],
              })(
                <Select placeholder="team role" allowClear mode="multiple">
                  {options.roleList.map(item => {
                    return (
                      <Option value={item._id} key={item._id}>
                        {item.name}
                      </Option>
                    )
                  })}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="members">
              {getFieldDecorator('members', {
                initialValue: currentItem.members,
                rules: [{ required: false }],
              })(
                <Select placeholder="team members" allowClear mode="multiple">
                  {options.users.map((item, i) => {
                    return (
                      <Option value={item.key} key={i}>
                        {item.title}
                      </Option>
                    )
                  })}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="master">
              {getFieldDecorator('master', {
                initialValue: currentItem.master,
                rules: [{ required: false }],
              })(
                <Select placeholder="team master" allowClear mode="multiple">
                  {options.users.map(item => {
                    return (
                      <Option value={item.key} key={item.key}>
                        {item.title}
                      </Option>
                    )
                  })}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="description">
              {getFieldDecorator('description', {
                initialValue: currentItem.description,
                rules: [
                  {
                    required: false,
                    message: 'please enter description',
                  },
                ],
              })(
                <Input.TextArea
                  rows={4}
                  placeholder="please enter description"
                />
              )}
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
    )
  }

  const AddUser = Form.create({ name: 'user' })(UserForm)
  const AddTeam = Form.create({ name: 'team' })(TeamForm)
  return (
    <div>
      <Drawer
        title="Add new user"
        width={720}
        onClose={onClose}
        visible={visible}
      >
        {options.actionType === 'user' ? <AddUser /> : <AddTeam />}
      </Drawer>
    </div>
  )
}

export default Index
