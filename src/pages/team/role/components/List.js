import React from 'react'
import { Table } from 'antd'
import { DropOption } from 'components'
import { Link } from 'dva/router'

const List = ({ onEdit, showEditForm, ...tableProps }) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'address',
    },
    {
      title: 'Add by',
      dataIndex: 'add_by',
      key: 'add_by',
    },
    {
      title: 'Created at',
      dataIndex: 'created_at',
      key: 'created_at',
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
            ]}
          />
        )
      },
    },
  ]

  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      showEditForm(record)
    }
    if (e.key === '2') {
      console.log(record)
    }
  }

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
