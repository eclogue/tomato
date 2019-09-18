import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon, Popover, Layout, List, Badge, Tag, Button } from 'antd'
import classnames from 'classnames'
import styles from './Header.less'
import Menus from './Menu'
import { Ellipsis } from 'ant-design-pro'
import moment from 'moment'


const { SubMenu } = Menu

const Header = ({
  user = {},
  logout,
  switchSider,
  siderFold,
  isNavbar,
  menuPopoverVisible,
  location,
  switchMenuPopover,
  navOpenKeys,
  changeOpenKeys,
  menu,
  notifications,
  markAsRead,
  viewNotify,
  ...props
}) => {
  let handleClickMenu = e =>  {
    if (e.key === 'logout') {
      logout()
    } else if (e.key === 'profile') {
      props.viewProfile()

    }
  }

  const onMarkAsRead = (ids) => {
    if (!Array.isArray(ids)) {
      ids = notifications.map(item => item._id)
    }
    console.log('ids', ids)
    markAsRead(ids)
  }

  const onViewNotify = () => {
    viewNotify()
  }
  const notifyNode = (
    <Popover
      placement="bottomRight"
      trigger="click"
      key="notifications"
      overlayClassName={styles.notificationPopover}
      getPopupContainer={() => document.querySelector('#layoutHeader')}
      content={
        <div className={styles.notification}>
          <List
            itemLayout="horizontal"
            dataSource={notifications.list}
            locale={{
              emptyText: <div>You have viewed all notifications</div>,
            }}
            renderItem={item => (
              <List.Item className={styles.notificationItem}>
                <List.Item.Meta
                  title={
                    <Ellipsis tooltip lines={1}>
                      {item.title}
                    </Ellipsis>
                  }
                  description={moment(item.created_at).fromNow()}
                />
                <Icon
                  style={{ fontSize: 10, color: '#ccc' }}
                  type="right"
                  theme="outlined"
                  onClick={() => onMarkAsRead([item._id])}
                />
              </List.Item>
            )}
          />
          {notifications.total ? (
            <div
              className={styles.clearButton}
            >
              <Button onClick={onMarkAsRead} type="dashed">mark as readed</Button>
              <Button onClick={onViewNotify} type="link">view all notifications</Button>
            </div>
          ) : null}
        </div>
      }
    >
      <Badge
        count={notifications.total}
        offset={[-10, 10]}
        className={styles.iconButton}
      >
        <Icon className={styles.iconFont} type="bell" />
      </Badge>
    </Popover>
  )
  const menusProps = {
    menu,
    siderFold: false,
    darkTheme: false,
    isNavbar,
    handleClickNavMenu: switchMenuPopover,
    location,
    navOpenKeys,
    changeOpenKeys,
  }
  return (
    <Layout.Header className={styles.header} id="layoutHeader">
      {isNavbar ? (
        <Popover
          placement="bottomLeft"
          onVisibleChange={switchMenuPopover}
          visible={menuPopoverVisible}
          overlayClassName={styles.popovermenu}
          trigger="click"
          content={<Menus {...menusProps} />}
        >
          <div className={styles.button}>
            <Icon type="bars" />
          </div>
        </Popover>
      ) : (
        <div className={styles.button} onClick={switchSider}>
          <Icon
            type={classnames({
              'menu-unfold': siderFold,
              'menu-fold': !siderFold,
            })}
          />
        </div>
      )}


      <div className={styles.rightWarpper}>
        {notifyNode}
        <Menu mode="horizontal" onClick={handleClickMenu}>
          <SubMenu
            style={{
              float: 'right',
            }}
            title={
              <span>
                <Icon type="user" />
                {user.username}
              </span>
            }
          >
            <Menu.Item key="profile">Profile</Menu.Item>
            <Menu.Item key="logout">Sign out</Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    </Layout.Header>
  )
}

Header.propTypes = {
  menu: PropTypes.array,
  user: PropTypes.object,
  logout: PropTypes.func,
  switchSider: PropTypes.func,
  siderFold: PropTypes.bool,
  isNavbar: PropTypes.bool,
  menuPopoverVisible: PropTypes.bool,
  location: PropTypes.object,
  switchMenuPopover: PropTypes.func,
  navOpenKeys: PropTypes.array,
  changeOpenKeys: PropTypes.func,
}

export default Header
