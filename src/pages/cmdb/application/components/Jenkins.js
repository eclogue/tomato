import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Tooltip, Icon } from 'antd'
import { CodeMirror } from 'components'
import stringObject from 'stringify-object'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 12,
  },
}


const Index = ({ form, params, onChangeIncome }) => {
  const { getFieldDecorator } = form
  const income = {
    'build_id': '{{ BUILD_ID }}'
  }

  return (
    <div>
      <FormItem {...formItemLayout} label={(<span>
        baseurl &nbsp;
        <Tooltip title="jenkins base url">
          <Icon type="question-circle-o" />
        </Tooltip>
        </span>)}
      >
        {getFieldDecorator('params[base_url]', {
          initialValue: params.base_url,
          rules: [
            {
            required: true,
            }
        ],
        })(
          <Input placeholder="jenkins base url"/>
        )}
      </FormItem>
      <FormItem {...formItemLayout} label={(<span>
        username &nbsp;
        <Tooltip title="jenkins username">
          <Icon type="question-circle-o" />
        </Tooltip>
      </span>)}>
        {getFieldDecorator('params[username]', {
          initialValue: params.username,
          rules: [
            {
            required: true,
            }
        ],
        })(
          <Input />
        )}
      </FormItem>
      <FormItem {...formItemLayout} label={(<span>
        password &nbsp;
        <Tooltip title="jenkins password">
          <Icon type="question-circle-o" />
        </Tooltip>
      </span>)}>
        {getFieldDecorator('params[password]', {
          initialValue: params.password,
          rules: [
            {
            required: true,
            }
        ],
        })(
          <Input type="password" placeholder="jenkins password"/>
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="Job Name">
        {getFieldDecorator('params[job_name]', {
          initialValue: params.job_name,
          rules: [{
            required: true,
          }],
        })(<Input placeholder="job name"/>)}
      </FormItem>
    </div>
  )
}


export default Index
