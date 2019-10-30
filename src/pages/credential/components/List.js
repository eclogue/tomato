import React from 'react'
import { Table } from 'antd'
import { DropOption } from 'components'

const List = ({ ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === 'edit') {
      tableProps.onEdit(record)
    }
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
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
        bordered
        scroll={{ x: 800 }}
        columns={columns}
        simple
        rowKey={record => record._id}
      />
    </div>
  )
}

export default List
