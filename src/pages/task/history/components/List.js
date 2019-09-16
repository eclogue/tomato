import React from 'react'
import { Table } from 'antd'
import { Link } from 'dva/router'

const List = ({ ...tableProps }) => {
  const columns = [
    {
      title: 'Job Name',
      render: record => {
        const job = record.job || {}
        return (<Link to={'/task/history/' + record._id} >{job.name || 'unknown'}</Link>)
      }
    },
    {
      title: 'ansible',
      dataIndex: 'ansible',
    },
    {
      title: 'Type',
      dataIndex: 'type',
    },
    {
      title: 'Task Stats',
      dataIndex: 'state',
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
