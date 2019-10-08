import React, { useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import {
  Form,
  Button,
  DatePicker,
  Input,
  Row,
  Col,
  Tag,
  Divider,
  Icon,
} from 'antd'
import styles from './filter.less'

const { RangePicker } = DatePicker
const { CheckableTag } = Tag

const Filter = ({
  onFilterChange,
  onReset,
  filter,
  form: { getFieldDecorator, getFieldsValue, setFieldsValue },
}) => {
  const handleFields = fields => {
    const origin = Object.assign({}, fields)
    const data = {}
    for (const key in origin) {
      const value = origin[key]
      if (key === 'created' && value.length) {
        data.start = value[0].format('YYYY-MM-DD')
        data.end = value[1].format('YYYY-MM-DD')
      } else if (value || !isNaN(value)) {
        data[key] = value
      }
    }

    return data
  }

  const handleSubmit = () => {
    let fields = getFieldsValue()
    fields = handleFields(fields)
    onFilterChange(fields)
  }

  const handleReset = () => {
    const fields = getFieldsValue()
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = []
        } else {
          fields[item] = undefined
        }
      }
    }
    setFieldsValue(fields)
    onReset()
  }

  const handleChange = (key, values) => {
    let fields = getFieldsValue()
    fields[key] = values
    fields = handleFields(fields)
    onFilterChange(fields)
  }

  const { start, end, keyword } = filter
  const initialCreated = []
  if (start) {
    initialCreated[0] = moment(start)
  }
  if (end) {
    initialCreated[1] = moment(end)
  }

  const levels = ['debug', 'info', 'warning', 'error', 'critical']
  const level = filter.level ? filter.level.split(',') : []
  const cuurentType = filter.logType ? filter.logType.split(',') : []
  const [selectedLevel, setLevels] = useState(level)
  const [logTypes, setLogType] = useState(cuurentType)
  const [isAdvance, setAdvance] = useState(filter.advance)
  const handleLevelChange = (tag, checked) => {
    let tags = [...selectedLevel]
    if (checked && !tags.includes(tag)) {
      tags.push(tag)
    } else {
      tags = tags.filter(t => t !== tag)
    }

    setLevels(tags)
    if (tags.length) {
      onFilterChange({ level: tags.join(',') })
    }
  }

  const handleTypeChange = (tag, checked) => {
    let tags = [...logTypes]
    if (checked && !tags.includes(tag)) {
      tags.push(tag)
    } else {
      tags = tags.filter(t => t !== tag)
    }

    setLogType(tags)
    if (tags.length) {
      onFilterChange({ logType: tags.join(',') })
    }
  }

  const renderAdvanceFormItem = _ => {
    return (
      <div>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <Form.Item label="keyword">
              {getFieldDecorator('keyword', {
                initialValue: keyword,
                rules: [{ required: false }],
              })(<Input placeholder="keyword" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <Form.Item label="customs">
              {getFieldDecorator('q', { initialValue: filter.q })(
                <Input placeholder="query string" />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <Form.Item label="log time" id="createTimeRangePicker">
              {getFieldDecorator('created', { initialValue: initialCreated })(
                <RangePicker
                  style={{ width: '100%' }}
                  onChange={handleChange.bind(null, 'created')}
                  getCalendarContainer={() => {
                    return document.getElementById('createTimeRangePicker')
                  }}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <Form.Item>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  width: 400,
                }}
              >
                <div>
                  <Button className="margin-right" onClick={handleReset}>
                    Reset
                  </Button>
                  <Button type="primary" onClick={handleSubmit}>
                    Search
                  </Button>
                </div>
              </div>
            </Form.Item>
          </Col>
        </Row>
      </div>
    )
  }

  return (
    <div className={styles.tableListForm}>
      <Form onSubmit={handleSubmit} layout="inline">
        <Row>
          <h5 style={{ marginRight: 8, display: 'inline', fontSize: 14 }}>
            log type:
          </h5>
          <div style={{ display: 'inline', fontSize: 14 }}>
            <CheckableTag
              checked={logTypes.includes('eclogue')}
              onChange={checked => handleTypeChange('eclogue', checked)}
            >
              eclogue
            </CheckableTag>
            <CheckableTag
              checked={logTypes.indexOf('ansible') > -1}
              onChange={checked => handleTypeChange('ansible', checked)}
            >
              ansible
            </CheckableTag>
          </div>
        </Row>
        <Divider dashed />
        <Row>
          <h5 style={{ marginRight: 8, display: 'inline', fontSize: 14 }}>
            log level:
          </h5>
          <div style={{ display: 'inline' }}>
            {levels.map(tag => {
              return (
                <CheckableTag
                  key={tag}
                  checked={selectedLevel.indexOf(tag) > -1}
                  onChange={checked => handleLevelChange(tag, checked)}
                >
                  {tag}
                </CheckableTag>
              )
            })}
          </div>
        </Row>
        <Divider dashed />
        {isAdvance ? (
          renderAdvanceFormItem()
        ) : (
          <div className={styles.advance} onClick={_ => setAdvance(!isAdvance)}>
            Advance <Icon type="down" />
          </div>
        )}
      </Form>
    </div>
  )
}

Filter.propTypes = {
  form: PropTypes.object,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
}

export default Form.create()(Filter)
