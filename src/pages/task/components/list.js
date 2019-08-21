import React from 'react'
import { Table } from 'antd'

const List = ({ ...tableProps }) => {
  const columns = [
     {
      title: 'Project',
      dataIndex: 'Project',
    },
     {
      title: 'Type',
      dataIndex: 'type',
    },
    {
      title: 'Inventory',
      dataIndex: 'inventory',
    },
    {
      title: 'Agent',
      dataIndex: 'agent',
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Webhook',
      dataIndex: 'webhook',
      render: (text) => {
        text = String(text);

        return text.length > 100 ? text.substr(0, 100) + '....' : text;
      }
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
        rowKey={record => record.id}
      />
    </div>
  )
}

export default List
