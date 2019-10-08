import React, { useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { FilterItem } from 'components'
import {
  Form,
  Button,
  DatePicker,
  Select,
  Input,
  Row,
  Col,
  Tag,
  Divider,
  Icon,
} from 'antd'
import styles from './filter.less'

const Option = Select.Option
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

  const { start, end, keyword, level } = filter
  const initialCreated = []
  if (start) {
    initialCreated[0] = moment(start)
  }
  if (end) {
    initialCreated[1] = moment(end)
  }

  const levels = ['debug', 'info', 'warning', 'error', 'critical']
  const [selectedTags, setTags] = useState([])
  const handleTagChange = (tag, checked) => {
    const tags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter(t => t !== tag)
    setTags(tags)
  }

  const [logType, setLogType] = useState(filter.logType)
  const [isAdvance, setAdvance] = useState(filter.advance)
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
              {getFieldDecorator('q', { initialValue: keyword })(
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
              checked={filter.logType === 'eclogue'}
              onChange={checked => handleTagChange('eclogue', checked)}
            >
              eclogue
            </CheckableTag>
            <CheckableTag
              checked={selectedTags.indexOf('ansible') > -1}
              onChange={checked => handleTagChange('ansible', checked)}
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
                  checked={selectedTags.indexOf(tag) > -1}
                  onChange={checked => handleTagChange(tag, checked)}
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
            advance <Icon type="down" />
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
