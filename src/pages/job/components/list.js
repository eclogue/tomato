import React from 'react'
import { Table } from 'antd'
import { DropOption } from 'components'
import { Link } from 'dva/router'

const List = ({ onEdit, onCheck, onDelete, ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === 'edit') {
      onEdit(record)
    } else if (e.key === 'delete') {
      console.log('delete action')
      onDelete(record)
    }
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render(text, record) {
        const query = '?id=' + record._id
        return <Link to={'/job/detail' + query}>{text}</Link>
      },
    },
    {
      title: 'Description',
      render: record => {
        if (record.template) {
          return record.template.description
        }

        return ''
      },
    },
    {
      title: 'Entry',
      dataIndex: 'entry',
    },
    {
      title: 'Type',
      dataIndex: 'type',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: status => {
        return status === 1 ? 'enable' : status === 0 ? 'disable' : 'forbidden'
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
        rowKey={record => record._id}
      />
    </div>
  )
}

export default List
