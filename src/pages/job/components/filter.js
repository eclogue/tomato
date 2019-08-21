import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { FilterItem } from 'components'
import { Form, Button, Row, Col, DatePicker, Select, Input } from 'antd'

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
}

const selectStytle = {
  width: '99%',
}

const TwoColProps = {
  ...ColProps,
  xl: 12,
};

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
  };


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

  const { status, action, name } = filter;
  let initialCreated = [];
  if (filter.created && filter.created[0]) {
    initialCreated[0] = moment(filter.created[0]);
  }
  if (filter.created && filter.created[1]) {
    initialCreated[1] = moment(filter.created[1]);
  }



  return (
    <Row gutter={8} justify="start">
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
        {getFieldDecorator('project',
          { initialValue: name })(
            <Search placeholder="Search project" onSearch={handleSubmit} />
        )}
      </Col>
      <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
          {getFieldDecorator('inventory', {
            initialValue: status,
            rules: [
              {
                required: false,
              }
            ]
          })(
            <Select placeholder="inventory"  style={selectStytle}>
              <Option value="" key="1">--</Option>
              <Option value="1" key="2">123</Option>
              <Option value="0" key="3">123-4</Option>
            </Select>
          )}
      </Col>
      <Col {...ColProps} xl={{ span: 8 }} md={{ span: 10 }} sm={{ span: 12 }} id="createTimeRangePicker">
        <FilterItem label="&nbsp;created &nbsp;">
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
