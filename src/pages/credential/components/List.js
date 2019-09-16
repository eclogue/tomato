import React from 'react'
import { Table } from 'antd'

const List = ({ ...tableProps }) => {
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
    }
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
