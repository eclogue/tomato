import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Card, Divider, Tag, Badge } from 'antd'
import CountUp from 'react-countup'
import styles from './number.less'
import { FormattedMessage } from 'umi-plugin-locale';

const Field = ({ label, value, status }) => (
  <div className={styles.field}>
    <div className={styles.label}>
      <Badge status={status || 'active'} text={label} />
      <span>:</span>
      <span className={styles.number}><Tag>{value}</Tag></span>
    </div>
  </div>
)

function NumberCard({ icon, color, title, number, countUp, source }) {
  return (
    <Card
      className={styles.numberCard}
      bordered={false}
      bodyStyle={{ padding: 10 }}
    >
      <Icon className={styles.iconWarp} style={{ color }} type={icon} />
      <div className={styles.content}>
        <p className={styles.title}>{title || 'No Title'}</p>
        <p className={styles.number}>
          <CountUp
            start={0}
            end={number}
            duration={2.75}
            useEasing
            useGrouping
            separator=","
            {...(countUp || {})}
          />
        </p>
      </div>
      <Divider style={{margin: "10px 0"}}/>
      {source && Array.isArray(source) ? source.map((item, key) => <Field key={key} {...item}/>) : null}
    </Card>
  )
}

NumberCard.propTypes = {
  icon: PropTypes.string,
  color: PropTypes.string,
  title: PropTypes.string,
  number: PropTypes.number,
  countUp: PropTypes.object,
}

export default NumberCard
