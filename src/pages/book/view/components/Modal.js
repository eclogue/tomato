import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Upload, Icon, message } from 'antd'

const FormItem = Form.Item
const Dragger = Upload.Dragger

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 18,
  },
}

const modal = ({
  item = {},
  onOk,
  onAddFile,
  form: { getFieldDecorator, validateFields, getFieldsValue },
  ...modalProps
}) => {
  const handleOk = () => {
    const data = {
      id: item._id,
      action: item.action,
      path: item.path,
    }
    if (item.action === 'upload') {
      onOk({ data })
    } else {
      validateFields((errors, values) => {
        if (errors) {
          return
        }

        onOk(Object.assign(data, values))
      })
    }
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  const showCreateFolder = () => (
    <div>
      <Form layout="horizontal">
        <FormItem label="文件夹名" hasFeedback {...formItemLayout}>
          {getFieldDecorator('folder', {
            initialValue: '',
            rules: [
              {
                required: true,
              },
            ],
          })(<Input addonBefore={<div>{item.path}</div>} width="100%" />)}
        </FormItem>
      </Form>
    </div>
  )

  // const uploadProps = {
  //   name: 'file',
  //   // multiple: true,
  //   directory: true,
  //   action: '#',
  //   customRequest(uploader) {
  //     onAddFile(uploader).then(response => {
  //       uploader.onSuccess(response, uploader.file)
  //     })
  //     return {
  //       abort() {
  //         console.log('upload progress is aborted.')
  //       },
  //     }
  //   },
  //   onChange(info) {
  //     const status = info.file.status
  //     if (status !== 'uploading') {
  //       console.log(info.file, info.fileList)
  //     }

  //     if (status === 'done') {
  //       message.success(`${info.file.name} file uploaded successfully.`)
  //     } else if (status === 'error') {
  //       message.error(`${info.file.name} file upload failed.`)
  //     }
  //   },
  // }
  console.log('modal upload props::::::', modalProps)
  const uploadProps = {
    name: 'file',
    multiple: true,
    action: '/',
    directory: modalProps.directory,
    showUploadList: true,
    beforeUpload(uploader) {
      onAddFile({ uploader })
      return false
    },
    onRemove(file) {
      console.log(file)
      modalProps.onRemove(file)
    },
    onChange(info) {
      const status = info.file.status
      if (status !== 'uploading') {
      } else if (status === 'done') {
        message.success(`${info.file.name} uploaded successfully.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} upload failed.`)
      }
      if (status === 'removed') {
        // resetFileList()
      }
    },
  }
  const showUploadFile = () => (
    <Dragger {...uploadProps}>
      <p className="ant-upload-drag-icon">
        <Icon type="inbox" />
      </p>
      <p className="ant-upload-text">点击或者拖动文件到此处</p>
      <p className="ant-upload-hint">支持单个或者多个文件</p>
    </Dragger>
  )

  return (
    <Modal {...modalOpts} style={{ height: 400, minWidth: 720 }}>
      {item.action === 'folder' ? showCreateFolder() : showUploadFile()}
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
