import React, { useState } from 'react'
import { Descriptions, Tag, Icon, Tree, Select, Form, Button, Cascader } from 'antd'
import styles from './user.less'
import { storage } from 'utils'


const Option = Select.Option
const style = {
  background: '#fff',
  borderStyle: 'dashed',
  cursor: 'pointer',
  marginLeft: 10,
}

export default ({ user, roles=[], permissions=[], roleList=[], groupList=[], ...options }) => {
  const [pending, setPending] = useState(false)
  const [editType, setEditType] = useState(null)
  const userInfo = storage.get('user')
  const handleChange = (type) => {
    setEditType(type)
    options.onEdit(type)
  }

  const handleSearch = keyword => {
    if (pending) {
      clearTimeout(pending)
      setPending(false)
    }

    const timeId = setTimeout(() => {
      clearTimeout(pending)
      options.searchRoles(keyword)
    }, 500)
    setPending(timeId)
  }

  const currentRoleIds = roles.map(role => {
    return role._id
  })

  const currentRoles = roles.map((role, index) => {
    return <Tag key={index}>{role.name}</Tag>
  })
  currentRoles.push(
    <Tag onClick={() => handleChange('roles')} style={style} key={'roles'}>
      <Icon type="plus" />add
    </Tag>
  )

  const team = user.team || {}
  const editForm = ({form}) => {
    const handleSubmit = e => {
      e.preventDefault();
      form.validateFields((err, values) => {
        if (!err) {
          options.onSave(values)
        }
      })
    }
    return <Form className={styles.form} onSubmit={handleSubmit}>
      {form.getFieldDecorator('role_ids', {
        initialValue: currentRoleIds,
        rules: [{
          required: true,
        }],
      })(
        <Select style={{ width: 450 }}
          mode="multiple"
          loading={Boolean(pending)}
          onSearch={handleSearch}
          required
        >
          {roleList.map(item => {
            return <Option value={item._id} key={item._id}>{item.name}</Option>
          })}
        </Select>
      )}

      <Button htmlType="submit" style={style}>
        save
      </Button>
      <Button type="cancel" style={style} onClick={() => handleChange(null)}>
        cancel
      </Button>
    </Form>
  }
  const EditRoles = Form.create()(editForm)
  const searchHosts = selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1]
    options.searchHosts(targetOption)
  }
  const hostForm = ({form}) => {
    const submitHosts = e => {
      e.preventDefault();
      form.validateFields((err, values) => {
        if (!err) {
          options.onSaveHosts(values).then(()=> setEditType(null))
        }
      })
    }

    return <Form className={styles.form} onSubmit={submitHosts}>
      {form.getFieldDecorator('hosts', {
        rules: [{
          required: true,
        }],
      })(
        <Cascader
          options={groupList}
          loadData={searchHosts}
          style={{ width: 450 }}
          changeOnSelect
          onChange={(value, target) => !target && searchHosts(value)}
       />
      )}

      <Button htmlType="submit" style={style}>
        save
      </Button>
      <Button type="cancel" style={style} onClick={() => handleChange(null)}>
        cancel
      </Button>
    </Form>
  }

  const currentHosts = []
  for (const key in options.currentHosts) {
    const item = options.currentHosts[key]
    if (key === 'hosts') {
      for (const host of item) {
        currentHosts.push(
          <Tag key={host._id}>{host.hostname}(node)</Tag>
        )
      }
    } else if (key === 'groups') {
      for (const group of item) {
        currentHosts.push(
          <Tag key={group._id}>{group.name}(group)</Tag>
        )
      }
    }
  }

  currentHosts.push(
    <Tag onClick={() => handleChange('hosts')} style={style} key={'hosts'}>
      <Icon type="plus"/>add
    </Tag>
  )

  const EditHosts = Form.create()(hostForm)

  return (
    <Descriptions title="User Info" column={2} bordered>
      <Descriptions.Item label="UserName">{user.username}</Descriptions.Item>
      <Descriptions.Item label="Nickname">{user.nickname}</Descriptions.Item>
      <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
      <Descriptions.Item label="Phone">{user.phone}</Descriptions.Item>
      <Descriptions.Item label="Team">{team.name}</Descriptions.Item>
      <Descriptions.Item label="Actived">{user.created_at}</Descriptions.Item>

      <Descriptions.Item label="Address" span={2}>{user.address}</Descriptions.Item>
      <Descriptions.Item label="Roles" span={2}>
        {editType !== 'roles' ? currentRoles : <EditRoles />}
      </Descriptions.Item>
      <Descriptions.Item label="inventory" span={2}>
        {editType !== 'hosts' ? currentHosts : !userInfo.is_admin ? <EditHosts /> : null}
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
