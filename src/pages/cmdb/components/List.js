import React, { useState } from 'react'
import styles from './list.less'
import { DropOption } from 'components'
import { Table, Tag } from 'antd'
import classnames from 'classnames'
import AnimTableBody from 'components/DataTable/AnimTableBody'
import { CodeMirror } from 'components'
import YAML from 'yaml'
import { Link } from 'dva/router'

const List = ({
  onDeleteItem,
  onEditItem,
  onSave,
  onDelete,
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
      title: 'hostname',
      dataIndex: 'hostname',
      render(text, record) {
        return <Link to={'/cmdb/inventory/' + record._id}>{text}</Link>
      },
    },
    {
      title: 'group',
      dataIndex: 'group_names',
      render(text, record) {
        if (Array.isArray(record.group_names)) {
          return record.group_names.join(',')
        } else {
          return 'ungrouped'
        }
      },
    },
    {
      title: 'connect ip',
      dataIndex: 'ansible_ssh_host',
    },
    {
      title: 'description',
      dataIndex: 'description',
    },
    {
      title: 'system',
      dataIndex: 'system',
    },
    {
      title: 'OS family',
      dataIndex: 'os_family',
      // render: processor => {
      //   if (typeof(processor) !== 'object') {
      //     return null
      //   }

      //   processor = processor || {}
      //   return (
      //     <div>
      //       <Tag>{processor.architecture}</Tag>
      //       <Tag>{processor.cores}cores</Tag>
      //       <Tag>{processor.vscups} vscups</Tag>
      //     </div>

      //   )
      // },
    },
    {
      title: 'memory(MB)',
      dataIndex: 'memory',
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
      className={classnames(styles.table, { [styles.motion]: true })}
      bordered
      scroll={{ x: 1000 }}
      columns={columns}
      rowKey={record => record._id}
      components={{
        body: { wrapper: AnimateBody },
      }}
    />
  )
}

export default List
