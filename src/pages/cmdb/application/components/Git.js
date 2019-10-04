import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Tooltip, Icon } from 'antd'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 12,
  },
}

const Index = ({ form, params }) => {
  const { getFieldDecorator } = form

  return (
    <div>
      <FormItem
        {...formItemLayout}
        label={
          <span>
            repository &nbsp;
            <Tooltip title="git remote repository">
              <Icon type="question-circle-o" />
            </Tooltip>
          </span>
        }
      >
        {getFieldDecorator('params[repository]', {
          initialValue: params.repository,
          rules: [
            {
              required: true,
            },
          ],
        })(<Input placeholder="git repository address" />)}
      </FormItem>
    </div>
  )
}

export default Index
