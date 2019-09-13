import React from 'react'
import { connect } from 'dva'
import { Page } from 'components'
import PropTypes from 'prop-types'
import { Card, Col, Row, Statistic, Icon, Divider, Badge } from 'antd'
import { Link } from 'dva/router'
import queryString from 'query-string'
import {
  Bar,
  BarChart,
  Legend,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import Schedule from './components/ScheduleList'


const Index = ({task, loading, dispatch}) => {
  const { queues, taskHistogram, taskPies, taskStatePies, schedule } = task
  console.log('scheduleeeeee', schedule)
  const queueGroup = []
  const statsOptions = {
    queued: {
      color: 'cyan',
      icon: 'ordered-list',
    },
    active: {
      color: 'green',
      icon: 'fire'
    },
    error: {
      color: 'red',
      icon: 'close-circle'
    },
    scheduled: {
      color: 'orange',
      icon: 'robot',
    }
  }
  const getCol = (item) => {
    const stats = item.stats
    if (!stats || typeof stats !== 'object') {
      return null
    }
    const temp = []
    const gridStyle = {
      width: (1 / Object.keys(stats).length) * 100 + '%',
      textAlign: 'center',
    }
    const query = {queue: item.queue}
    for (const key in stats) {
      query.state = key
      const q = queryString.stringify(query)
      const uri = '/task/queue?' + q
      const color = statsOptions[key].color
      const status = <Link to={uri}><Badge color={color} text={key} /></Link>
      temp.push(
        <Card.Grid style={gridStyle} key={item.queue + key}>
          <Statistic
            title={status}
            value={stats[key]}
            valueStyle={{ color: color }}
            prefix={<Icon type={statsOptions[key].color.icon} />}
          />
        </Card.Grid>
      )
    }

    return <Card title={item.job_name || item.queue} extra={<Link to='#'>View</Link>}>{temp}</Card>
  }

  for (const base in queues) {
    const group = queues[base]
    queueGroup.push(<Divider orientation="center" key={base}>{base}</Divider>)
    let index = 0
    let row = []
    for (const item of group) {
      const col = (<Col span={12} key={index}>{getCol(item)}</Col>)
      row.push(col)
      if (index %2 !== 0 || group.length === index + 1) {
        queueGroup.push(<Row gutter={0} key={Date.now()+Math.random()}>
          {row}
        </Row>)
        row = []
      }
      index++
    }
  }
  const bodyStyle = {
    bodyStyle: {
      height: 432,
      background: '#fff',
    },
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  return (
    <Page inner>
      <Row>
        <Col lg={10} md={20}>
          <Card bordered={false} {...bodyStyle} title="task type">
            <ResponsiveContainer minHeight={300}>
              <PieChart>
                <Tooltip />
                <Legend />
                <Pie data={taskPies.jobType} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={50} fill="#faad14"  />
                <Pie data={taskPies.runType} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#a0d911" label />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col lg={10} md={20}>
          <Card bordered={false} {...bodyStyle} title="current 7 days task state">
            <ResponsiveContainer minHeight={300}>
              <PieChart>
                <Tooltip />
                <Legend />
                <Pie data={taskStatePies} dataKey="count" nameKey="state" cx="50%" cy="50%" outerRadius={80} fill="#a0d911" label >
                {
                  taskStatePies.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                }
                </Pie>
            </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
      <Row>
        <Card bordered={false} {...bodyStyle} title="current 7 days task state(30min)">
          <ResponsiveContainer minHeight={300}>
            <BarChart data={taskHistogram}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="finish" fill="#87d068" />
              <Bar dataKey="error" fill="red" />
              <Bar dataKey="queued" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Row>
      <Row>
        <Card title='schedule'>
          <Schedule data={schedule} />
        </Card>
      </Row>
      <div>{queueGroup}</div>
    </Page>
  )
}

Index.propTypes = {
  task: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ task, loading }) => ({ task, loading }))(Index)
