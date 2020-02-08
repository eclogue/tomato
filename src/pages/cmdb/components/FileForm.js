import React from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Input,
  Select,
  message,
  Upload,
  Icon,
  Button,
  Tooltip,
  AutoComplete,
} from 'antd'

const FormItem = Form.Item
const Option = Select.Option
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
  },
}
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 20,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
}
const FileForm = ({
  onOk,
  form,
  currentItem,
  uploadProps,
  searchMaintainer,
  users,
  searchRegions,
  regions,
  credentials,
  searchCredentials,
  ...options
}) => {
  const { getFieldDecorator } = form
  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((err, values) => {
      if (err) {
        return
      }

      if (!fileList || !fileList.length) {
        return message.error('please choose inventory file upload')
      }

      values.type = 'file'
      onOk(values)
    })
  }
  const fileList = uploadProps.fileList || []
  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">inventory file</div>
    </div>
  )
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

  const onSearchCredentials = keyword => {
    if (!keyword || keyword.length < 2) {
      return
    }
    searchCredentials(keyword)
  }

  return (
    <Form layout="horizontal" id="file" onSubmit={handleSubmit}>
      <FormItem label="gregion" hasFeedback {...formItemLayout}>
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
            onSearch={onSearchCredentials}
            loading={options.pending}
            showArrow={false}
            filterOption={false}
            showSearch
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
            placeholder="input here"
          />
        )}
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
      <FormItem
        label={
          <span>
            private file &nbsp;
            <Tooltip title="choose a stardard ansible inventory file">
              <Icon type="question-circle-o" />
            </Tooltip>
          </span>
        }
        hasFeedback
        {...formItemLayout}
      >
        <div>
          <Upload {...uploadProps}>
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
        </div>
      </FormItem>
      <FormItem {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          submit
        </Button>
      </FormItem>
    </Form>
  )
}

export default Form.create()(FileForm)
