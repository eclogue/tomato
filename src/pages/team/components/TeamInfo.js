import React from 'react'
import { Descriptions, Tag,Tree, } from 'antd'


export default ({ team, roles=[], permissions=[], roleList=[] }) => {
  const currentRoles = roles.map((role, index) => {
    return <Tag key={index}>{role.name}</Tag>
  })

  return (
    <Descriptions title="Team Info" column={2} bordered>
      <Descriptions.Item label="Name">{team.name}</Descriptions.Item>
      <Descriptions.Item label="Master">{team.master}</Descriptions.Item>
      <Descriptions.Item label="Add by">{team.name}</Descriptions.Item>
      <Descriptions.Item label="Created at">{team.created_at}</Descriptions.Item>
      <Descriptions.Item label="Description" span={2}>{team.description}</Descriptions.Item>
      <Descriptions.Item label="Roles" span={2}>
        {currentRoles}
      </Descriptions.Item>
      <Descriptions.Item label="Permission" span={2}>
        <Tree
          treeData={permissions}
        >
        </Tree>
      </Descriptions.Item>
    </Descriptions>
  )
}
