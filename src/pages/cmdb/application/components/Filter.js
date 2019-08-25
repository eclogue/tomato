import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FilterItem } from 'components';
import { Form, Button, Row, Col, DatePicker, Select, Input } from 'antd';

const { RangePicker } = DatePicker;
const Option = Select.Option;
const Search = Input.Search
const ColProps = {
  xs: 10,
  sm: 6,
  style: {
    marginBottom: 24,
    background: '#fefefe',
    display: 'inline'
  },
};

const TwoColProps = {
  ...ColProps,
  xl: 10,
};

const Filter = ({
  onFilterChange,
  onReset,
  onNew,
  filter = {},
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

    return data;
  };



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
          fields[item] = [];
        } else {
          fields[item] = undefined
        }
      }
    }
    setFieldsValue(fields)
    onReset();
  }

  const handleChange = (key, values) => {
    let fields = getFieldsValue()
    fields[key] = values
    fields = handleFields(fields)
    onFilterChange(fields)
  };

  const initialCreated = []
  if (filter.start) {
    initialCreated[0] = moment(filter.start);
  }
  if (filter.end) {
    initialCreated[1] = moment(filter.end);
  }




  return (
    <Row gutter={4} justify="start">
      <Col {...ColProps} xl={{ span: 4 }} md={{ span:4 }}>
      {getFieldDecorator('keyword', {
        initialValue: filter.keyword || '',
        rules: [
          {
            required: false,
          }
        ]
      })(
        <Search placeholder="keyword" onSearch={handleSubmit} />
      )}
      </Col>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span:4 }}>
        {getFieldDecorator('type', {
          initialValue: filter.type || undefined,
          rules: [
            {
              required: false,
            }
          ]
        })(
          <Select placeholder="app type" style={{ width: '100%' }}>
            <Option value="git" >git</Option>
            <Option value="static" >static</Option>
            <Option value="jenkins" >jenkins</Option>
            <Option value="gitlab" >gitlab</Option>
            <Option value="dcoker" >docker</Option>
          </Select>
        )}
        </Col>
        <Col {...ColProps} xl={{ span: 4 }} md={{ span:4 }}>
        {getFieldDecorator('status', {
          initialValue: filter.status || undefined,
          rules: [
            {
              required: false,
            }
          ]
        })(
          <Select placeholder="status" style={{ width: '100%' }}>
            <Option value="1" >enable</Option>
            <Option value="0" >disable</Option>
            <Option value="-1" >forbidden</Option>
          </Select>
        )}
        </Col>
        <Col {...ColProps} id="createTimeRangePicker">
          <FilterItem label="">
            {getFieldDecorator('created', { initialValue: initialCreated })(
              <RangePicker
                onChange={handleChange.bind(null, 'created')}
                getCalendarContainer={() => {
                  return document.getElementById('createTimeRangePicker')
                }}
              />
            )}
          </FilterItem>
        </Col>
        <Col {...TwoColProps} xl={{ span: 4 }} md={{ span: 4 }} sm={{ span: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div>
              <Button type="primary" className="margin-right" onClick={handleSubmit}>Search</Button>
              <Button onClick={handleReset}>Reset</Button>
            </div>
          </div>
        </Col>
        <Col style={{float: "right"}}><Button onClick={onNew}>new</Button></Col>
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
