import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FilterItem } from 'components';
import { Form, Button, Row, Col, DatePicker, Select, Input, AutoComplete, Icon } from 'antd';
// import './filter.css'
const { Search } = Input;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const ColProps = {
  xs: 12,
  sm: 8,
  style: {
    marginBottom: 16,
    background: '#fefefe',
  },
};

const selectStytle = {
  width: '99%',
};

const TwoColProps = {
  ...ColProps,
  xl: 12,
};

const Filter = ({
  onFilterChange,
  onReset,
  filter,
  onAdd,
  form: {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
  },
  regions,
  groups,
}) => {
  const handleFields = (fields) => {
    const origin = Object.assign({}, fields);
    const data = {};
    for(const key in origin) {
      const value = origin[key];
      if (key === 'created' && value.length) {
        data.start = value[0].format('YYYY-MM-DD');
        data.end = value[1].format('YYYY-MM-DD');
      } else if (value || !isNaN(value)) {
        data[key] = value;
      }
    }

    return data;
  }

  const handleSubmit = () => {
    let fields = getFieldsValue();
    fields = handleFields(fields);
    onFilterChange(fields);
  }

  const handleReset = () => {
    const fields = getFieldsValue();
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = [];
        } else {
          fields[item] = undefined;
        }
      }
    }
    setFieldsValue(fields);
    onReset();
  }

  const handleChange = (key, values) => {
    let fields = getFieldsValue();
    fields[key] = values;
    fields = handleFields(fields);
    onFilterChange(fields);
  };

  const initialCreated = [];
  if (filter.start) {
    initialCreated[0] = moment(filter.start);
  }
  if (filter.end) {
    initialCreated[1] = moment(filter.end);
  }

  return (
    <Row gutter={4} justify="start">
      <Col {...ColProps} xl={{ span: 3 }} md={{ span: 8 }}>
      {getFieldDecorator('hostname',
          { initialValue: filter.hostanme })(
            <Search placeholder="hostname" onSearch={handleSubmit} />
      )}
      </Col>
      <Col {...ColProps} xl={{ span: 3 }} md={{ span: 8}}>
        {getFieldDecorator('region', {
          initialValue: filter.region,
          style: { width: '100%' },
          rules: [
            {
              required: false,
            }
          ]
        })(
          <Select placeholder="region" style={selectStytle} allowClear>
            {regions.map((item, index) => {
                return <Option value={item._id} key={index}>{item.name}</Option>
            })}
          </Select>
        )}
      </Col>
      <Col {...ColProps} xl={{ span: 3 }} md={{ span: 8 }}>
          {getFieldDecorator('group', {
            initialValue: filter.group,
            rules: [
              {
                required: false,
              }
            ]
          })(
            <Select placeholder="group" style={selectStytle} allowClear>
              {groups.map((item, index) => {
                  return <Option value={item._id} key={index}>{item.name}</Option>
              })}
            </Select>
          )}
      </Col>
      <Col {...ColProps} xl={{ span: 2 }} md={{ span: 2 }}>
          {getFieldDecorator('status', {
            initialValue: filter.status,
            rules: [
              {
                required: false,
              }
            ]
          })(
            <Select placeholder="status" style={selectStytle} allowClear>
              <Option value="1">active</Option>
              <Option value="0">disable</Option>
              <Option value="-1">unreachable</Option>
            </Select>
          )}
      </Col>
      <Col {...ColProps} xl={{ span: 6 }} md={{ span: 8 }} sm={{ span: 12 }} id="createTimeRangePicker">
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
      <Col {...TwoColProps} xl={{ span: 4 }} md={{ span: 4 }} sm={{ span: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div>
            <Button type="primary" className="margin-right" onClick={handleSubmit}>Search</Button>
            <Button onClick={handleReset}>Reset</Button>
          </div>
        </div>
      </Col>
      <Button type="primary" icon="file-add" onClick={onAdd} style={{float: "right"}}>
        add
      </Button>
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
