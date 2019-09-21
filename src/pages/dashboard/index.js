import React, { Suspense } from 'react'
import { connect } from 'dva'
import { Page } from 'components'
import PropTypes from 'prop-types'
import { Icon, Card, Row, Col } from 'antd'
import { routerRedux } from 'dva/router'
import NumberCard from './components/Number'
import { color } from 'utils'
import styles from './index.less'
import {
  LineChart, Line, XAxis, YAxis, PieChart, Pie,
  Cell, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';


const Info = ({ title, value, bordered }) => (
  <div className={styles.headerInfo}>
    <span>{title}</span>
    <p>{value}</p>
    {bordered && <em />}
  </div>
)

const Index = ({ dashboard, loading, dispatch, location }) => {

  const { hosts, apps, playbooks, jobs, taskHistogram, taskPies, jobDuration } = dashboard

  return (
    <Page inner>
      <div style={{background: 'ffffff', display: 'block', marginBottom: 100}}>
        <Row gutter={12}>
          <Col key={1} lg={6} md={12}>
            <NumberCard icon="cluster" color="#2db7f5" title="Hosts" number={hosts.total} extra={hosts.extra} />
          </Col>
          <Col key={2} lg={6} md={12}>
            <NumberCard icon="rocket" color="#87d068" title="Applications" number={apps.total} extra={apps.extra} />
          </Col>
          <Col key={3} lg={6} md={12}>
            <NumberCard icon="book" color="gold" title="Playbooks" number={playbooks.total} extra={playbooks.extra} />
          </Col>
          <Col key={4} lg={6} md={12}>
            <NumberCard icon="cloud-server" color={color.purple} title="Jobs" number={jobs.total} extra={jobs.extra} />
          </Col>
        </Row>
        <div className={styles.standardList}>
          <Card bordered={true} >
            <Row>
              <Col sm={4} xs={12}>
                <Info title="registed configurations" value={dashboard.config} bordered />
              </Col>
              <Col sm={4} xs={12}>
                <Info title="tasks handled in this week" value={jobDuration.sum} bordered/>
              </Col>
              {jobDuration.avg ? (
                <Col sm={4} xs={12}>
                  <Info title="Average task processing time this week" value={jobDuration.avg.toFixed(3)} bordered />
                </Col>
              ): null }
              {jobDuration.max ? (
                <Col sm={4} xs={12}>
                  <Info title="The slowest task run time" value={jobDuration.max.toFixed(3)} bordered/>
                </Col>
              ): null }
              {jobDuration.min ? (
                <Col sm={4} xs={12}>
                  <Info title="The fastest task run time" value={jobDuration.min.toFixed(3)} />
                </Col>
              ): null}
            </Row>
          </Card>
        </div>
        <Row>
          <Col lg={10} md={20}>
            <Card >
              <ResponsiveContainer minHeight={300}>
                <PieChart>
                  <Tooltip />
                  <Legend />
                  <Pie data={taskPies} dataKey="count" nameKey="state" cx="50%" cy="50%" outerRadius={80} fill="#a0d911" label >
                  {
                    taskPies.map((entry, index) => <Cell key={`cell-${index}`} fill={Object.values(color)[index % 100]} />)
                  }
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col lg={10} md={20}>
            <Card>
              <ResponsiveContainer minHeight={300}>
                <PieChart>
                  <Tooltip />
                  <Legend />
                  <Pie data={taskPies} dataKey="count" nameKey="state" cx="50%" cy="50%" outerRadius={80} fill="#a0d911" label >
                  {
                    taskPies.map((entry, index) => <Cell key={`cell-${index}`} fill={Object.values(color)[index % 100]} />)
                  }
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
        <Row>
          <Suspense fallback={null}>
            <Card>
              <ResponsiveContainer minHeight={300}>
                <LineChart data={taskHistogram}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="finish" stroke="#87d068" />
                  <Line type="monotone" dataKey="error" stroke="red" />
                  <Line type="monotone" dataKey="queued" stroke="#0088FE" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Suspense>
        </Row>

      </div>
    </Page>
  )
}

export default connect(({dashboard, loading, dispatch}) => ({dashboard, loading, dispatch}))(Index)
