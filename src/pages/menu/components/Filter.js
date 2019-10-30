import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { FilterItem } from 'components'
import { Form, Button, Row, Col, DatePicker, Select, Input } from 'antd'

const { Search } = Input
const Option = Select.Option
const { RangePicker } = DatePicker
const ColProps = {
  xs: 12,
  sm: 8,
  style: {
    marginBottom: 16,
    background: '#fefefe',
  },
}

const selectStytle = {
  width: '99%',
}

const TwoColProps = {
  ...ColProps,
  xl: 12,
}

const Filter = ({
  onFilterChange,
  onReset,
  filter,
  onNew,
  form: { getFieldDecorator, getFieldsValue, setFieldsValue },
}) => {
  const handleSubmit = () => {
    const fields = getFieldsValue()
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
    onFilterChange(fields)
  }

  const { route, name, status } = filter

  return (
    <Row gutter={8} justify="start">
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
        {getFieldDecorator('name', { initialValue: name })(
          <Search placeholder="menu name" onSearch={handleSubmit} />
        )}
      </Col>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
        {getFieldDecorator('route', {
          initialValue: route,
          rules: [
            {
              required: false,
            },
          ],
        })(<Input placeholder="route" />)}
      </Col>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
        {getFieldDecorator('status', {
          initialValue: status,
          rules: [
            {
              required: false,
            },
          ],
        })(
          <Select placeholder="status" style={selectStytle} allowClear>
            <Option value={1} key="1">
              enable
            </Option>
            <Option value={0} key="0">
              disable
            </Option>
          </Select>
        )}
      </Col>
      <Col {...TwoColProps} xl={{ span: 5 }} md={{ span: 5 }} sm={{ span: 16 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <Button
              type="primary"
              className="margin-right"
              onClick={handleSubmit}
            >
              Search
            </Button>
            <Button onClick={handleReset}>Reset</Button>
          </div>
        </div>
      </Col>
      <Col style={{ float: 'right' }}>
        <Button onClick={onNew}>new</Button>
      </Col>
    </Row>
  )
}

Filter.propTypes = {
  onAdd: PropTypes.func,
  form: PropTypes.object,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
}

export default Form.create()(Filter)
