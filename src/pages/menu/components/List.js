import React from 'react'
import { Table, Avatar, Tag } from 'antd'
import { DropOption } from 'components'

const List = ({ onEditItem, onDelete, ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === 'edit') {
      onEditItem(record)
    } else if (e.key === 'delete') {
      onDelete(record)
    }
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Parent',
      dataIndex: 'parent',
    },
    {
      title: 'Route',
      dataIndex: 'route',
    },
    {
      title: 'Icon',
      dataIndex: 'icon',
      render(text) {
        return <Avatar icon={text} style={{ background: 'green' }} />
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: text => (parseInt(text) ? 'enable' : 'disable'),
    },
    {
      title: 'Operation',
      key: 'operation',
      render: (text, record) => {
        return (
          <DropOption
            onMenuClick={e => handleMenuClick(record, e)}
            menuOptions={[
              { key: 'edit', name: 'edit' },
              { key: 'delete', name: 'delete' },
            ]}
          />
        )
      },
    },
  ]

  return (
    <div>
      <Table
        {...tableProps}
        scroll={{ x: 800 }}
        columns={columns}
        rowKey={record => record._id}
      />
    </div>
  )
}

export default List
