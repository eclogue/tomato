import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { FilterItem } from 'components'
import { Form, Button, Row, Col, DatePicker, Select, Input } from 'antd'

const { Search } = Input
const Option = Select.Option
const { RangePicker } = DatePicker
const ColProps = {
  xs: 6,
  sm: 6,
  style: {
    marginBottom: 12,
    background: '#fefefe',
  },
}

const selectStytle = {
  width: '99%',
}

const TwoColProps = {
  ...ColProps,
  xl: 6,
}

const Filter = ({
  onFilterChange,
  onReset,
  filter,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
  },
}) => {
  const handleFields = (fields) => {
    const origin = Object.assign({}, fields)
    const data = {}
    for(const key in origin) {
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

  const initialCreated = []
  if (filter.start) {
    initialCreated[0] = moment(filter.start)
  }
  if (filter.end) {
    initialCreated[1] = moment(filter.end)
  }


  return (
    <Row gutter={8} justify="start">
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 6 }}>
        {getFieldDecorator('keyword',
          { initialValue: filter.name })(
            <Search placeholder="Search keyword" onSearch={handleSubmit} />
        )}
      </Col>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 6 }}>
        {getFieldDecorator('type', {
            initialValue: filter.type,
            rules: [
              {
                required: false,
              }
            ]
        })(
          <Select placeholder="type"  style={selectStytle} allowClear>
            <Option value="adhoc">adhoc</Option>
            <Option value="playbook">playbook</Option>
          </Select>
        )}
      </Col>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
        {getFieldDecorator('status', {
            initialValue: filter.status,
            rules: [
              {
                required: false,
              }
            ]
        })(
          <Select placeholder="status"  style={selectStytle} allowClear>
            <Option value="1">enable</Option>
            <Option value="0">disable</Option>
            <Option value="-1">fatal</Option>
          </Select>
        )}
      </Col>
      <Col {...ColProps} xl={{ span: 6 }} md={{ span: 12 }} sm={{ span: 14 }} id="createTimeRangePicker">
        <FilterItem label="">
          {getFieldDecorator('created', { initialValue: initialCreated })(<RangePicker
            style={{ width: '100%' }}
            onChange={handleChange.bind(null, 'created')}
            getCalendarContainer={() => {
              return document.getElementById('createTimeRangePicker')
            }}
          />)}
        </FilterItem>
      </Col>
      <Col {...TwoColProps} xl={{ span: 5 }} md={{ span: 5 }} sm={{ span: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div>
            <Button type="primary" className="margin-right" onClick={handleSubmit}>Search</Button>
            <Button onClick={handleReset}>Reset</Button>
          </div>
        </div>
      </Col>
    </Row>
  )
}

// Filter.propTypes = {
//   onAdd: PropTypes.func,
//   form: PropTypes.object,
//   filter: PropTypes.object,
//   onFilterChange: PropTypes.func,
// }

export default Form.create()(Filter)
