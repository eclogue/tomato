import React, { Suspense } from 'react'
import { connect } from 'dva'
import { Page } from 'components'
import PropTypes from 'prop-types'
import { Icon, Card, Row, Col } from 'antd'
import { routerRedux } from 'dva/router'
import NumberCard from './components/NumberCard'
import { color } from 'utils'
import styles from './index.less'
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

console.log('stylessss',styles)

const Info = ({ title, value, bordered }) => (
  <div className={styles.headerInfo}>
    <span>{title}</span>
    <p>{value}</p>
    {bordered && <em />}
  </div>
)

const Index = ({ dashboard, loading, dispatch, location }) => {

  const data = [
    {
      name: 'Page A', uv: 4000, pv: 2400, amt: 2400,
    },
    {
      name: 'Page B', uv: 3000, pv: 1398, amt: 2210,
    },
    {
      name: 'Page C', uv: 2000, pv: 9800, amt: 2290,
    },
    {
      name: 'Page D', uv: 2780, pv: 3908, amt: 2000,
    },
    {
      name: 'Page E', uv: 1890, pv: 4800, amt: 2181,
    },
    {
      name: 'Page F', uv: 2390, pv: 3800, amt: 2500,
    },
    {
      name: 'Page G', uv: 3490, pv: 4300, amt: 2100,
    },
  ];

  return (
    <Page inner>
      <Row gutter={1}>
        <Col key={1} lg={4} md={10}>
          <NumberCard icon="cloud" color={color.green} title="Hosts" number={123} />
        </Col>
        <Col key={2} lg={4} md={10}>
          <NumberCard icon="book" color={color.green} title="Applications" number={123} />
        </Col>
        <Col key={3} lg={4} md={10}>
          <NumberCard icon="file" color={color.green} title="Playbooks" number={123} />
        </Col>
        <Col key={4} lg={4} md={10}>
          <NumberCard icon="book" color={color.green} title="Jobs" number={123} />
        </Col>
        <Col key={5} lg={4} md={10}>
          <NumberCard icon="book" color={color.green} title="Configurations" number={123} />
        </Col>
      </Row>
      <div className={styles.standardList}>
        <Card bordered={true} style={{background: '#fdfdfd'}}>
          <Row>
            <Col sm={4} xs={12}>
              <Info title="我的待办" value="8个任务" bordered />
            </Col>
            <Col sm={4} xs={12}>
              <Info title="本周任务平均处理时间" value="32分钟" bordered />
            </Col>
            <Col sm={4} xs={12}>
              <Info title="本周完成任务数" value="24个任务" />
            </Col>
            <Col sm={4} xs={12}>
              <Info title="本周完成任务数" value="24个任务" />
            </Col>
          </Row>
        </Card>
      </div>
      <Suspense fallback={null}>
        <Card title="current task">
          <ResponsiveContainer minHeight={400}>
            <BarChart
              data={data}
              margin={{
                top: 25, right: 30, left: 20, bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="pv" fill="#8884d8" />
              <Bar dataKey="uv" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Suspense>
    </Page>
  )
}

export default connect(({dashboard, loading, dispatch}) => ({dashboard, loading, dispatch}))(Index)
