import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Input,
  Modal,
  Upload,
  Select,
  Icon,
  Button,
  Tooltip,
  message,
} from 'antd'

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({
  currentItem = {},
  onOk,
  onAddFile,
  onRemoveFile,
  pending,
  users,
  form: { getFieldDecorator, validateFields, getFieldsValue },
  ...modalProps
}) => {
  const [importType, setImportType] = useState(
    currentItem.import_type || 'manual'
  )
  const handleOk = () => {
    validateFields(errors => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        id: currentItem.id,
      }
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    width: '60%',
    onOk: handleOk,
  }

  const uploadProps = {
    name: 'file',
    multiple: false,
    action: '#',
    fileList: modalProps.fileList,
    onRemove: file => {
      onRemoveFile(file)
    },
    beforeUpload(file) {
      onAddFile(file)
      return false
    },
    customRequest() {
      return {
        abort() {
          message.error('upload progress is aborted.')
        },
      }
    },
    onChange(info) {
      const status = info.file.status
      if (status !== 'uploading') {
        console.log('status', status, info.file, info.fileList)
      }

      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
  }

  const onSearch = keyword => {
    if (!keyword || keyword.length < 2) {
      return false
    }

    modalProps.searchUser(keyword)
  }

  const playbookNode = type => {
    if (type === 'manual') {
      return (
        <FormItem
          label={
            <span>
              upload playbook&nbsp;
              <Tooltip title="select playbook directory">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
          hasFeedback
          {...formItemLayout}
        >
          <Upload {...uploadProps} directory>
            <Button>
              <Icon type="upload" /> Upload Directory
            </Button>
          </Upload>
        </FormItem>
      )
    } else {
      return (
        <FormItem
          label={
            <span>
              galaxy repo&nbsp;
              <Tooltip title="select playbook directory">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
          hasFeedback
          {...formItemLayout}
        >
          {getFieldDecorator('repo', {
            initialValue: currentItem.galaxy_repo,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input placeholder="galaxy repo" />)}
        </FormItem>
      )
    }
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="name" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: currentItem.name,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input placeholder="book name" />)}
        </FormItem>
        <FormItem label="description" hasFeedback {...formItemLayout}>
          {getFieldDecorator('description', {
            initialValue: currentItem.description,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input placeholder="book description" />)}
        </FormItem>
        <FormItem label="maintainer" hasFeedback {...formItemLayout}>
          {getFieldDecorator('maintainer', {
            initialValue: currentItem.maintainer,
            rules: [
              {
                required: false,
              },
            ],
          })(
            <Select
              onSearch={onSearch}
              showArrow={false}
              filterOption={false}
              showSearch
              mode="multiple"
              placeholder="search username"
            >
              {users.map((user, i) => (
                <Option value={user.username} key={i}>
                  {user.username}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="status" hasFeedback {...formItemLayout}>
          {getFieldDecorator('status', {
            initialValue: currentItem.status || 1,
            rules: [
              {
                required: true,
              },
            ],
          })(
            <Select placeholder="status">
              <Option value={1} key={1}>
                enable
              </Option>
              <Option value={0} key={2}>
                disable
              </Option>
            </Select>
          )}
        </FormItem>
        <FormItem label="import playbook" hasFeedback {...formItemLayout}>
          {getFieldDecorator('importType', {
            initialValue: currentItem.import_type,
            rules: [
              {
                required: false,
              },
            ],
          })(
            <Select placeholder="import playbook" onSelect={setImportType}>
              <Option value="manual">manual</Option>
              <Option value="galaxy">galaxy</Option>
            </Select>
          )}
        </FormItem>
        {playbookNode(importType)}
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
