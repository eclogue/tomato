import React, { useState } from 'react'
import { Descriptions, Tag, Form, Input, Button, Divider } from 'antd'
import moment from 'moment'
import { CodeMirror } from 'components'
import { Link } from 'dva/router'
import ansiRegex from 'ansi-regex'
import { parseYaml, stringifyYaml } from 'utils'

const Index = ({ ...props }) => {
  const jobInfo = props.jobInfo || {}
  const template = jobInfo.template || {}
  const extra = jobInfo.extra || {}
  const { inventoryContent, extraVars, extraOptions } = props
  const codeptions = {
    readOnly: false,
    CodeMirror: 'auto',
    viewportMargin: 50,
    theme: 'monokai',
  }

  const logs = props.logs ? props.logs.join('\n').replace(ansiRegex(), '') : ''
  const appParams = template.app_params || ''
  const incomeParams = appParams.income ? parseYaml(appParams.income) : null
  const curlParams =
    incomeParams && typeof incomeParams === 'object'
      ? JSON.stringify(incomeParams)
      : ''
  const extraOpt = extraOptions ? stringifyYaml(extraOptions) : ''
  const extraVar = extraVars ? stringifyYaml(extraVars) : ''
  const [optionState, setOptionState] = useState(extraOpt)
  const [varState, setVarState] = useState(extraVar)
  const handleExtraChange = (type, values) => {
    if (type === 'vars') {
      setVarState(values)
    } else {
      setOptionState(values)
    }
  }
  const genManualForm = ({ form }) => {
    const { getFieldDecorator } = form
    const handlePost = e => {
      e.preventDefault()
      form.validateFields((err, values) => {
        if (!err) {
          const variables = parseYaml(varState)
          const extraOptions = parseYaml(optionState)
          if (variables) {
            values.extraVars = variables
          }

          if (extraOptions) {
            values.extraOptions = extraOptions
          }

          props.onRun(values)
        }
      })
    }
    const bucket = []
    let key = 0
    for (const field in incomeParams) {
      key++
      bucket.push(
        <Form.Item key={key}>
          {getFieldDecorator(field.toUpperCase(), {
            rules: [{ required: true }],
          })(<Input placeholder={field} />)}
        </Form.Item>
      )
    }

    return (
      <Form
        layout="vertical"
        onSubmit={handlePost}
        style={{ maxWidth: '100%' }}
      >
        {bucket}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={props.pending}>
            Post
          </Button>
        </Form.Item>
      </Form>
    )
  }

  const ManualForm = Form.create()(genManualForm)

  return (
    <div>
      <Descriptions title={jobInfo.name} size="small" column={2} bordered>
        <Descriptions.Item label="Name">{jobInfo.name}</Descriptions.Item>
        <Descriptions.Item label="Book">
          <Link to={'/book/view?id=' + jobInfo.book_id}>
            {jobInfo.book_name}
          </Link>
        </Descriptions.Item>
        <Descriptions.Item label="Entry">{jobInfo.entry}</Descriptions.Item>
        <Descriptions.Item label="Type">{template.type}</Descriptions.Item>
        <Descriptions.Item label="App">{template.app_name}</Descriptions.Item>
        <Descriptions.Item label="Time">
          {moment(jobInfo.created_at * 1000).format()}
        </Descriptions.Item>
        <Descriptions.Item label="Description" span={2}>
          <p>{template.description}</p>
          <br />
        </Descriptions.Item>
        <Descriptions.Item label="Become method">
          {jobInfo.become_method || 'None'}
        </Descriptions.Item>
        <Descriptions.Item label="Become user">
          {jobInfo.become || 'None'}
        </Descriptions.Item>
        <Descriptions.Item label="Subset">
          {jobInfo.subset || 'None'}
        </Descriptions.Item>
        <Descriptions.Item label="Diff">
          {jobInfo.diff ? 'True' : 'False'}
        </Descriptions.Item>
        <Descriptions.Item label="Forks">
          {jobInfo.forks || 1}
        </Descriptions.Item>
        <Descriptions.Item label="Debug">
          {template.debug || 0}
        </Descriptions.Item>
        <Descriptions.Item label="roles" span={2}>
          {template.roles}
        </Descriptions.Item>
        <Descriptions.Item label="tags" span={2}>
          {template.tags
            ? template.tags.map((tag, index) => {
                return (
                  <Tag key={index} closable={false} color="cyan">
                    {tag}
                  </Tag>
                )
              })
            : null}
        </Descriptions.Item>
        <Descriptions.Item label="skip_tags" span={2}>
          {template.skip_tags
            ? template.skip_tags.map((tag, index) => {
                return (
                  <Tag key={index} closable={false} color="green">
                    {tag}
                  </Tag>
                )
              })
            : null}
        </Descriptions.Item>
        <Descriptions.Item label="notifications" span={2}>
          {Array.isArray(extra.notification) && extra.notification.length
            ? extra.notification.map((name, index) => {
                return (
                  <Tag key={index} closable={false} color="purple">
                    {name}
                  </Tag>
                )
              })
            : null}
        </Descriptions.Item>
        <Descriptions.Item label="Inventory " span={2}>
          <CodeMirror value={inventoryContent} options={codeptions} />
        </Descriptions.Item>
        <Descriptions.Item label="Extra vars" span={2}>
          <CodeMirror
            value={varState}
            options={codeptions}
            onChange={(...params) => handleExtraChange('vars', params[2])}
          />
        </Descriptions.Item>
        <Descriptions.Item label="Extra options" span={2}>
          <CodeMirror
            value={optionState}
            options={codeptions}
            onChange={(...params) => handleExtraChange('options', params[2])}
          />
        </Descriptions.Item>
        <Descriptions.Item label="Native command" span={2}>
          <p style={{ background: '#ddd', padding: 5 }}>{jobInfo.command}</p>
        </Descriptions.Item>
        <Descriptions.Item label="Webook" span={2}>
          {`curl -X POST --data '${curlParams}'`}{' '}
          {'http://127.0.0.1:5000/webhook/jobs?token=' + jobInfo.token}
        </Descriptions.Item>
        <Descriptions.Item label="Run manual" span={2}>
          <ManualForm />
        </Descriptions.Item>
      </Descriptions>
      <br />
      <Divider orientation="left">Logs</Divider>
      {props.logs ? (
        <div>
          <CodeMirror
            value={logs}
            options={{ ...codeptions, theme: 'monokai', lineNumbers: true }}
          ></CodeMirror>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default Index
