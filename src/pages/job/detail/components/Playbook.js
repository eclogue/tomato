import React from 'react'
import { Descriptions, Tag, Form, Input, Button } from 'antd'
import moment from 'moment'
import StringObject from 'stringify-object'
import { CodeMirror } from 'components'
import Yaml from 'yaml'
import ansiRegex from 'ansi-regex'
import styles from './code.less'

const Index = ({ ...props }) => {
  const jobInfo = props.jobInfo || {}
  const template = jobInfo.template || {}
  const extra = jobInfo.extra || {}
  const { inventoryContent, extraVars } = props

  const codeptions = {
    lineNumbers: false,
    readOnly: false,
    CodeMirror: 'auto',
    viewportMargin: 50,
  }

  const logs = props.logs ? props.logs.join('\n').replace(ansiRegex(), '') : ''
  const appParams = template.app_params || ''
  const incomeParams = appParams.income ? Yaml.parse(appParams.income) : null
  const curlParams =
    incomeParams && typeof incomeParams === 'object'
      ? JSON.stringify(incomeParams)
      : ''
  const genManualForm = ({ form }) => {
    const { getFieldDecorator } = form
    const handlePost = e => {
      e.preventDefault()
      form.validateFields((err, values) => {
        if (!err) {
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
      <Form layout="inline" onSubmit={handlePost}>
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
        <Descriptions.Item label="Book">{jobInfo.book_name}</Descriptions.Item>
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
          {extra.notification
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
          <CodeMirror value={extraVars} options={codeptions} />
        </Descriptions.Item>
        <Descriptions.Item label="Extra options" span={2}>
          <div>
            {template.extraOptions ? StringObject(template.extraOptions) : null}
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="Webook" span={2}>
          {`curl -X POST --data '${curlParams}'`}{' '}
          {'http://127.0.0.1:5000/webhook/jobs?token=' + jobInfo.token}
        </Descriptions.Item>
        <Descriptions.Item label="Run manual" span={2}>
          <ManualForm />
        </Descriptions.Item>
        <Descriptions.Item label="Logs" span={2}>
          {props.logs ? (
            <div>
              <CodeMirror
                className={styles.codeMirror}
                value={logs}
                options={{ ...codeptions, theme: 'monokai' }}
              ></CodeMirror>
            </div>
          ) : (
            ''
          )}
        </Descriptions.Item>
      </Descriptions>
    </div>
  )
}

export default Index
