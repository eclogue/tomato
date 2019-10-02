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
  const { inventoryContent } = props
  const logs = props.logs ? props.logs.join('\n').replace(ansiRegex(), '') : ''
  console.log('logs', logs)
  const codeptions = {
    lineNumbers: false,
    readOnly: true,
    CodeMirror: 'auto',
    viewportMargin: 50,
  }

  const appParams = template.app_params || ''
  const incomeParams = appParams.income ? Yaml.parse(appParams.income) : null
  const curlParams =
    incomeParams && typeof incomeParams === 'object'
      ? JSON.stringify(incomeParams)
      : ''

  return (
    <div>
      <Descriptions title={jobInfo.name} size="small" column={2} bordered>
        <Descriptions.Item label="Name">{jobInfo.name}</Descriptions.Item>
        <Descriptions.Item label="Type">{template.type}</Descriptions.Item>
        <Descriptions.Item label="Description" span={2}>
          <p>{template.description}</p>
          <br />
        </Descriptions.Item>
        <Descriptions.Item label="Time">
          {moment(jobInfo.created_at * 1000).format()}
        </Descriptions.Item>
        <Descriptions.Item label="Become method">
          {extra.become_method || 'None'}
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
        <Descriptions.Item label="Verbosity">
          {template.verbosity || 0}
        </Descriptions.Item>
        <Descriptions.Item label="Notification">
          {extra.Notification || null}
        </Descriptions.Item>
        <Descriptions.Item label="Inventory " span={2}>
          <CodeMirror value={inventoryContent} options={codeptions} />
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
          <Button type="primary" onClick={props.onRun}>
            Run
          </Button>
        </Descriptions.Item>
        <Descriptions.Item label="Logs" span={2}>
          {props.logs ? (
            <CodeMirror
              value={logs}
              options={{ ...codeptions, theme: 'monokai' }}
              className={styles.codeMirror}
            ></CodeMirror>
          ) : (
            ''
          )}
        </Descriptions.Item>
      </Descriptions>
    </div>
  )
}

export default Index
