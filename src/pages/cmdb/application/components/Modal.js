import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, AutoComplete, Select, Tooltip, Icon } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 12,
  },
};

const modal = ({
  currentItem = {},
  onOk,
  regions,
  pending,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        _id: currentItem._id,
      };
      onOk(data);
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  const [extractType, setExtractType] = useState(null)
  const [type, setType] = useState(currentItem.type)
  const buildTrigger = type => {
    const params = currentItem.params || {}
    let extractItem = null
    if (extractType === 'docker') {
      extractItem = (
        <div>
          <FormItem {...formItemLayout} label="docker registry">
            {getFieldDecorator('params[docker_registry]', {
              initialValue: params.docker_registry,
              rules: [{
                required: true,
              }],
            })(<Input placeholder="docker container registry url"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="project path">
            {getFieldDecorator('params[docker_path]', {
              initialValue: params.docker_path,
              rules: [{
                required: true,
              }],
            })(<Input placeholder="path of project in container"/>)}
          </FormItem>
        </div>
      )
    }

    if (type === 'jenkins') {
      return (
        <div>
          <FormItem {...formItemLayout} label={(<span>
            baseurl &nbsp;
            <Tooltip title="jenkins base url">
              <Icon type="question-circle-o" />
            </Tooltip>
            </span>)}
          >
            {getFieldDecorator('params[base_url]', {
              initialValue: params.base_url,
              rules: [
                {
                required: true,
                }
            ],
            })(
              <Input placeholder="jenkins base url"/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={(<span>
            username &nbsp;
            <Tooltip title="jenkins username">
              <Icon type="question-circle-o" />
            </Tooltip>
          </span>)}>
            {getFieldDecorator('params[username]', {
              initialValue: params.username,
              rules: [
                {
                required: true,
                }
            ],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={(<span>
            password &nbsp;
            <Tooltip title="jenkins password">
              <Icon type="question-circle-o" />
            </Tooltip>
          </span>)}>
            {getFieldDecorator('params[password]', {
              initialValue: params.password,
              rules: [
                {
                required: true,
                }
            ],
            })(
              <Input type="password" placeholder="jenkins password"/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="Job Name">
            {getFieldDecorator('params[job_name]', {
              initialValue: params.job_name,
              rules: [{
                required: true,
              }],
            })(<Input placeholder="job name"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="CI extract">
            {getFieldDecorator('params[extract]', {
              initialValue: params.extract,
              rules: [{
                required: true,
              }],
            })(
              <Select placeholder="extract project from" onSelect={value => setExtractType(value)}>
                <Option value="artifacts">artifacts</Option>
                <Option value="docker">docker</Option>
              </Select>
            )}
          </FormItem>
          {extractItem}
        </div>
      )
    } else if (type === 'static') {
      return (
        <FormItem {...formItemLayout} label="version">
          {getFieldDecorator('params[version]', {
            initialValue: currentItem.version,
            rules: [{
              required: true,
            }],
          })(<Input placeholder="version"/>)}
        </FormItem>
      )
    } else if (type === 'gitlabci') {
      return (
        <div>
          <FormItem {...formItemLayout} label={(<span>
            baseurl &nbsp;
            <Tooltip title="gitlab api base url">
              <Icon type="question-circle-o" />
            </Tooltip>
            </span>)}
          >
            {getFieldDecorator('params[base_url]', {
              initialValue: currentItem.base_url,
              rules: [
                {
                required: true,
                }
            ],
            })(
              <Input placeholder="gitlab base url"/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={(<span>
            token &nbsp;
            <Tooltip title="gitlab api access token">
              <Icon type="question-circle-o" />
            </Tooltip>
          </span>)}>
            {getFieldDecorator('params[token]', {
              initialValue: currentItem.token,
              rules: [
                {
                required: true,
                }
            ],
            })(
              <Input placeholder="gitlab access token"/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={(<span>
            project ID &nbsp;
            <Tooltip title="gitlab project id">
              <Icon type="question-circle-o" />
            </Tooltip>
          </span>)}>
            {getFieldDecorator('params[project_id]', {
              initialValue: currentItem.project_id,
              rules: [
                {
                required: true,
                }
            ],
            })(
              <Input placeholder="gitlab project ID"/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="CI extract">
            {getFieldDecorator('params[extract]', {
              initialValue: currentItem.extract,
              rules: [{
                required: true,
              }],
            })(
              <Select placeholder="extract project from" onSelect={value => setExtractType(value)}>
                <Option value="artifacts">artifacts</Option>
                <Option value="docker">docker</Option>
              </Select>
            )}
          </FormItem>
          {extractItem}
        </div>
      )
    } else if (type === 'git') {
      return <FormItem {...formItemLayout} label={(<span>
        repository &nbsp;
        <Tooltip title="git remote repository">
          <Icon type="question-circle-o" />
        </Tooltip>
      </span>)}>
        {getFieldDecorator('params[repository]', {
          initialValue: currentItem.token,
          rules: [
            {
            required: true,
            }
        ],
        })(
          <Input placeholder="git repository address"/>
        )}
      </FormItem>
    } else if (type === 'docker') {
      return (
        <div>
          <FormItem {...formItemLayout} label={(<span>
            image &nbsp;
            <Tooltip title="docker image">
              <Icon type="question-circle-o" />
            </Tooltip>
          </span>)}>
            {getFieldDecorator('params[image]', {
              initialValue: currentItem.image,
              rules: [
                {
                required: true,
                }
            ],
            })(
              <Input placeholder="docker image"/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={(<span>
            workdir &nbsp;
            <Tooltip title="docker workdir">
              <Icon type="question-circle-o" />
            </Tooltip>
          </span>)}>
            {getFieldDecorator('params[working_dir]', {
              initialValue: currentItem.working_dir,
              rules: [
                {
                required: extractType === 'artifacts',
                }
            ],
            })(
              <Input placeholder="docker entrypoint workdir"/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={(<span>
            base_url &nbsp;
            <Tooltip title="docker repository address">
              <Icon type="question-circle-o" />
            </Tooltip>
            </span>)}
          >
            {getFieldDecorator('params[base_url]', {
              initialValue: currentItem.base_url,
              rules: [
                {
                required: false,
                }
            ],
            })(
              <Input placeholder="unix://var/run/docker.sock"/>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="extract">
            {getFieldDecorator('params[extract]', {
              initialValue: currentItem.extract,
              rules: [{
                required: true,
              }],
            })(
              <Select placeholder="extract project from" onSelect={value => setExtractType(value)}>
                <Option value="artifacts">artifacts</Option>
                <Option value="docker">docker</Option>
              </Select>
            )}
          </FormItem>
          {extractItem}
        </div>
      )
    }

    return null
  }

  return (
    <Modal {...modalOpts} width="60%">
      <Form layout="horizontal">
        <FormItem label='app name' hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: currentItem.name,
            rules: [
              {
                required: true,
              },
            ],
          })(<AutoComplete onChange={modalOpts.onChange} dataSource={pending}/>)}
        </FormItem>
        <FormItem label='type' hasFeedback {...formItemLayout}>
          {getFieldDecorator('type', {
            initialValue: currentItem.type,
            rules: [
              {
                required: true,
              },
            ],
          })(
            <Select placeholder="app type" onChange={ value => setType(value)}>
              <Option value="jenkins">jenkins</Option>
              <Option value="gitlabci">gitlab</Option>
              <Option value="docker">docker</Option>
              <Option value="git">git</Option>
              <Option value="static">static</Option>
            </Select>
          )}
        </FormItem>
        {buildTrigger(type)}
        <FormItem label='server' hasFeedback {...formItemLayout}>
          {getFieldDecorator('server', {
            initialValue: currentItem.server,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input placeholder="server address"/>)}
        </FormItem>
        <FormItem label='port' hasFeedback {...formItemLayout}>
          {getFieldDecorator('port', {
            initialValue: currentItem.port,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input placeholder="port"/>)}
        </FormItem>
        <FormItem label='protocol' hasFeedback {...formItemLayout}>
          {getFieldDecorator('protocol', {
            initialValue: currentItem.protocol,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input placeholder="protocol"/>)}
        </FormItem>
        <FormItem label='repo' hasFeedback {...formItemLayout}>
          {getFieldDecorator('repo', {
            initialValue: currentItem.repo,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input placeholder="repo address"/>)}
        </FormItem>
        <FormItem label='document address' hasFeedback {...formItemLayout}>
          {getFieldDecorator('document', {
            initialValue: currentItem.document,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input placeholder="document"/>)}
        </FormItem>
        <FormItem label='description' hasFeedback {...formItemLayout}>
          {getFieldDecorator('description', {
            initialValue: currentItem.description,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input.TextArea  rows={4} placeholder="description"/>)}
        </FormItem>
        <FormItem {...formItemLayout} label="maintainer">
          {getFieldDecorator('maintainer', {
            initialValue: currentItem.maintainer,
            rules: [{
              required: false,
            }],
          })(
            <Select placeholder="username">
              <Option value="player">player</Option>
            </Select>
          )}
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  currentItem: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
