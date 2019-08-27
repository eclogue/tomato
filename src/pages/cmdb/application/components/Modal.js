import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, AutoComplete, Select, Tooltip, Icon } from 'antd'
import Jenkins from './Jenkins'
import Gitlab from './Gitlab'
import Git from './Git'
import Docker from './Docker'

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 12,
  },
}

const modal = ({
  currentItem = {},
  onOk,
  regions,
  pending,
  form,
  ...modalProps
}) => {
  const { getFieldDecorator, validateFields, getFieldsValue } = form
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        _id: currentItem._id,
      };
      onOk(data);
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  const [extractType, setExtractType] = useState(null)
  const [type, setType] = useState(currentItem.type)
  const params = currentItem.params || {}
  let extractItem = null
  if (extractType === 'docker') {
    extractItem = (
      <div>
        <FormItem {...formItemLayout} label="docker registry">
          {getFieldDecorator('params[docker_registry]', {
            initialValue: params.docker_registry,
            rules: [{
              required: true,
            }],
          })(<Input placeholder="docker container registry url"/>)}
        </FormItem>
        <FormItem {...formItemLayout} label="project path">
          {getFieldDecorator('params[docker_path]', {
            initialValue: params.docker_path,
            rules: [{
              required: true,
            }],
          })(<Input placeholder="path of project in container"/>)}
        </FormItem>
      </div>
    )
  }

  const buildTrigger = type => {
    if (type === 'jenkins') {
      return <Jenkins params={params} form={form} />
    } else if (type === 'static') {
      return (
        <FormItem {...formItemLayout} label="version">
          {getFieldDecorator('params[version]', {
            initialValue: currentItem.version,
            rules: [{
              required: true,
            }],
          })(<Input placeholder="version"/>)}
        </FormItem>
      )
    } else if (type === 'gitlabci') {
      return <Gitlab params={params} form={form}/>
    } else if (type === 'git') {
      return <Git params={params} form={form}/>
    } else if (type === 'docker') {
      return <Docker params={params} form={form}/>
    }

    return null
  }

  return (
    <Modal {...modalOpts} width="60%">
      <Form layout="horizontal">
        <FormItem label='app name' hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: currentItem.name,
            rules: [
              {
                required: true,
              },
            ],
          })(<AutoComplete onChange={modalOpts.onChange} dataSource={pending}/>)}
        </FormItem>
        <FormItem label='type' hasFeedback {...formItemLayout}>
          {getFieldDecorator('type', {
            initialValue: currentItem.type,
            rules: [
              {
                required: true,
              },
            ],
          })(
            <Select placeholder="app type" onChange={ value => setType(value)}>
              <Option value="jenkins">jenkins</Option>
              <Option value="gitlabci">gitlab</Option>
              <Option value="docker">docker</Option>
              <Option value="git">git</Option>
              <Option value="static">static</Option>
            </Select>
          )}
        </FormItem>
        {buildTrigger(type)}
        <FormItem {...formItemLayout} label="CI extract">
          {getFieldDecorator('params[extract]', {
            initialValue: params.extract,
            rules: [{
              required: true,
            }],
          })(
            <Select placeholder="extract project from" onSelect={value => setExtractType(value)}>
              <Option value="artifacts">artifacts</Option>
              <Option value="docker">docker</Option>
            </Select>
          )}
        </FormItem>
        {extractItem}
        <FormItem label='server' hasFeedback {...formItemLayout}>
          {getFieldDecorator('server', {
            initialValue: currentItem.server,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input placeholder="server address"/>)}
        </FormItem>
        <FormItem label='port' hasFeedback {...formItemLayout}>
          {getFieldDecorator('port', {
            initialValue: currentItem.port,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input placeholder="port"/>)}
        </FormItem>
        <FormItem label='protocol' hasFeedback {...formItemLayout}>
          {getFieldDecorator('protocol', {
            initialValue: currentItem.protocol,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input placeholder="protocol"/>)}
        </FormItem>
        <FormItem label='repo' hasFeedback {...formItemLayout}>
          {getFieldDecorator('repo', {
            initialValue: currentItem.repo,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input placeholder="repo address"/>)}
        </FormItem>
        <FormItem label='document address' hasFeedback {...formItemLayout}>
          {getFieldDecorator('document', {
            initialValue: currentItem.document,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input placeholder="document"/>)}
        </FormItem>
        <FormItem label='description' hasFeedback {...formItemLayout}>
          {getFieldDecorator('description', {
            initialValue: currentItem.description,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input.TextArea  rows={4} placeholder="description"/>)}
        </FormItem>
        <FormItem {...formItemLayout} label="maintainer">
          {getFieldDecorator('maintainer', {
            initialValue: currentItem.maintainer,
            rules: [{
              required: false,
            }],
          })(
            <Select placeholder="username">
              <Option value="player">player</Option>
            </Select>
          )}
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  currentItem: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
