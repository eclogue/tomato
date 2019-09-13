
import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import { Table, Tag } from 'antd'
import { color } from 'utils'
import styles from './schedule.less'

const status = [
  color.green,
  color.yellow,
  color.red,
  color.blue,
]

function Schedule({ data }) {
  const columns = [
    {
      title: 'NAME',
      dataIndex: 'name',
      render: text => <Tag color={color.green}>{text}</Tag>,
    },
    {
      title: 'Trigger',
      dataIndex: 'trigger',
      render: text => <Tag color={color.blue}>{text}</Tag>,
    },
    {
      title: 'Next',
      dataIndex: 'next_run_time',
    },
    {
      title: 'Func',
      dataIndex: 'func',
      render: (text) => (
        <span style={{ color: color.yellow }}>${text}</span>
      ),
    },
  ]
  return (
    <div className={styles.recentsales}>
      <Table
        pagination={false}
        columns={columns}
        rowKey={(record, key) => key}
        dataSource={data}
      />
    </div>
  )
}

Schedule.propTypes = {
  data: PropTypes.array,
}

export default Schedule
