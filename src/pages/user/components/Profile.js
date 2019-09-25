import React, { Fragment } from 'react'
import {
  Descriptions,
  Avatar,
  Icon,
  Divider,
  Form,
  Upload,
  Input,
  Select,
  Button,
  Tag,
} from 'antd'
import styles from './profile.less'

const Option = Select.Option

const Profile = ({ currentItem, form, onSave, pending }) => {
  const { getFieldDecorator } = form
  const team = currentItem.team || {}
  const teams = currentItem.team ? [team] : []
  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        if (currentItem && currentItem._id) {
          values._id = currentItem._id
        }

        onSave(values)
      }
    })
  }

  return (
    <div className={styles.profile}>
      <div className={styles.left}>
        <Descriptions title="User Info" column={1} layout="horizontal">
          <Descriptions.Item
            label={
              <div className={styles.labelField}>
                <Icon type="user" />
                <span className={styles.title}>Username</span>
              </div>
            }
          >
            <span className={styles.filedValue}>{currentItem.username}</span>
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <div className={styles.labelField}>
                <Icon type="user" />
                <span className={styles.title}>Nickname</span>
              </div>
            }
          >
            <span className={styles.filedValue}>{currentItem.nickname}</span>
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <div className={styles.labelField}>
                <Icon type="phone" />
                <span className={styles.title}>Phone</span>
              </div>
            }
          >
            <span className={styles.filedValue}>
              {currentItem.phone}
              <span className={styles.state}>
                {currentItem.phone_status ? (
                  <Tag color="green">已验证</Tag>
                ) : (
                  <Tag color="yellow">未验证</Tag>
                )}
              </span>
            </span>
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <div className={styles.labelField}>
                <Icon type="mail" />
                <span className={styles.title}>Email</span>
              </div>
            }
          >
            <span className={styles.filedValue}>
              <span>{currentItem.email}</span>
              <span className={styles.state}>
                {currentItem.email_status ? (
                  <Tag color="green">已验证</Tag>
                ) : (
                  <Tag color="gray">点击验证</Tag>
                )}
              </span>
            </span>
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <div className={styles.labelField}>
                <Icon type="wechat" />
                <span className={styles.title}>Wechat</span>
              </div>
            }
          >
            <span className={styles.filedValue}>{currentItem.wechat}</span>
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <div className={styles.labelField}>
                <Icon type="flag" />
                <span className={styles.title}>Address</span>
              </div>
            }
          >
            <span className={styles.filedValue}>{currentItem.address}</span>
          </Descriptions.Item>
        </Descriptions>
        <Divider />
        <Form layout="vertical" onSubmit={handleSubmit}>
          <Form.Item label="Nickname">
            {getFieldDecorator('nickname', {
              initialValue: currentItem.nickname,
              rules: [{ required: true, message: 'Please enter email' }],
            })(
              <Input style={{ width: '100%' }} placeholder="Please enter url" />
            )}
          </Form.Item>
          <Form.Item label="Email">
            {getFieldDecorator('email', {
              initialValue: currentItem.email,
              rules: [{ required: true, message: 'Please enter email' }],
            })(<Input placeholder="Please enter email" />)}
          </Form.Item>
          <Form.Item label="Phone">
            {getFieldDecorator('phone', {
              initialValue: currentItem.phone,
              rules: [{ required: false, message: 'Please enter phone' }],
            })(
              <Input
                style={{ width: '100%' }}
                placeholder="Please enter phone"
              />
            )}
          </Form.Item>
          <Form.Item label="Team">
            {getFieldDecorator('team_id', {
              rules: [{ required: true, message: 'Please select team' }],
              initialValue: team._id,
            })(
              <Select placeholder="Please select a team" showSearch disabled>
                {teams.map(team => {
                  return (
                    <Option value={team._id} key={team._id}>
                      {team.name}
                    </Option>
                  )
                })}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Wechat">
            {getFieldDecorator('wechat', {
              initialValue: currentItem.wechat,
              rules: [{ required: false, message: 'Please choose the type' }],
            })(
              <Select placeholder="Please choose the type">
                <Option value="private">Private</Option>
                <Option value="public">Public</Option>
              </Select>
            )}
          </Form.Item>
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
          <div>
            <Button type="primary" htmlType="submit" loading={pending}>
              save
            </Button>
          </div>
        </Form>
      </div>
      <div className={styles.right}>
        <Fragment>
          <div className={styles.avatar_title}>Avatar</div>
          <div className={styles.avatar}>
            {currentItem.avatar ? (
              <Avatar src={currentItem.avatar} />
            ) : (
              <Avatar size={128} style={{ backgroundColor: '#87d068' }}>
                {currentItem.username}
              </Avatar>
            )}
          </div>
          <Upload fileList={[]}>
            <div className={styles.button_view}>
              <Button icon="upload" disabled>
                Change avatar
              </Button>
            </div>
          </Upload>
        </Fragment>
      </div>
    </div>
  )
}

export default Form.create()(Profile)
