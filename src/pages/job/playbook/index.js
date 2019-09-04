import React, { useState } from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Page } from 'components'
import { Form, message, Steps, Button, Icon }  from 'antd'
import AddFrom from './components/addForm'
import styles from './add.less'
import Extra from './components/Extra'
import Console from '../components/Console'

const Step = Steps.Step
const ButtonGroup = Button.Group


const Index = ({ playbookJob, dispatch }) => {
  const handleChange = console.log
  const { books, roles, currentBookshelf, inventory } = playbookJob
  const { preview, previewContent } = playbookJob
  const codeOptions = {
    lineNumbers: true,
    readOnly: false,
    CodeMirror: 'auto',
    viewportMargin: 50,
    theme: 'monokai',
  }
  const loadData = (item) => {
    const targetOption = item[item.length - 1]
    targetOption.loading = true
    dispatch({
      type: 'playbookJob/fetchEntry',
      payload: {
        id: targetOption.value,
      }
    })
  }

  const afterChangeBook = (project) => {
    const bookId = project[0]
    if (bookId) {
      dispatch({
        type: 'playbookJob/fetchEntry',
        payload: {
          id: bookId,
        }
      })
    }

    dispatch({
      type: 'playbookJob/updateState',
      payload: {
        currentBook: bookId,
      }
    })
    dispatch({
      type: 'playbookJob/fetchRoles',
      payload: {
        id: bookId,
      }
    })
  }

  const loadInventory = () => {
    if (currentBookshelf === null) {
      return message.warning('please select project')
    }
    dispatch({
      type: 'playbookJob/fetchInventory',
      payload: {
        name: currentBookshelf,
      }
    })
  }

  const handleSubmit = (params) => {
    dispatch({
      type: 'playbookJob/addJob',
      payload: {
        params: params,
      }
    })
  }

  const extraProps = {
    codeOptions: codeOptions,
    extraVars: playbookJob.extraVars,
    users: playbookJob.users,
    preview: playbookJob.preview,
    previewInventory: playbookJob.inventoryContent,
    searchUser(user) {
      dispatch({
        type: 'playbookJob/searchUser',
        payload: {
          user
        }
      })
    }
  }

  const formOptions = {
    roles,
    inventory,
    books,
    loadData,
    loadInventory,
    afterChangeBook,
    apps: playbookJob.apps,
    tags: playbookJob.tags,
    searching: playbookJob.searching,
    credentials: playbookJob.credentials,
    pendingSubset: playbookJob.pendingSubset,
    pendingInventory: playbookJob.pendingInventory,
    extraOptions: playbookJob.extraOptions,
    previewInventory(values) {
      dispatch({
        type: 'playbookJob/previewInventory',
        payload: {
          inventory: values.inventory,
          inventory_type: values.inventory_type,
        }
      })
    },
    handleExtraOptionsChange(...params){
      dispatch({
        type: 'playbookJob/updateState',
        payload: {
          extraOptions: params[2]
        }
      })
    },
    handleSearch(keyword, type=1) {
      if (keyword === null && type === 0) {
        return dispatch({
          type: 'playbookJob/searchInventory',
          payload: { keyword }
        })
      } else if ((keyword && keyword.length < 2)) {
        return
      }
      dispatch({
        type: 'playbookJob/searchInventory',
        payload: { keyword }
      })
    },
    searchSubset(keyword, params) {
      if (!playbookJob.previewContent) {
        dispatch({
          type: 'playbookJob/previewInventory',
          payload: {
            ...params
          }
        }).then(() => {
          dispatch({
            type: 'playbookJob/matchSubset',
            payload: { keyword }
          })
        })
      } else {
        dispatch({
          type: 'playbookJob/matchSubset',
          payload: { keyword }
        })
      }
    },
    inventoryTypeChange(type) {
      dispatch({
        type: 'playbookJob/updateState',
        payload: { inventoryType: type }
      })
    },
    fetchTags(params) {
      if (playbookJob.searching) {
        return
      }
      dispatch({
        type: 'playbookJob/fetchTags',
        payload: { template: params }
      })
    },
    onSelectInventory(params) {
      if (!params.length) {
        return
      }
      dispatch({
        type: 'playbookJob/previewInventory',
        payload: {
          inventory: params,
          inventory_type: playbookJob.inventoryType
        }
      })
    }
  }

  const [current, setCurrent] = useState(0)
  const [child, setChild] =  useState(null)
  const nextStep = (value) => {
    console.log('vvvvvv', value)

    if (current > value) {
      return setCurrent(value)
    }

    if (value === 1 && child && child.validateFields) {
      child.validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'playbookJob/updateState',
            payload: {
              template: values,
            }
          })
          const selectedRoles = values.roles || []
          const roleNames = []
          roles.map(role => {
            if (selectedRoles.indexOf(role._id) !== -1) {
              roleNames.push(role.name)
            }
            return role
          })
          dispatch({
            type: 'playbookJob/previewInventory',
            payload: {
              inventory: values.inventory,
              inventory_type: values.inventory_type,
            }
          }).then(() => {
            const extraVars = {
            }
            if (values.app) {
              playbookJob.apps.map(app => {
                if (app._id === values.app) {
                  extraVars[app.name + '_home'] = '{{ ECLOGUE_JOB_SPACE }}'
                }
                return app
              })
            }

            dispatch({
              type: 'playbookJob/updateState',
              payload: {
                extraVars
              }
            })
            setCurrent(value)
          })
        }
      })
    } else if (value === 2) {
      child.validateFields((err, values) => {
        if (err) {
         return
        }
        const check = value ? true : false
        dispatch({
          type: 'playbookJob/updateState',
          payload: {
            extra: values,
            searching: true,
          }
        })
        dispatch({
          type: 'playbookJob/checkJob',
          payload: {
            extra: values,
            check: check,
          }
        })
      })
    } else {
      child.validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'playbookJob/addJob',
            payload: {
              extra: values,
            }
          })
        }
      })
    }
  }
  const steps = [
    {
      title: 'Template',
      content: (
        <AddFrom handleChange={handleChange}
          submit={handleSubmit}
          ref={ref=> setChild(ref)}
          loading={playbookJob.searching}
          data={playbookJob.template}
          options={formOptions} />
      ),
    },
    {
      title: 'extra params',
      content: (
        <div>
         <Extra {...extraProps} data={playbookJob.extra} ref={ref=> setChild(ref)}/>
        </div>
      )
    },
  ]
  let action = () => {
    const actionBuntton = []
    let key = 1
    if (current < steps.length - 1) {
      actionBuntton.push(
        <Button type="primary"
          key={key++}
          onClick={() => nextStep((current + 1))}>next <Icon type="right" /></Button>)
    }

    if (current === steps.length - 1) {
      actionBuntton.push(
        <Button type="primary"
          key={key++}
          onClick={() => nextStep(current+1)}>
          preview
        </Button>
      )
      actionBuntton.push(
        <Button type="primary"
          key={key++}
          onClick={() => nextStep()}>
          save
        </Button>
      )
    }

    if (current > 0) {
      actionBuntton.unshift(
        <Button key={key++}
          onClick={() => nextStep((current - 1))}>
          <Icon type="left" />
          prev
        </Button>
      )
    }

    return actionBuntton
  }

  const drawerProps = {
    visible: preview,
    title: 'Console: ' + playbookJob.previewTitle || '',
    content: previewContent,
    closeConsole() {
      dispatch({
        type: 'playbookJob/updateState',
        payload: {
          preview: false,
        }
      })
    },
  }

  console.log('xxxxx', playbookJob.searching)
  return (
    <Page inner>
      <div>
        <div className={styles.stepTitle}>
          <Steps current={current}>
            {steps.map(item => <Step key={item.title} title={item.title} />)}
          </Steps>
        </div>
        <div className="steps-content">{steps[current].content}</div>
        <div className={styles.stepAction}>
          <ButtonGroup> {action()}</ButtonGroup>
        </div>
      </div>
      <div className={styles.consoleWindow}>
        <Console {...drawerProps} />
      </div>
    </Page>

  )
}

Index.propTypes = {
  playbookJob: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

const component = connect(({ loading, playbookJob, dispatch }) => ({ loading, playbookJob, dispatch }))(Form.create()(Index))

export default component
