import React from 'react'
import { DropOption } from 'components'
import { Table, Tag } from 'antd'
import { Link } from 'dva/router'
import AnimTableBody from 'components/DataTable/AnimTableBody'

const List = ({
  onDeleteItem,
  onEditItem,
  onSave,
  location,
  selectedRowKeys,
  ...tableProps
}) => {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record)
    }
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Bind job',
      dataIndex: 'job',
      render: job => {
        if (!job) {
          return null
        }

        return (
          <Tag color="green">
            <Link to={`/job/detail?id=${job._id}`}>{job.name}</Link>
          </Tag>
        )
      },
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
      title: 'Document',
      dataIndex: 'document',
    },
    {
      title: 'Description',
      dataIndex: 'description',
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
            ]}
          />
        )
      },
    },
  ]
  const AnimateBody = props => {
    return <AnimTableBody {...props} />
  }

  return (
    <Table
      {...tableProps}
      bordered
      scroll={{ x: 1000 }}
      columns={columns}
      simple
      rowKey={record => record._id}
      components={{
        body: { wrapper: AnimateBody },
      }}
    />
  )
}

export default List
