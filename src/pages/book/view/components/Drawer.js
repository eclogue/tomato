import React from 'react'
import { Drawer, Form, Input, Select, Button } from 'antd';

const FormItem = Form.Item
const Option = Select.Option
const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 14
  },
}
const Index = ({visible, closeDrawer, showDrawer, currentItem, form, ...options }) => {
  const {getFieldDecorator, validateFields} = form
  const submitFile = (e) => {
    e.preventDefault()
    validateFields((err, values) => {
      if (!err) {
        options.updateFile(values)
      }
    });
  }
  const makeForm = () => {
    const bucket = []
    bucket.push(
      <div key={0}>
        <FormItem label="marked" hasFeedback {...formItemLayout}>
          {getFieldDecorator('role', {
            initialValue: currentItem.role,
            rules: [
              {
                required: true,
              },
            ],
            })(<Input placeholder="marked" />)
          }
        </FormItem>
        <FormItem label="is_edit" hasFeedback {...formItemLayout}>
          {getFieldDecorator('is_edit', {
            initialValue: currentItem.is_edit ? 1 : 0,
            rules: [
              {
                required: true,
              },
            ],
            })(
              <Select placeholder="is_edit">
                <Option value={1}>true</Option>
                <Option value={0}>false</Option>
              </Select>
            )}
        </FormItem>
        <FormItem label="is_dir" hasFeedback {...formItemLayout}>
          {getFieldDecorator('is_dir', {
            initialValue: currentItem.is_dir ? 1 : 0,
            rules: [
              {
                required: false,
              },
            ],
            })(
              <Select placeholder="is_dir" disabled={!!currentItem.content}>
                <Option value={1}>true</Option>
                <Option value={0}>false</Option>
              </Select>
            )}
        </FormItem>
        <FormItem label="is_encrypt" hasFeedback {...formItemLayout}>
          {getFieldDecorator('is_encrypt', {
            initialValue: currentItem.is_encrypt ? 1 : 0,
            rules: [
              {
                required: false,
              },
            ],
            })(
              <Select placeholder="is_encrypt" disabled>
                <Option value={1}>true</Option>
                <Option value={0}>false</Option>
              </Select>
            )}
        </FormItem>
      </div>
    )

    if (currentItem.project) {
      bucket.push(<FormItem label="project" hasFeedback {...formItemLayout} key={currentItem.project}>
        {getFieldDecorator('project', {
          initialValue: currentItem.project,
          rules: [
            {
              required: true,
            },
          ],
          })(
            <Input placeholder="project" />
          )}
      </FormItem>)
    }

    if (currentItem.is_edit && !currentItem.is_encrypt) {
      bucket.push(<FormItem label="vault_pass" hasFeedback {...formItemLayout} key="vault">
        {getFieldDecorator('vault_pass', {
          initialValue: currentItem.project,
          rules: [
            {
              required: false,
            },
          ],
          })(
            <Input placeholder="encrypt with vault_pass" />
          )}
      </FormItem>)
    }

    if (currentItem.parent === '/group_vars') {
      bucket.push(<FormItem label="register vars" hasFeedback {...formItemLayout} key={currentItem.parent}>
        {getFieldDecorator('register', {
          initialValue: currentItem.register,
          rules: [
            {
              required: false,
            },
          ],
          })(
            <Select placeholder="register vars"
              mode="multiple"
              onSearch={options.searchConfig}
              // onChange={options.registerConfig}
            >
              {options.configs.map(config => {
                return <Option key={config._id} value={config._id}>{config.name}</Option>
              })}
            </Select>
          )}
      </FormItem>)
    }
    return bucket
  }
  return (
    <div>
      <Drawer
        title="File addition"
        placement="right"
        onClose={closeDrawer}
        visible={visible}
        mask={false}
        width={500}
      >
        <Form layout="horizontal" onSubmit={submitFile}>
          {makeForm()}
          <div style={{display: 'block', textAlign: 'center'}}>
            <FormItem>
              <Button htmlType="submit" className="login-form-button">update</Button>
            </FormItem>
          </div>

        </Form>

      </Drawer>
    </div>
  )
}

export default Form.create()(Index)
