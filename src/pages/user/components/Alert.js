import React from 'react'
import { Form, Checkbox, List, Button, Radio, Avatar } from 'antd'
import { Page } from 'components'
import PropTypes from 'prop-types'

const Alert = ({ currentItem, onChange }) => {
  const setting = currentItem.setting || {}
  console.log(currentItem)
  const plainOptions = [
    {
      label: 'Slack',
      value: 'slack',
      disabled: true,
    },
    {
      label: 'Email',
      value: 'email',
      disabled: !setting.smtp,
    },
    {
      label: 'SMS',
      value: 'sms',
      disabled: !setting.sms,
    },
    {
      label: 'Wechat',
      value: 'wechat',
      disabled: !setting.wechat,
    },
    {
      label: 'Web',
      value: 'web',
    },
  ]

  const list = [
    {
      name: 'task',
      title: 'Task error',
      description: 'Ansible tasks error notifications',
      avatar: 'control',
      color: 'red',
    },
    {
      name: 'api',
      title: 'Api server error',
      description: 'Eclogue system runtime error',
      avatar: 'api',
      color: '#f56a00',
    },
  ]

  const getChecked = item => {
    const alerts = currentItem.alerts || {}
    console.log('cccheckeddeddadfasdfa', alerts, item.name)
    const checked = alerts[item.name] || []

    if (checked.indexOf('slack') < 0 && setting.slack) {
      checked.push('slack')
    }

    return checked
  }

  return (
    <div>
      <List
        header="Message notification setting"
        itemLayout="horizontal"
        dataSource={list}
        renderItem={item => (
          <List.Item
            key={item.title}
            actions={[
              <Checkbox.Group
                options={plainOptions}
                onChange={value => onChange(item.name, value)}
                defaultValue={getChecked(item)}
              />,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  icon={item.avatar}
                  style={{ backgroundColor: item.color }}
                />
              }
              title={item.title}
              description={item.description}
            />
          </List.Item>
        )}
      />
    </div>
  )
}

export default Alert
