import React from 'react'
import { Descriptions, Avatar, Icon, Divider, Form, Row, Col, Input, Select, Button } from 'antd'
import styles from './profile.less'

const Option = Select.Option

const index = ({ currentItem, form }) => {

  const teams = []
  const { getFieldDecorator } = form

  return (
    <div>
      <Descriptions title="User Info"  column={1} layout="horizontal">
        <Descriptions.Item label={<div className={styles.labelField}><Icon type="user" /><span className={styles.title}>Username</span></div>}>
          <Avatar>U</Avatar><span className={styles.filedValue}>{currentItem.username}</span>
        </Descriptions.Item>
        <Descriptions.Item label={<div className={styles.labelField}><Icon type="user" /><span className={styles.title}>Nickname</span></div>}>
          <span className={styles.filedValue}>{currentItem.nickname}</span>
        </Descriptions.Item>
        <Descriptions.Item label={<div className={styles.labelField}><Icon type="phone" /><span className={styles.title}>Phone</span></div>}>
          <span className={styles.filedValue}>{currentItem.phone}<span className={styles.state}>已验证</span></span>
        </Descriptions.Item>
        <Descriptions.Item label={<div className={styles.labelField}><Icon type="mail" /><span className={styles.title}>Email</span></div>}>
          <span className={styles.filedValue}>{currentItem.email}<span className={styles.state}>已验证</span></span>
        </Descriptions.Item>
        <Descriptions.Item label={<div className={styles.labelField}><Icon type="wechat" /><span className={styles.title}>Wechat</span></div>}>
          <span className={styles.filedValue}>{currentItem.wechat}</span>
        </Descriptions.Item>
        <Descriptions.Item label={<div className={styles.labelField}><Icon type="flag" /><span className={styles.title}>Address</span></div>}>
          <span className={styles.filedValue}>{currentItem.address}</span>
        </Descriptions.Item>
        <Descriptions.Item label={<div className={styles.labelField}><Icon type="security-scan" /><span className={styles.title}>Passwrod</span></div>}>
          <span className={styles.filedValue}>forget|reset</span>
        </Descriptions.Item>
      </Descriptions>
      <Divider />
      <Form layout="vertical" onSubmit={console.log}>
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
                />,
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
                  placeholder="Please enter phone"
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
            <Form.Item label="Wechat">
              {getFieldDecorator('wechat', {
                initialValue: currentItem.wechat,
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
                initialValue: currentItem.address,
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
        >
          <Button type="primary" htmlType="submit">
            save
          </Button>
        </div>
      </Form>
    </div>

  )
}

export default Form.create()(index)
