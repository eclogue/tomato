import React from 'react'
import { Table } from 'antd'
import { DropOption } from 'components'
import { Link } from 'dva/router'

const List = ({ onEdit, onCheck, ...tableProps }) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '0') {
    } else if (e.key === '1') {
      onCheck(record)
    } else if (e.key === '2') {
      onEdit(record)
    } else if (e.key === 3) {
      console.log('delete action')
    }
   }

  const columns = [
     {
      title: 'Name',
      dataIndex: 'name',
      render(text, record) {
        const query = '?id=' + record._id
        return <Link to={'/job/detail' + query}>{text}</Link>
      }
    },
     {
      title: 'Description',
      render: record => {
        if (record.template) {
          return record.template.description
        }

        return ''
      }
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
              { key: '2', name: 'edit' },
              { key: '3', name: 'delete' },
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
