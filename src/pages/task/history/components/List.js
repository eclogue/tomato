import React from 'react'
import { Table } from 'antd'

const List = ({ ...tableProps }) => {
  const columns = [
     {
      title: 'Job Name',
      render: record => {
        const job = record.job || {}
        return job.name
      }
    },
     {
      title: 'Task Stats',
      dataIndex: 'state',
    },
    {
      title: 'Report ID',
      dataIndex: 'request_id',
    },
    {
      title: 'Finish At',
      dataIndex: 'finished_at',
    },
    {
      title: 'Created At',
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
