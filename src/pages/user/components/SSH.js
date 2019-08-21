import React from 'react'
import { List, Avatar, Icon, Button } from 'antd'


const Index = ({ currentItem }) => {

  const { list=[], pagination } = currentItem
  const listData = []
  for (const item of list) {
    listData.push({
      title: item.name,
      description:
        '74:4a:01:c3:78:5d:47:02:75:be:d8:a3:e7:00:e0:7d', // @todo
      content: item.description,
    });
  }

  return (
    <List
      itemLayout="vertical"
      size="large"
      pagination={{
        ...pagination,
        onChange: page => {
          console.log(page);
        },
      }}
      dataSource={listData}
      renderItem={item => (
        <List.Item
          key={item.title}
          actions={[
            <Button type="dashed" icon="edit">edit</Button>,
            <Button type="danger" icon="delete">delete</Button>,
          ]}
        >
          <List.Item.Meta
            avatar={<Avatar icon="key" theme="twoTone" />}
            title={item.title}
            description={item.description}
          />
          {item.content}
        </List.Item>
      )}
    />
  )
}

export default Index
