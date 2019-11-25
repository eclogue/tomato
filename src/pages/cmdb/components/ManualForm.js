import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Button, AutoComplete } from 'antd'

const FormItem = Form.Item
const Option = Select.Option
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
}
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
}
const ManualForm = ({
  onOk,
  form,
  currentItem,
  searchMaintainer,
  searchGroups,
  searchRegions,
  users,
  regions,
  groups,
  credentials,
  ...options
}) => {
  const { getFieldDecorator } = form
  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((err, values) => {
      if (err) {
        return
      }
      values.group = values.group ? values.group.split(',') : []
      values.type = 'manual'
      onOk(values)
    })
  }
  const onSearch = value => {
    if (value.length <= 2) {
      return false
    }

    searchMaintainer(value)
  }

  const maintainer = []
  users.map(user => {
    maintainer.push(user.username)
    return user
  })

  const onSearchRegions = keyword => {
    if (!keyword || keyword.length < 2) {
      return
    }
    searchRegions(keyword)
  }

  const onSearchGroups = keyword => {
    if (!keyword || keyword.replace(/\s/, '').length < 2) {
      return
    }
    searchGroups(keyword)
  }

  return (
    <Form layout="horizontal" id="manual" onSubmit={handleSubmit}>
      <FormItem label="data center" hasFeedback {...formItemLayout}>
        {getFieldDecorator('region', {
          initialValue: currentItem.region,
          rules: [
            {
              required: true,
            },
          ],
        })(
          <Select
            placeholder="data center"
            onSearch={onSearchRegions}
            onFocus={onSearchRegions}
            loading={options.pending}
            showArrow={false}
            filterOption={false}
            showSearch
          >
            {regions.map((region, i) => (
              <Option value={region._id} key={i}>
                {region.name}
              </Option>
            ))}
          </Select>
        )}
      </FormItem>
      <FormItem label="group" {...formItemLayout}>
        {getFieldDecorator('group', {
          initialValue: currentItem.group,
          rules: [
            {
              required: true,
            },
          ],
        })(
          <Select
            placeholder="group"
            onSearch={onSearchGroups}
            onFocus={onSearchGroups}
            loading={options.pending}
            showArrow={false}
            filterOption={false}
            showSearch
            mode="tag"
          >
            {groups.map((region, i) => (
              <Option value={region._id} key={i}>
                {region.name}
              </Option>
            ))}
          </Select>
        )}
      </FormItem>
      <FormItem label="credential" hasFeedback {...formItemLayout}>
        {getFieldDecorator('credential', {
          initialValue: currentItem.credential,
          rules: [
            {
              required: false,
            },
          ],
        })(
          <Select
            placeholder="select credential"
            onSearch={onSearchGroups}
            onFocus={onSearchGroups}
            loading={options.pending}
            showArrow={false}
            filterOption={false}
            showSearch
            allowClear
          >
            {credentials.map((credential, i) => (
              <Option value={credential._id} key={i}>
                {credential.name}
              </Option>
            ))}
          </Select>
        )}
      </FormItem>
      <FormItem label="maintainer" hasFeedback {...formItemLayout}>
        {getFieldDecorator('maintainer', {
          initialValue: currentItem.maintainer,
          rules: [
            {
              required: true,
            },
          ],
        })(
          <AutoComplete
            dataSource={maintainer}
            onSearch={onSearch}
            placeholder="search username"
          />
        )}
      </FormItem>
      <FormItem label="ssh host" hasFeedback {...formItemLayout}>
        {getFieldDecorator('ssh_host', {
          initialValue: currentItem.ssh_host,
          rules: [
            {
              required: true,
            },
          ],
        })(<Input placeholder="ssh host" />)}
      </FormItem>
      <FormItem label="ssh user" hasFeedback {...formItemLayout}>
        {getFieldDecorator('ssh_user', {
          initialValue: currentItem.ssh_user,
          rules: [
            {
              required: true,
            },
          ],
        })(<Input placeholder="ssh user" />)}
      </FormItem>
      <FormItem label="ssh port" hasFeedback {...formItemLayout}>
        {getFieldDecorator('ssh_port', {
          initialValue: currentItem.ssh_port,
          rules: [
            {
              required: false,
            },
          ],
        })(<Input placeholder="ssh port" />)}
      </FormItem>
      <FormItem label="description" hasFeedback {...formItemLayout}>
        {getFieldDecorator('description', {
          initialValue: currentItem.description,
          rules: [
            {
              required: false,
            },
          ],
        })(<Input placeholder="description" />)}
      </FormItem>
      <FormItem {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          submit
        </Button>
      </FormItem>
    </Form>
  )
}

export default Form.create()(ManualForm)
