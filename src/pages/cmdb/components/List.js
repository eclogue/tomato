import React, { useState } from 'react'
import styles from './list.less'
import { DropOption } from 'components'
import { Table, Button } from 'antd'
import classnames from 'classnames'
import AnimTableBody from 'components/DataTable/AnimTableBody'
import { CodeMirror } from 'components'
import YAML from 'yaml'
import { Link } from 'dva/router'

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



  const handleItemChange = (...params) => {
    const _id = params[0]
    if (!_id) {
      return false
    }

    const content = params[3]
    const currentItem = YAML.parse(content)
    currentItem._id = _id
  }

  const columns = [
    {
      title: 'hostname',
      dataIndex: 'node_name',
      render(text, record) {
        return <Link to={'/cmdb/inventory/' + record._id}>{text}</Link>
      }
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
      }
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
      title: 'cpu',
      dataIndex: 'processor',
      render: record => {
        return record ? parseInt(record.length / 3) : 0
      },
    },
    {
      title: 'memory',
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


  const expandRow = record => {
    const data = Object.assign({}, record)
    delete data._id
    let content = YAML.stringify(data)
    return (
      <div style={{textAlign: 'left'}}>
        <CodeMirror value={content} onChange={(...params) => handleItemChange(record._id, ...params)} options={CodeOptions}/>
      </div>
    )
  }
  return (
    <Table
      {...tableProps}
      className={classnames(styles.table, { [styles.motion]: true })}
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
      // expandedRowRender={expandRow}
    />
  )
}

export default List
