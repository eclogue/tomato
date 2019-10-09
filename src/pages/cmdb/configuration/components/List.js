import React from 'react'
import { Table, Tag, Tooltip } from 'antd'
import { DropOption } from 'components'
import { Link } from 'dva/router'

const List = ({ ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === 'edit') {
      tableProps.onEdit(record)
    } else if (e.key === 'delete') {
      tableProps.onDelete(record)
    }
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text, record) => {
        const pathname = '/configuration/' + record._id
        return (
          <Link to={pathname}>
            <div>{text}</div>
          </Link>
        )
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Registry',
      render: record => {
        const { registry } = record
        return registry.map(item => {
          return (
            <Tooltip title={item.path} key={item._id}>
              <Tag color="cyan">{item.book_name}</Tag>
            </Tooltip>
          )
        })
      },
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
        rowKey={record => {
          return record._id
        }}
      />
    </div>
  )
}

export default List
