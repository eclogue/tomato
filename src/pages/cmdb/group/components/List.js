import React, { useState } from 'react'
import { DropOption } from 'components'
import { Table, Button } from 'antd'
import AnimTableBody from 'components/DataTable/AnimTableBody'
import { CodeMirror } from 'components'

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
      title: 'name',
      dataIndex: 'name',
    },
    {
      title: 'region',
      dataIndex: 'region_name',
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
            menuOptions={[{ key: '1', name: 'edit' }, { key: '2', name: 'delete' }]}
          />
        )
      },
    },
  ]
  const AnimateBody = props => {
    return <AnimTableBody {...props} />
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: console.log,
  }

  const footer = () => {
    if (selectedRowKeys && selectedRowKeys.length) {
        return <Button key={1}>reset</Button>
    }
    return null
  }

  const CodeOptions = {
    lineNumbers: true,
    readOnly: true,
    CodeMirror: 'auto',
    viewportMargin: 50,
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
      footer={footer}
      rowSelection={rowSelection}
    />
  )
}

export default List
