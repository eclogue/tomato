import React from 'react'
import { Descriptions, Badge } from 'antd'

const Index = () => {

  return (
    <Descriptions bordered>
      <Descriptions.Item label="Name">Cloud Database</Descriptions.Item>
      <Descriptions.Item label="Service">Web</Descriptions.Item>
      <Descriptions.Item label="Type">CI</Descriptions.Item>
      <Descriptions.Item label="Status">
        <Badge status="processing" text="Running" />
      </Descriptions.Item>
      <Descriptions.Item label="Maintainer">[player, bugbear]</Descriptions.Item>
      <Descriptions.Item label="Created at">2019-04-24 18:00:00</Descriptions.Item>
      <Descriptions.Item label="Protocol">TCP,UTP</Descriptions.Item>
      <Descriptions.Item label="Port">5000,7000</Descriptions.Item>
      <Descriptions.Item label="Document" span={3}>https://doc.eclogue.com</Descriptions.Item>
      <Descriptions.Item label="Actions">test, check, run</Descriptions.Item>
      <Descriptions.Item label="params">
        Data disk type: MongoDB
        <br />
        Database version: 3.4
        <br />
        Package: dds.mongo.mid
        <br />
        Storage space: 10 GB
        <br />
        Replication_factor:3
        <br />
        Region: East China 1<br />
      </Descriptions.Item>
    </Descriptions>
  )
}

export default Index
