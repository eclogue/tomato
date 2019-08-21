import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Select, Input, Button, Row, Col, Icon, Tooltip, Radio, InputNumber }  from 'antd'
import { CodeMirror } from 'components'

const FormItem = Form.Item
const InputGroup = Input.Group
const Option = Select.Option
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group
const formItemLayout = {
  labelCol: {
    xs: { span: 16 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 10 },
  },
}

const Deploy = ({ handleChange, submit, form, options, data = {} }) => {
  const { getFieldDecorator, validateFields } = form
  const handleSubmit = (e) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        submit(values)
      }
    });
  }
  const [ci, setCI] = useState('none')
  const checkCIItem = ({target}) => {
    const value = target.value
    setCI(value)
  }

  const getItems = () => {
    const jenkins = (
      <div>
        <FormItem label={(<span>
          baseurl &nbsp;
          <Tooltip title="jenkins base url">
            <Icon type="question-circle-o" />
          </Tooltip>
          </span>)}
        >
          {getFieldDecorator('base_url', {
            initialValue: data.base_url,
            rules: [
              {
              required: true,
              }
          ],
          })(
            <Input placeholder="jenkins base url"/>
          )}
        </FormItem>
        <FormItem label={(<span>
          username &nbsp;
          <Tooltip title="jenkins username">
            <Icon type="question-circle-o" />
          </Tooltip>
        </span>)}>
          {getFieldDecorator('username', {
            initialValue: data.username,
            rules: [
              {
              required: true,
              }
          ],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem label={(<span>
          password &nbsp;
          <Tooltip title="jenkins password">
            <Icon type="question-circle-o" />
          </Tooltip>
        </span>)}>
          {getFieldDecorator('password', {
            initialValue: data.password,
            rules: [
              {
              required: true,
              }
          ],
          })(
            <Input type="password" placeholder="jenkins password"/>
          )}
        </FormItem>
        <FormItem label="Job Name">
          {getFieldDecorator('jobname', {
            initialValue: data.jobname,
            rules: [{
              required: true,
            }],
          })(<Input placeholder="job name"/>)}
        </FormItem>
      </div>
    )

    const gitlabCi = (
      <div>
        <FormItem label={(<span>
          baseurl &nbsp;
          <Tooltip title="jenkins base url">
            <Icon type="question-circle-o" />
          </Tooltip>
          </span>)}
        >
          {getFieldDecorator('base_url', {
            rules: [
              {
              required: true,
              }
          ],
          })(
            <Input placeholder="jenkins base url"/>
          )}
        </FormItem>
        <FormItem label={(<span>
          username &nbsp;
          <Tooltip title="jenkins username">
            <Icon type="question-circle-o" />
          </Tooltip>
        </span>)}>
          {getFieldDecorator('username', {
            rules: [
              {
              required: true,
              }
          ],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem label={(<span>
          password &nbsp;
          <Tooltip title="jenkins password">
            <Icon type="question-circle-o" />
          </Tooltip>
        </span>)}>
          {getFieldDecorator('password', {
            rules: [
              {
              required: true,
              }
          ],
          })(
            <Input type="password" placeholder="jenkins password"/>
          )}
        </FormItem>
        <FormItem label="Job Name">
          {getFieldDecorator('jobname', {
            rules: [{
              required: true,
            }],
          })(<Input />)}
        </FormItem>
      </div>
    )

    if (ci === 'jenkins') {
      return jenkins
    } else if (ci === 'gitlab-ci') {
      return gitlabCi
    }
  }

  return (
    <Form {...formItemLayout}>
    <FormItem label="CI type">
      {getFieldDecorator('ciType', {
        initialValue: data.ciType || '',
        rules: [{
          required: true,
        }],
      })(
        <RadioGroup onChange={checkCIItem} checked={ci}>
          <Radio value="jenkins">Jenkins</Radio>
          <Radio value="gitlab-ci">Gitlab-ci</Radio>
          <Radio value="drone">Drone</Radio>
          <Radio value="none">None</Radio>
        </RadioGroup>
      )}
    </FormItem>
      {getItems(ci)}
    <FormItem label={(<span>
      Archive&nbsp;
      <Tooltip title="level 0 is fastest and more space">
        <Icon type="question-circle-o" />
      </Tooltip>
      </span>)}
    >
      {getFieldDecorator('archive', {
        initialValue: data.archive,
        rules: [{
          required: false,
        }],
      })(
        <Select placeholder="archive level">
          <Option key={1} value={0}>0</Option>
          <Option key={1} value={1}>1</Option>
          <Option key={1} value={2}>2</Option>
        </Select>
      )}
    </FormItem>
    <FormItem label="repo">
      <InputGroup compact>
        {getFieldDecorator('repo_type', {
          initialValue: data.repoType,
          rules: [{
            required: false,
            initialValue: 'git'
          }],
        })(
          <Select style={{ width: '20%'}}>
            <Option value="git">git</Option>
            <Option value="svn">snv</Option>
          </Select>
        )}
        {getFieldDecorator('repo', {
          initialValue: data.repo,
          rules: [{
            required: false,
          }],
        })(
          <Input placeholder="Select Address" style={{ width: '70%'}}/>
        )}
      </InputGroup>
    </FormItem>

  </Form>
  )
}

Deploy.propTypes = {
  form: PropTypes.object,
  handleSubmit: PropTypes.func,
  handleChange: PropTypes.func,
  options: PropTypes.object
}

export default Form.create()(Deploy)

