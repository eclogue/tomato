import React from 'react'
import { Table } from 'antd'
import { DropOption } from 'components'
import { Link } from 'dva/router'

const List = ({ ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      tableProps.onEdit(record)
    } else if (e.key === '3') {
      tableProps.onDownload(record)
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
      }
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
      render: (text) => {
        return parseInt(text) === 1 ? 'enable' : 'disable'
      }
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
              { key: '1', name: 'edit' },
              { key: '2', name: 'delete' },
              { key: '3', name: 'download' },
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
