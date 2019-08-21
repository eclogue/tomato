import React from 'react'
import { connect } from 'dva'
import { Page } from 'components'
import PropTypes from 'prop-types'
import { Icon, Select, Menu, Collapse } from 'antd'
import { DropOption } from 'components'
import { routerRedux } from 'dva/router'
import styles from './index.less'

const { Panel } = Collapse

const Index = ({ notification, loading, dispatch, location }) => {

  const { pathname, query } = location
  const { list } = notification
  const markRead = record => {
    console.log('fffffcku your', record)

    dispatch({
      type: 'notification/read',
      payload: {
        ids: [record._id],
      },
    }).then(() => {
      return handleRefresh()
    })
  }

  const handleRefresh = (newQuery) => {
    dispatch(routerRedux.push({
      pathname,
      query: {
        ...query,
        ...newQuery,
      },
    }))
  }
  const genExtra = (record) => (
    <div onClick={() => markRead(record)} className={styles.markIcon}><Icon type="check"/></div>
  )

  const customPanelStyle = {
    background: '#f7f7f7',
    borderRadius: 4,
    marginBottom: 24,
    border: 0,
    overflow: 'hidden',
  }


  return (
    <Page inner>
      <div className={styles.header}>
        <div className={styles.sortOption}>
        <Select style={{ width: 120 }} onChange={console.log} placeholder="sort">
           <Select.Option value="time">timeline</Select.Option>
           <Select.Option value="unread">unread first</Select.Option>
         </Select>
        </div>
        Notification
        <div className={styles.readAll}>mark all as read</div>
      </div>
      <div>
        <Collapse
          onChange={console.log}
          expandIconPosition="left"
          accordion={true}
          expandIcon={({ isActive }) => <Icon  type="caret-right" rotate={isActive ? 90 : 0} />}
        >
          {list.map(item => {
            const className = item.read ? 'read' : 'unread'
            const header = (
              <div className={styles.collapseHeader}>
                {item.read ? <Icon type="check"/> : <Icon type="bulb" />}
                <span className={styles[className]}>{item.title}</span>
              </div>
            )
            return (
              <Panel header={header}
                key={item._id}
                extra={genExtra(item)}
                style={customPanelStyle}
              >
                <p>{item.content}</p>
              </Panel>
            )
          })}
        </Collapse>
      </div>
    </Page>
  )
}

export default connect(({notification, loading, dispatch}) => ({notification, loading, dispatch}))(Index)
