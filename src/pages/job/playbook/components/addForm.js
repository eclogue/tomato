import React from 'react'
import PropTypes from 'prop-types'
import { Form, Select, Input, Tooltip, Row, Col, Cascader, Icon, InputNumber, TreeSelect }  from 'antd'

const FormItem = Form.Item
const InputGroup = Input.Group
const Option = Select.Option
const formItemLayout = {
  labelCol: {
    xs: { span: 10 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
}

const AddForm = ({
  handleChange,
  submit,
  form,
  options,
  data = {},
}) => {
  const { getFieldDecorator, validateFields } = form
  const handleSubmit = (e) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        submit(values)
      }
    })
  }
  console.log('inventory tree', options.pendingInventory, data.inventory)

  const inventory = options.pendingInventory.map((item, i) => {
    const value = item.collection + '@' + item._id + '@' + item.name
    return (<Option key={i} value={value}>
      <span style={{color:'#ccc', padding: 5}}>{item.collection}</span>
      <Tooltip placement="leftBottom" title={item.collection + " of "  + item.parent + " " + item.group_name}>
        {item.name}
      </Tooltip>
    </Option>)
  })

  const inventoryTree = options.pendingInventory.map((item, i) => {

  })

  const inventoryChnage = () => {
    const result = form.getFieldsValue(['inventory_type', 'inventory'])
    if (result.inventory && result.inventory_type) {
      options.previewInventory(result)
    }
  }

  const fetchTags = () => {
    validateFields((err, values) => {
      if (!err) {
        values.listtags = true
        values.listtasks = true
        options.fetchTags(values)
      }
    })
  }

  const searchSubset = (keyword) => {
    keyword = keyword || ''
    const params = form.getFieldsValue(['inventory_type', 'inventory'])
    options.searchSubset(keyword, params)
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Row gutter={12}>
        <Col span={8}>
          <FormItem {...formItemLayout} label="name">
            {getFieldDecorator('name', {
              initialValue: data.name,
              rules: [{
                required: true,
              }],
            })(
              <Input placeholder="Please select" />
            )}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem {...formItemLayout} label="description">
            {getFieldDecorator('description', {
              initialValue: data.description,
              rules: [{
                required: true,
              }],
            })(
              <Input placeholder="Please select" />
            )}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem {...formItemLayout} label="job type">
            {getFieldDecorator('type', {
              initialValue: data.type,
              rules: [{
                required: false,
              }],
            })(
              <Select placeholder="select type">
                <Option value="run">run</Option>
                <Option value="schedule">schedule</Option>
              </Select>
            )}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={12}>
        <Col span={8}>
          <FormItem {...formItemLayout} label={(<span>
            entry&nbsp;
            <Tooltip title="playbook entry file">
              <Icon type="question-circle-o" />
            </Tooltip>
            </span>)}
          >
            {getFieldDecorator('entry', {
              initialValue: data.entry,
              rules: [{
                required: true,
                type: 'array'
              }],
            })(
              <Cascader options={options.books}
                onChange={options.afterChangeBook}
                loadData={options.loadData}
                changeOnSelect
                placeholder="select entry" />
            )}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem {...formItemLayout} label="inventory">
            <InputGroup compact>
              {getFieldDecorator('inventory_type', {
                initialValue: data.inventory_type,
                rules: [{
                  required: true,
                }],
              })(
                <Select style={{ width: '30%'}}
                  placeholder="from"
                  onChange={options.inventoryTypeChange}
                >
                  <Option value="cmdb">cmdb</Option>
                  <Option value="file">file</Option>
                </Select>
              )}
              {getFieldDecorator('inventory', {
                initialValue: data.inventory,
                rules: [{
                  required: true,
                }],
              })(
                <TreeSelect treeData={options.pendingInventory}
                  style={{ width: '70%'}}
                  onFocus={() => options.handleSearch(null, 0)}
                  onSearch={options.handleSearch}
                  onChange={options.onSelectInventory}
                  allowClear
                  multiple
                />
                // <Select
                //   showSearch
                //   allowClear
                //   dropdownMatchSelectWidth={false}
                //   dataSource={inventory}
                //   placeholder="search inventory"
                //   onSearch={options.handleSearch}
                //   onFocus={() => options.handleSearch(null, 0)}
                //   onMouseLeave={inventoryChnage}
                //   style={{ width: '70%'}}
                //   onChange={options.onSelectInventory}
                //   loading={options.searching}
                // >
                //   {inventory}
                // </Select>

              )
            }
            </InputGroup>
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem {...formItemLayout} label="roles">
            {getFieldDecorator('roles', {
              initialValue: data.roles,
              rules: [{
                required: false,
                type: "array"
              }],
            })(
              <Select
                mode="multiple"
                placeholder="select type"
                onChange={handleChange}
              >
                {options.roles.map((role)=> {
                  return <Option key={role._id} value={role._id}>{role.name}</Option>
                })}
              </Select>
            )}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={12}>
        <Col span={8}>
          <FormItem {...formItemLayout} label={(<span>
            private_key&nbsp;
            <Tooltip title="ssh cennection private key">
              <Icon type="question-circle-o" />
            </Tooltip>
            </span>)}
          >
            {getFieldDecorator('private_key', {
              initialValue: data.private_key,
              rules: [{
                required: true,
              }],
            })(
              <Select placeholder="connection private_key">
                {options.credentials.map(item => {
                  return <Option value={item._id} key={item._id}>{item.name}</Option>
                })}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem {...formItemLayout} label={(<span>
            app&nbsp;
            <Tooltip title="bind app you build before. For example jenkins build result eg.">
              <Icon type="question-circle-o" />
            </Tooltip>
            </span>)}
          >
            {getFieldDecorator('app', {
              initialValue: data.app,
              rules: [{
                required: false,
              }],
            })(
              <Select
                placeholder="select app"
              >
                {options.apps.map(app => {
                  return (
                    <Option value={app._id} key={app._id}>
                      {app.name}<span style={{color:"#ddd", paddingLeft: 10}}>{app.type}</span>
                    </Option>
                  )
                })}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem {...formItemLayout} label={(<span>
            vault pass&nbsp;
            <Tooltip title="The secret for vault decrypt. if your file is encrypted you need load vault_pass">
              <Icon type="question-circle-o" />
            </Tooltip>
            </span>)}
          >
            {getFieldDecorator('vault', {
              initialValue: data.vault_pass,
              rules: [{
                required: false,
              }],
            })(
              <Select placeholder="vault pass">
                <Option value={1}>vault pass</Option>
              </Select>
            )}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={12}>
        <Col span={8}>
          <FormItem {...formItemLayout} label="tags">
            {getFieldDecorator('tags', {
              initialValue: data.tags || [],
              rules: [{
                required: false,
                type: 'array'
              }],
            })(
              <Select
                placeholder="select tags"
                mode="multiple"
                onFocus={fetchTags}
                loading={options.searching}
                showArrow={false}
                filterOption={false}
              >
                {options.tags.map((tag, key) => (
                  <Option value={tag} key={key}>{tag}</Option>
                ))}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem {...formItemLayout} label="skip tags">
            {getFieldDecorator('stkip_tags', {
              initialValue: data.skip_tags || [],
              rules: [{
                required: false,
              }],
            })(
              <Select
                mode="multiple"
                placeholder="select skip_tags"
                loading={options.searching}
              >
              {options.tags.map((tag, key) => (
                <Option value={tag} key={key}>{tag}</Option>
              ))}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem {...formItemLayout} label="limit/subset">
            {getFieldDecorator('limit', {
              initialValue: data.limit,
              rules: [{
                required: false,
              }],
            })(
              <Select placeholder="select limit"
                showSearch
                mode="multiple"
                onSearch={searchSubset}
                showArrow={false}
                filterOption={false}
              >
                {options.pendingSubset.map((item, key) => {
                  return <Option value={item} key={key}>{item}</Option>
                })}
              </Select>
            )}
          </FormItem>
        </Col>
      </Row>

      <Row gutter={12}>
        <Col span={8}>
        <FormItem {...formItemLayout} label="become">
            <InputGroup compact>
              {getFieldDecorator('become_method', {
                initialValue: data.become_method,
                rules: [{
                  required: false,
                }],
              })(
                <Select style={{ width: '30%'}}
                  placeholder="method"
                >
                  <Option value="sudo">sudo</Option>
                  <Option value="su">su</Option>
                  <Option value="pbrun">pbrun</Option>
                  <Option value="pfexec">pfexec</Option>
                  <Option value="doas">doas</Option>
                  <Option value="dzdo">dzdo</Option>
                  <Option value="ksu">ksu</Option>
                  <Option value="runas">runas</Option>
                  <Option value="pmrun">pmrun</Option>
                  <Option value="enable">enable</Option>
                  <Option value="machinectl">machinectl</Option>
                </Select>
              )}
              {getFieldDecorator('become_user', {
                initialValue: data.become_user,
                rules: [{
                  required: false,
                }],
              })(
                <Input placeholder="become user" style={{ width: '70%'}}/>
              )
            }
            </InputGroup>
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem {...formItemLayout} label="timeout">
            {getFieldDecorator('timeout', {
              rules: [{
                required: false,
                initialValue: data.timeout || 10,
              }],
            })(
              <Input placeholder="timeout" />
            )}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem {...formItemLayout} label="forks">
            {getFieldDecorator('forks', {
              initialValue: 5,
              rules: [{
                required: false,
                type: "number"
              }],
            })(
              <InputNumber min={1} max={100}/>
            )}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={12}>
        <Col span={8}>
          <FormItem {...formItemLayout} label="args">
            {getFieldDecorator('args', {
                rules: [{
                  required: false,
                  initialValue: data.args,
                }],
              })(
                <Input placeholder='args' />
              )}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem {...formItemLayout} label="diff">
            {getFieldDecorator('diff', {
              initialValue: data.diff || 0,
              rules: [{
                required: false,
              }],
            })(
              <Select placeholder="select type">
                <Option value={0}>False</Option>
                <Option value={1}>True</Option>
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem {...formItemLayout} label={(<span>
            parallel&nbsp;
            <Tooltip title="Maximum number of worker concurrent">
              <Icon type="question-circle-o" />
            </Tooltip>
            </span>)}
          >
            {getFieldDecorator('parallel', {
              initialValue: data.parallel || 1,
              rules: [{
                required: false,
              }],
            })(
              <InputNumber min={1} />
            )}
          </FormItem>
        </Col>
      </Row>
    </Form>
  )
}

AddForm.propTypes = {
  form: PropTypes.object,
  handleSubmit: PropTypes.func,
  handleChange: PropTypes.func,
  options: PropTypes.object
}

export default Form.create()(AddForm)

