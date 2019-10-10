import React from 'react'
import { DropOption } from 'components'
import { Table, Tag } from 'antd'
import { Link } from 'dva/router'
import AnimTableBody from 'components/DataTable/AnimTableBody'

const List = ({
  onEditItem,
  onDelete,
  onSave,
  location,
  selectedRowKeys,
  ...tableProps
}) => {
  const handleMenuClick = (record, e) => {
    if (e.key === 'edit') {
      onEditItem(record)
    } else if (e.key === 'delete') {
      onDelete(record)
    }
  }

  const columns = [
    {
      title: 'name',
      dataIndex: 'name',
    },
    {
      title: 'region',
      dataIndex: 'region_name',
      render: text => {
        return (
          <Tag>
            <Link to={`/cmdb/region?keyword=${text}`}>{text}</Link>
          </Tag>
        )
      },
    },
    {
      title: 'description',
      dataIndex: 'description',
    },
    {
      title: 'add by',
      dataIndex: 'add_by',
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
