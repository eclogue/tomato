import React from 'react'
import {
  Icon,
  AutoComplete,
  Form,
  Input,
  Select,
  Collapse,
  Button,
  TreeSelect,
} from 'antd'
import { CodeMirror } from 'components'
import { stringifyYaml } from 'utils'
import styles from '../index.less'
import { color } from 'utils'

const { Panel } = Collapse
const Option = Select.Option
const FormItem = Form.Item
const InputGroup = Input.Group
const { TextArea } = Input
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
}

class Index extends React.Component {
  constructor(props) {
    super(props)
    this.form = props.form
    this.state = {
      timer: null,
      pending: props.pending,
    }
  }

  componentWillReceiveProps(props) {
    const { currentTask, taskState, pending } = props
    this.setState({ pending })
    if (currentTask && ['active', 'queued'].includes(taskState)) {
      this.setState({ pending: false })
      if (!this.state.timer) {
        const intervalId = setInterval(async () => {
          this.props.queryLog(currentTask)
          clearInterval(this.state.timer)
          this.setState({ timer: null })
        }, 2000)
        this.setState({ timer: intervalId })
      }
    } else {
      if (this.state.timer) {
        clearInterval(this.state.timer)
      }
      // this.setState({ pending: true })
    }
  }

  handleInventory(values) {
    if (!values || !values.length) {
      return
    }
    const params = {
      inventory: values,
    }

    params.inventory_type = 'cmdb'
    this.props.onSelectInventory(params)
  }

  fetchDoc() {
    this.formvalidateFields(['module'], (err, values) => {
      if (!err) {
        this.props.queryModuleDoc(values)
      }
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    this.form.validateFields((err, values) => {
      if (!err) {
        values.type = 'adhoc'
        this.props.onSubmit(values)
      }
    })
  }

  render() {
    const props = this.props
    const { form } = props
    const { getFieldDecorator } = form
    const { doc, searchModules } = props
    const { preview, searchInventory, modules } = props
    const moduleOptions = modules.map(item => {
      return (
        <Option value={item.name} key={item._id}>
          {item.name}
        </Option>
      )
    })

    const docContent = doc && typeof doc === 'object' ? stringifyYaml(doc) : doc
    const codeptions = {
      lineNumbers: false,
      readOnly: true,
      CodeMirror: 'auto',
      viewportMargin: 50,
    }

    return (
      <Form onSubmit={this.handleSubmit.bind(this)} {...formItemLayout}>
        <FormItem label="module">
          {getFieldDecorator('module', {
            initialValue: '',
            rules: [{ required: true }],
          })(
            <AutoComplete
              placeholder="Search project"
              dataSource={moduleOptions}
              onSearch={searchModules}
              loading={this.state.pending}
            >
              <Input
                suffix={
                  <Icon
                    type="search"
                    onClick={this.fetchDoc.bind(this)}
                    className="certain-category-icon"
                  />
                }
              />
            </AutoComplete>
          )}
        </FormItem>
        {!preview ? null : (
          <FormItem label="doc">
            <Collapse bordered={false}>
              <Panel header="show doc" key="1">
                <CodeMirror value={docContent} options={codeptions} />
              </Panel>
            </Collapse>
          </FormItem>
        )}
        <FormItem label="args">
          {getFieldDecorator('args', {
            initialValue: '',
            rules: [{ required: false }],
          })(
            <TextArea
              placeholder="Autosize height based on content lines"
              autosize
            />
          )}
        </FormItem>
        <FormItem label="inventory">
          {getFieldDecorator('inventory', {
            rules: [
              {
                required: true,
              },
            ],
          })(
            <TreeSelect
              treeData={props.pendingInventory}
              onFocus={() => searchInventory('')}
              onSearch={searchInventory}
              // onSelect={handleInventory}
              onChange={this.handleInventory.bind(this)}
              allowClear
              multiple
            />
          )}
        </FormItem>
        <FormItem label="private_key">
          {getFieldDecorator('private_key', {
            rules: [
              {
                required: false,
              },
            ],
          })(
            <Select placeholder="select ssh_private_key">
              {props.credentials.map(item => {
                return (
                  <Option value={item._id} key={item._id}>
                    {item.name}
                  </Option>
                )
              })}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="become">
          <InputGroup compact>
            {getFieldDecorator('become_method', {
              rules: [
                {
                  required: false,
                },
              ],
            })(
              <Select style={{ width: '25%' }} placeholder="method" allowClear>
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
              rules: [
                {
                  required: false,
                },
              ],
            })(<Input placeholder="become user" style={{ width: '75%' }} />)}
          </InputGroup>
        </FormItem>
        <FormItem label="verbosity">
          {getFieldDecorator('verbosity', {
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
        <FormItem label="more options">
          <div style={{ lineHeight: 1.5 }}>
            <CodeMirror
              value={'---\n\n\n'}
              options={{
                ...codeptions,
                theme: 'monokai',
                lineNumbers: true,
                readOnly: false,
              }}
              onChange={props.onExtraOptionsChange}
            />
          </div>
        </FormItem>
        <div className={styles.executeButton}>
          <Button type="primary" htmlType="submit" loading={this.state.pending}>
            Execute
          </Button>
        </div>
      </Form>
    )
  }
}

export default Form.create()(Index)
