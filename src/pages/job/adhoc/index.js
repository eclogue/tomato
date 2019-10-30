import React from 'react'
import { Page } from 'components'
import { connect } from 'dva'
import {
  Icon,
  Layout,
  AutoComplete,
  Form,
  Input,
  Select,
  Button,
  Tooltip,
  Tree,
  InputNumber,
  TreeSelect,
} from 'antd'
import Yaml from 'yaml'
import { CodeMirror } from 'components'
import styles from './index.less'

const { Sider, Content } = Layout
const Option = Select.Option
const FormItem = Form.Item
const { TextArea } = Input
const InputGroup = Input.Group
const ButtonGroup = Button.Group

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
}

const Index = ({ dispatch, adhoc, form }) => {
  const { modules, result, preview, pending } = adhoc
  const { users = [], currentItem = {} } = adhoc
  const { template = {}, extra = {} } = currentItem
  const { schedule = {} } = extra
  const inventoryTree = adhoc.inventoryTree
  const { getFieldDecorator, validateFields } = form
  const resultCotent =
    result && typeof result === 'object' ? Yaml.stringify(result) : ''
  const codeptions = {
    lineNumbers: false,
    readOnly: true,
    CodeMirror: 'auto',
    viewportMargin: 50,
  }

  const queryModuleDoc = () => {
    validateFields(['module'], (err, values) => {
      if (!err) {
        dispatch({
          type: 'adhoc/queryDoc',
          payload: {
            ...values,
          },
        })
      }
    })
  }

  const handleSearchUser = username => {
    console.log(username)
  }

  const searchModules = keyword => {
    if (pending) {
      return false
    }

    dispatch({
      type: 'adhoc/searchModules',
      payload: {
        keyword,
      },
    })
  }

  const searchInventory = keyword => {
    if (pending) {
      return false
    }

    dispatch({
      type: 'adhoc/searchInventory',
      payload: {
        keyword,
      },
    })
  }

  const onSelectInventory = () => {
    const result = form.getFieldsValue(['inventory'])
    if (!result.inventory) {
      return
    }
    result.inventory_type = 'cmdb'
    dispatch({
      type: 'adhoc/previewInventory',
      payload: {
        ...result,
      },
    })
  }

  const handleSubmit = (check = true) => {
    form.validateFields((err, values) => {
      if (!err) {
        values.type = 'adhoc'
        values.check = check
        dispatch({
          type: 'adhoc/addJob',
          payload: values,
        })
      }
    })
  }

  const moduleOptions = modules.map(item => {
    return (
      <Option value={item.name} key={item._id}>
        {item.name}
      </Option>
    )
  })

  const handleExtraOptionsChange = (...params) => {
    dispatch({
      type: 'playbookJob/updateState',
      payload: {
        extraOptions: params[2],
      },
    })
  }

  return (
    <Page inner>
      <Layout className={styles.layout}>
        <Content className={styles.content}>
          <Form {...formItemLayout}>
            <FormItem {...formItemLayout} label="name">
              {getFieldDecorator('name', {
                initialValue: currentItem.name,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input placeholder="name" />)}
            </FormItem>
            <FormItem label="module">
              {getFieldDecorator('module', {
                initialValue: template.module,
                rules: [{ required: true }],
              })(
                <AutoComplete
                  placeholder="search command"
                  dataSource={moduleOptions}
                  onSearch={searchModules}
                  loading={pending}
                >
                  <Input
                    suffix={
                      <Icon
                        type="search"
                        onClick={queryModuleDoc}
                        className="certain-category-icon"
                      />
                    }
                  />
                </AutoComplete>
              )}
            </FormItem>
            <FormItem label="args">
              {getFieldDecorator('args', {
                initialValue: template.args,
                rules: [{ required: false }],
              })(<TextArea placeholder="module args" autosize />)}
            </FormItem>
            <FormItem label="inventory">
              {getFieldDecorator('inventory', {
                initialValue: template.inventory,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(
                <TreeSelect
                  treeData={adhoc.pendingInventory}
                  onFocus={() => searchInventory('')}
                  onSearch={searchInventory}
                  onSelect={onSelectInventory}
                  allowClear
                  multiple
                />
              )}
            </FormItem>
            <FormItem label="private_key">
              {getFieldDecorator('private_key', {
                initialValue: template.private_key,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(
                <Select placeholder="select ssh_private_key">
                  {adhoc.credentials.map(item => {
                    return (
                      <Option value={item._id} key={item._id}>
                        {item.name}
                      </Option>
                    )
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="description">
              {getFieldDecorator('description', {
                initialValue: currentItem.description,
                rules: [
                  {
                    required: false,
                  },
                ],
              })(<TextArea placeholder="description" autosize />)}
            </FormItem>
            <FormItem label="enable">
              {getFieldDecorator('status', {
                initialValue: currentItem.status,
                rules: [{ required: true }],
              })(
                <Select placeholder="choose to enable or disable">
                  <Option value={1}>enable</Option>
                  <Option value={0}>disable</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="become">
              <InputGroup compact>
                {getFieldDecorator('become_method', {
                  initialValue: currentItem.become_method,
                  rules: [
                    {
                      required: false,
                    },
                  ],
                })(
                  <Select
                    style={{ width: '25%' }}
                    placeholder="method"
                    allowClear
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
                  initialValue: currentItem.become_user,
                  rules: [
                    {
                      required: false,
                    },
                  ],
                })(
                  <Input placeholder="become user" style={{ width: '75%' }} />
                )}
              </InputGroup>
            </FormItem>
            <FormItem {...formItemLayout} label="notification">
              {getFieldDecorator('notification', {
                initialValue: currentItem.notification || 'web',
                rules: [
                  {
                    required: false,
                  },
                ],
              })(
                <Select placeholder="notification" allowClear mode="multiple">
                  <Option value="wechat">wechat</Option>
                  <Option value="slack">slack</Option>
                  <Option value="smtp">email</Option>
                  <Option value="sms">sms</Option>
                  <Option value="web">web</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="maintainer">
              {getFieldDecorator('maintainer', {
                initialValue: currentItem.maintainer,
                rules: [
                  {
                    required: false,
                  },
                ],
              })(
                <Select
                  showSearch
                  allowClear
                  dropdownMatchSelectWidth={false}
                  placeholder="search user"
                  onSearch={handleSearchUser}
                  // onFocus={options.searchUser}
                  mode="multiple"
                  loading={pending}
                >
                  {users.map((user, key) => (
                    <Option value={user.username} key={key}>
                      {user.username}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="schedule"
              helper="crontab format"
            >
              <InputGroup compact>
                {getFieldDecorator('schedule[minute]', {
                  initialValue: schedule.minute,
                  rules: [
                    {
                      required: false,
                    },
                  ],
                })(<Input placeholder="minute" style={{ width: '20%' }} />)}
                {getFieldDecorator('schedule[hour]', {
                  initialValue: schedule.hour,
                  rules: [
                    {
                      required: false,
                    },
                  ],
                })(<Input placeholder="hour" style={{ width: '20%' }} />)}
                {getFieldDecorator('schedule[day]', {
                  initialValue: schedule.day,
                  rules: [
                    {
                      required: false,
                    },
                  ],
                })(<Input placeholder="day" style={{ width: '20%' }} />)}
                {getFieldDecorator('schedule[month]', {
                  initialValue: schedule.month,
                  rules: [
                    {
                      required: false,
                    },
                  ],
                })(<Input placeholder="month" style={{ width: '20%' }} />)}
                {getFieldDecorator('schedule[day_of_week]', {
                  initialValue: schedule.day_of_week,
                  rules: [
                    {
                      required: false,
                    },
                  ],
                })(
                  <Input placeholder="day of week" style={{ width: '20%' }} />
                )}
              </InputGroup>
            </FormItem>
            <FormItem label="verbosity">
              {getFieldDecorator('verbosity', {
                initialValue: template.verbosity,
                rules: [
                  {
                    required: false,
                  },
                ],
              })(
                <Select placeholder="debug level">
                  <Option value={0} key={1}>
                    0
                  </Option>
                  <Option value={1} key={1}>
                    1
                  </Option>
                  <Option value={2} key={2}>
                    2
                  </Option>
                  <Option value={3} key={3}>
                    3
                  </Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="more options">
              <div style={{ lineHeight: 1.5 }}>
                <CodeMirror
                  value={'---\n\n\n'}
                  options={{
                    ...codeptions,
                    theme: 'monokai',
                    lineNumbers: true,
                    readOnly: false,
                  }}
                  onChange={handleExtraOptionsChange}
                />
              </div>
            </FormItem>
            <div className={styles.executeButton}>
              <ButtonGroup>
                <Button
                  type="primary"
                  onClick={() => handleSubmit()}
                  loading={pending}
                >
                  preview
                </Button>
                <Button
                  type="primary"
                  onClick={() => handleSubmit(false)}
                  loading={pending}
                >
                  save
                </Button>
              </ButtonGroup>
            </div>
          </Form>
          {preview && resultCotent ? (
            <div>
              <CodeMirror value={resultCotent} options={codeptions} />
            </div>
          ) : null}
        </Content>
        <Sider className={styles.sider}>
          <div className={styles.buildHistory}>Inventory preview</div>
          <Tree
            showLine
            defaultExpandAll={true}
            defaultExpandParent
            treeData={inventoryTree}
          ></Tree>
        </Sider>
      </Layout>
    </Page>
  )
}

export default connect(({ dispatch, adhoc }) => ({ dispatch, adhoc }))(
  Form.create()(Index)
)
