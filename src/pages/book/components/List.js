import React from 'react'
import { Table, Tag } from 'antd'
import { DropOption } from 'components'
import { Link } from 'dva/router'

const List = ({ ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === 'edite') {
      tableProps.onEdit(record)
    } else if (e.key === 'download') {
      tableProps.onDownload(record)
    } else if (e.key === 'delete') {
      tableProps.onDelete(record)
    }
  }

  const columns = [
    {
      title: 'Book name',
      dataIndex: 'name',
      render: (text, record) => {
        const pathname = '/book/view?id=' + record._id
        return (
          <Link to={pathname}>
            <div>{text}</div>
          </Link>
        )
      },
    },
    {
      title: 'Bind job',
      dataIndex: 'job',
      render: job => {
        if (!job) {
          return null
        }

        return (
          <Tag color="cyan">
            <Link to={`/job/detail?id=${job._id}`}>{job.name}</Link>
          </Tag>
        )
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Maintainer',
      dataIndex: 'maintainer',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: text => {
        return parseInt(text) === 1 ? 'enable' : 'disable'
      },
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
              { key: 'download', name: 'download' },
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
