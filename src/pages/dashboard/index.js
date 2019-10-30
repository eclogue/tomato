import React, { Suspense } from 'react'
import { connect } from 'dva'
import { Page } from 'components'
import PropTypes from 'prop-types'
import { Card, Row, Col } from 'antd'
import moment from 'moment'
import { routerRedux } from 'dva/router'
import NumberCard from './components/Number'
import { color } from 'utils'
import styles from './index.less'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const Info = ({ title, value, bordered }) => (
  <div className={styles.headerInfo}>
    <span>{title}</span>
    <p>{value}</p>
    {bordered && <em />}
  </div>
)

const Index = ({ dashboard, loading, dispatch, location }) => {
  const {
    hosts,
    apps,
    playbooks,
    jobs,
    taskHistogram,
    taskPies,
    jobDuration,
    jobRunPies,
  } = dashboard
  const taskLine = taskHistogram.map(item => {
    item.dateFormat = moment(new Date(item.date * 1000)).format(
      'YYYY-MM-DD hh:mm:ss'
    )

    return item
  })

  return (
    <Page inner>
      <div
        style={{ background: 'ffffff', display: 'block', marginBottom: 100 }}
      >
        <Row gutter={12}>
          <Col key={1} lg={6} md={12}>
            <NumberCard
              icon="cluster"
              color="#2db7f5"
              title="Hosts"
              number={hosts.total}
              extra={hosts.extra}
            />
          </Col>
          <Col key={2} lg={6} md={12}>
            <NumberCard
              icon="rocket"
              color="#87d068"
              title="Applications"
              number={apps.total}
              extra={apps.extra}
            />
          </Col>
          <Col key={3} lg={6} md={12}>
            <NumberCard
              icon="book"
              color="gold"
              title="Playbooks"
              number={playbooks.total}
              extra={playbooks.extra}
            />
          </Col>
          <Col key={4} lg={6} md={12}>
            <NumberCard
              icon="cloud-server"
              color={color.purple}
              title="Jobs"
              number={jobs.total}
              extra={jobs.extra}
            />
          </Col>
        </Row>
        <div className={styles.standardList}>
          <Card bordered={true} title="概况">
            <Row>
              <Col sm={4} xs={12}>
                <Info
                  title="已注册的配置数"
                  value={dashboard.config}
                  bordered
                />
              </Col>
              <Col sm={4} xs={12}>
                <Info
                  title="总共处理任务数(最近七天)"
                  value={jobDuration.sum}
                  bordered
                />
              </Col>
              {jobDuration.avg ? (
                <Col sm={4} xs={12}>
                  <Info
                    title="任务平均耗时(最近七天)"
                    value={jobDuration.avg.toFixed(3)}
                    bordered
                  />
                </Col>
              ) : null}
              {jobDuration.max ? (
                <Col sm={4} xs={12}>
                  <Info
                    title="耗时最长的任务(最近七天)"
                    value={jobDuration.max.toFixed(3)}
                    bordered
                  />
                </Col>
              ) : null}
              {jobDuration.min ? (
                <Col sm={4} xs={12}>
                  <Info
                    title="用时最短任务(最近七天)"
                    value={jobDuration.min.toFixed(3)}
                  />
                </Col>
              ) : null}
            </Row>
          </Card>
        </div>
        <Row>
          <Col lg={10} md={20}>
            <Card title="task 状态统计">
              <ResponsiveContainer minHeight={300}>
                <PieChart>
                  <Tooltip />
                  <Legend />
                  <Pie
                    data={taskPies}
                    dataKey="count"
                    nameKey="state"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#a0d911"
                    label
                  >
                    {taskPies.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={Object.values(color)[index % 100]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col lg={10} md={20}>
            <Card title="job 运行次数统计">
              <ResponsiveContainer minHeight={300}>
                <PieChart>
                  <Tooltip />
                  <Legend />
                  <Pie
                    data={jobRunPies}
                    dataKey="count"
                    nameKey="job_name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#a0d911"
                    label
                  >
                    {jobRunPies.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          Object.values(color)[parseInt(Math.random() * 10)]
                        }
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
        <Row>
          <Suspense fallback={null}>
            <Card title="任务运行结果">
              <ResponsiveContainer minHeight={300}>
                <LineChart data={taskLine}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dateFormat" />
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

Index.propTypes = {
  dispatch: PropTypes.func,
  loading: PropTypes.object,
  dashboard: PropTypes.object,
}

export default connect(({ dashboard, loading, dispatch }) => ({
  dashboard,
  loading,
  dispatch,
}))(Index)
