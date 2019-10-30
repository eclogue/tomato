import React from 'react'
import { Tree, Icon } from 'antd'

const TreeNode = Tree.TreeNode

export const renderTreeNodes = data => {
  return data.map(item => {
    if (item.children) {
      return (
        <TreeNode
          title={item.title}
          key={item.key}
          dataRef={item}
          icon={<Icon type={item.icon} />}
        >
          {renderTreeNodes(item.children)}
        </TreeNode>
      )
    }
    return (
      <TreeNode key={item.key} {...item} icon={<Icon type={item.icon} />} />
    )
  })
}
