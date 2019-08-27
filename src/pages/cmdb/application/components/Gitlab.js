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


const Index = ({ form, params, extractType, setExtractType }) => {
  const { getFieldDecorator } = form
  const income = {
    'job_id': '{{ JOB_ID }}'
  }

  return (
    <div>
      <FormItem {...formItemLayout} label={(<span>
        baseurl &nbsp;
        <Tooltip title="gitlab api base url">
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
          <Input placeholder="gitlab base url"/>
        )}
      </FormItem>
      <FormItem {...formItemLayout} label={(<span>
        token &nbsp;
        <Tooltip title="gitlab api access token">
          <Icon type="question-circle-o" />
        </Tooltip>
      </span>)}>
        {getFieldDecorator('params[token]', {
          initialValue: params.token,
          rules: [
            {
            required: true,
            }
        ],
        })(
          <Input placeholder="gitlab access token"/>
        )}
      </FormItem>
      <FormItem {...formItemLayout} label={(<span>
        project ID &nbsp;
        <Tooltip title="gitlab project id">
          <Icon type="question-circle-o" />
        </Tooltip>
      </span>)}>
        {getFieldDecorator('params[project_id]', {
          initialValue: params.project_id,
          rules: [
            {
            required: true,
            }
        ],
        })(
          <Input placeholder="gitlab project ID"/>
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="income params">
        <div style={{lineHeight: 1.5}}><CodeMirror value={stringObject(income)} /></div>
      </FormItem>
    </div>
  )
}


export default Index
