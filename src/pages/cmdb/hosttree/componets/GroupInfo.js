import React from 'react'
import { Descriptions } from 'antd'


export default ({ groupInfo }) => {
  const region = groupInfo.region || {}
  return (
    <Descriptions title="group detail" column={2}>
      <Descriptions.Item label="Name" span={2}>{groupInfo.name}</Descriptions.Item>
      <Descriptions.Item label="Region" span={2}>{region.name}</Descriptions.Item>
      <Descriptions.Item label="Add by" span={2}>{groupInfo.name}</Descriptions.Item>
      <Descriptions.Item label="Created at" span={2}>{groupInfo.created_at}</Descriptions.Item>
      <Descriptions.Item label="Description" span={2}>{groupInfo.description}</Descriptions.Item>
    </Descriptions>
  )
}
