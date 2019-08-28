import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Tooltip, Icon } from 'antd'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 12,
  },
}


const Index = ({ form, params, extractType }) => {
  const { getFieldDecorator } = form

  return (
    <div>
      <FormItem {...formItemLayout} label={(<span>
        image &nbsp;
        <Tooltip title="docker image">
          <Icon type="question-circle-o" />
        </Tooltip>
      </span>)}>
        {getFieldDecorator('params[image]', {
          initialValue: params.image,
          rules: [
            {
            required: true,
            }
        ],
        })(
          <Input placeholder="docker image"/>
        )}
      </FormItem>
      <FormItem {...formItemLayout} label={(<span>
        workdir &nbsp;
        <Tooltip title="docker workdir">
          <Icon type="question-circle-o" />
        </Tooltip>
      </span>)}>
        {getFieldDecorator('params[working_dir]', {
          initialValue: params.working_dir,
          rules: [
            {
            required: extractType === 'artifacts',
            }
        ],
        })(
          <Input placeholder="docker entrypoint workdir"/>
        )}
      </FormItem>
      <FormItem {...formItemLayout} label={(<span>
        base_url &nbsp;
        <Tooltip title="docker repository address">
          <Icon type="question-circle-o" />
        </Tooltip>
        </span>)}
      >
        {getFieldDecorator('params[base_url]', {
          initialValue: params.base_url,
          rules: [
            {
            required: false,
            }
        ],
        })(
          <Input placeholder="unix://var/run/docker.sock"/>
        )}
      </FormItem>
    </div>
  )
}


export default Index
