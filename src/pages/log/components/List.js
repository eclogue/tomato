import React from 'react'
import { List, Avatar, Icon, Tag } from 'antd'
import { color } from 'utils'
import moment from 'moment'

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
)

const colors = {
  debug: color.gray,
  info: color.green,
  warning: color.yellow,
  error: color.red,
  critical: 'red',
}

const getColor = level => colors[level.toLowerCase()]

const Logs = ({ dataSource = [], pagination = {} }) => {
  return (
    <div>
      <List
        itemLayout="vertical"
        size="large"
        pagination={pagination}
        dataSource={dataSource}
        renderItem={item => (
          <List.Item
            key={item._id}
            actions={[
              <IconText
                type="user"
                text={item.currentUser}
                key="currentUser"
              />,
              <IconText
                type="clock-circle"
                text={moment(item.timestamp).format()}
                key="timestamp"
              />,
              <IconText type="build" text={item.module} key="module" />,
            ]}
            extra={<span>view</span>}
          >
            <List.Item.Meta
              avatar={
                <Avatar style={{ backgroundColor: getColor(item.level) }}>
                  {item.level[0]}
                </Avatar>
              }
              title={<a href={item.href}>{item.title}</a>}
              description={
                <span>
                  <Tag>{item.hostname}</Tag>
                  <Tag>{item.loggerName}</Tag>
                  <Tag>{item.level}</Tag>
                </span>
              }
            />
            <span style={{ color: getColor(item.level) }}>{item.message}</span>
          </List.Item>
        )}
      />
    </div>
  )
}

export default Logs
