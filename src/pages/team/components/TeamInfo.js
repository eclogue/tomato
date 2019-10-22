import React from 'react'
import { Descriptions, Tag, Tree, Icon, Popconfirm } from 'antd'
import moment from 'moment'

export default ({
  team,
  roles = [],
  permissions = [],
  roleList = [],
  ...options
}) => {
  const currentRoles = roles.map((role, index) => {
    return <Tag key={index}>{role.name}</Tag>
  })

  const handleEdit = item => {
    options.showForm(item)
  }

  const handleDelete = teamId => {
    options.onDeleteTeam(teamId)
  }

  return (
    <Descriptions title="Team Info" column={2} bordered>
      <Descriptions.Item label="Name">{team.name}</Descriptions.Item>
      <Descriptions.Item label="Master">{team.master}</Descriptions.Item>
      <Descriptions.Item label="Add by">{team.add_by}</Descriptions.Item>
      <Descriptions.Item label="Created at">
        {moment(team.created_at * 1000).format()}
      </Descriptions.Item>
      <Descriptions.Item label="Description" span={2}>
        {team.description}
      </Descriptions.Item>
      <Descriptions.Item label="Action" span={2}>
        <span
          style={{ marginRight: 20, cursor: 'pointer' }}
          onClick={_ => handleEdit(team)}
        >
          <Icon type="edit" />
          edit
        </span>
        <Popconfirm
          onConfirm={_ => handleDelete(team._id)}
          title="Dangerous~!Are you sure to delete?"
          okText="Yes"
          cancelText="No"
        >
          <Icon type="delete" style={{ color: 'red', cursor: 'pointer' }} />
          delete
        </Popconfirm>
      </Descriptions.Item>
      <Descriptions.Item label="Roles" span={2}>
        {currentRoles}
      </Descriptions.Item>
      <Descriptions.Item label="Permission" span={2}>
        <Tree treeData={permissions}></Tree>
      </Descriptions.Item>
    </Descriptions>
  )
}
