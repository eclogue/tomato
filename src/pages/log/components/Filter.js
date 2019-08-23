import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FilterItem } from 'components';
import { Form, Button, DatePicker, Select, Input } from 'antd';

const { Search } = Input;
const Option = Select.Option;
const { RangePicker } = DatePicker;

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

  const { start, end, keyword, level, logType } = filter;
  const initialCreated = [];
  if (start) {
    initialCreated[0] = moment(start)
  }
  if (end) {
    initialCreated[1] = moment(end)
  }

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 20 },
    layout: 'inline',
    style: {
      margin: 10
    }
  }
  return (
    <Form {...formItemLayout} onSubmit={handleSubmit}>
      <Form.Item  style={{width: 200}}>
        {getFieldDecorator('logType', {
          initialValue: logType,
          rules: [{ required: false }],
        })(
          <Select placeholder="select log type" allowClear>
            <Option value="eclogue">eclogue</Option>
            <Option value="ansible">ansible</Option>
          </Select>
        )}
      </Form.Item>
      <Form.Item  style={{width: 200}}>
        {getFieldDecorator('level', {
          initialValue: level,
          rules: [{ required: false}],
        })(
          <Select placeholder="select log level" allowClear={true}>
            <Option value="notice">notice</Option>
            <Option value="debug">debug</Option>
            <Option value="info">info</Option>
            <Option value="warning">warning</Option>
            <Option value="error">error</Option>
            <Option value="critical">critical</Option>
          </Select>
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('keyword',{
          initialValue: keyword,
          rules: [{ required: false}],
        })(
            <Input placeholder="keyword" />
        )}
      </Form.Item>
      <Form.Item style={{width: 400}}>
        {getFieldDecorator('q', { initialValue: keyword })(
            <Input placeholder="query string" />
        )}
      </Form.Item>
      <Form.Item {...Form.ItemProps} xl={{ span: 8 }} md={{ span: 10 }} sm={{ span: 12 }} id="createTimeRangePicker">
        <FilterItem label="&nbsp; &nbsp;">
          {getFieldDecorator('created', { initialValue: initialCreated })(<RangePicker
            style={{ width: '100%' }}
            onChange={handleChange.bind(null, 'created')}
            getCalendarContainer={() => {
              return document.getElementById('createTimeRangePicker')
            }}
          />)}
        </FilterItem>
      </Form.Item>
      <Form.Item >
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', width: 200 }}>
          <div>
            <Button type="primary" className="margin-right" onClick={handleSubmit}>Search</Button>
            <Button onClick={handleReset}>Reset</Button>
          </div>
        </div>
      </Form.Item>
    </Form>
  )
}

Filter.propTypes = {
  form: PropTypes.object,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
}

export default Form.create()(Filter)
