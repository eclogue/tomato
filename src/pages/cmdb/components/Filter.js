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
  platforms,
  agents,
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

  const platformBucket = [<Option value="0" key="0">select platfrom</Option>];
  const agentBucket = [<Option value="0" key="0">select agent</Option>];
  for (const key in platforms) {
    const item = platforms[key];
    platformBucket.push(<Option value={item.id} key={key+1}>{item.alias}</Option>);
  }

  for (const key in agents) {
    const item = agents[key];
    agentBucket.push(<Option value={item.id} key={key+1}>{item.name}</Option>)
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

  let initialCreated = [];
  if (filter.created && filter.created[0]) {
    initialCreated[0] = moment(filter.created[0]);
  }
  if (filter.created && filter.created[1]) {
    initialCreated[1] = moment(filter.created[1]);
  }

  const handleSearch = value => {
    console.log(value)
  }

  const dataSource = []

  const renderOption = item => {
    return (
      <Option key={item.category} text={item.category}>
        <div className="global-search-item">
          <span className="global-search-item-desc">
            {item.query} 在
            <a
              href={`https://s.taobao.com/search?q=${item.query}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.category}
            </a>
            区块中
          </span>
          <span className="global-search-item-count">约 {item.count} 个结果</span>
        </div>
      </Option>
    );
  }

  return (
    <Row gutter={4} justify="start">
      <Col {...ColProps} xl={{ span: 3 }} md={{ span: 8 }}>
        {getFieldDecorator('hostname', {
          initialValue: filter.hostname
        })(
          <AutoComplete
            style={selectStytle}
            dataSource={dataSource.map(renderOption)}
            onSearch={handleSearch}
            placeholder="hostname or ip"
            optionLabelProp="text"
          >
            <Input suffix={
                <Icon type="search" />
            }/>
          </AutoComplete>
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
          <Select placeholder="region" style={selectStytle}>
            {platformBucket}
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
            <Select placeholder="group" style={selectStytle}>
              {agentBucket}
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
            <Select placeholder="status" style={selectStytle}>
              <Option value="">--</Option>
              <Option value="active">active</Option>
              <Option value="disable">disable</Option>
              <Option value="unknown">unknown</Option>
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
