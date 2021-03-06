import React from 'react'
import PropTypes from 'prop-types'
import { Button, Upload, Empty, Icon, Typography, Popconfirm } from 'antd'
import styles from './content.less'
import CodeMirror from 'components/CodeMirror'
import { stringifyYaml } from 'utils'

const { Paragraph } = Typography

const Index = ({ contentProps }) => {
  const {
    file,
    onSave,
    onChange,
    readOnly,
    onRename,
    showModal,
    showDrawer,
  } = contentProps
  const options = {
    lineNumbers: true,
    readOnly: readOnly,
    CodeMirror: 'auto',
    viewportMargin: 50,
  }
  const configOptions = Object.assign({}, options)
  configOptions.readOnly = true
  const configVariables =
    typeof file.configVariables === 'object'
      ? stringifyYaml(file.configVariables)
      : file.configVariables
  const uploadProps = {
    name: 'file',
    action: '#',
    headers: {
      authorization: 'authorization-text',
    },
    beforeUpload(file) {
      contentProps.resetFileList()
      contentProps.onAddFile({ uploader: file })
    },
    customRequest(uploader) {
      contentProps.onUpload().then(response => {
        uploader.onSuccess(response, uploader.file)
      })
    },
    onChange: function(params) {
      console.log('1111', params)
    },
  }

  const contentChange = (...params) => {
    onChange(params[2])
  }

  const codeIde = (
    <div>
      <CodeMirror
        value={file.content}
        onChange={contentChange}
        options={options}
      />
      {configVariables ? (
        <div>
          <p style={{ padding: 15 }}>### Auto register from config center:</p>
          <CodeMirror value={configVariables} options={configOptions} />
        </div>
      ) : null}
    </div>
  )

  const rename = value => {
    const params = { id: file._id, path: value }
    onRename(params)
  }

  const removeFile = event => {
    contentProps.onRemove(file._id)
  }

  return (
    <div>
      <div className={styles.contentHeader}>
        <div className={styles.file}>
          <Paragraph
            editable={{ onChange: rename }}
            underline
            type="secondary"
            style={{ display: 'inline', width: '80%' }}
          >
            {file.path}
          </Paragraph>
          <div className={styles.remove}>
            <Popconfirm
              title="Are you sure delete this file?"
              onConfirm={removeFile}
              okText="Yes"
              cancelText="No"
            >
              <Icon type="delete" />
            </Popconfirm>
          </div>
        </div>
      </div>
      <div style={{ display: 'block', minHeight: 400 }}>
        {file.is_edit ? (
          codeIde
        ) : (
          <Empty
            description={
              <span>
                <span>You can </span>
                <span
                  className={styles.create}
                  onClick={() => showModal('folder', file)}
                >
                  create foler
                </span>{' '}
                |
                <span
                  className={styles.create}
                  onClick={() => showModal('file', file, true)}
                >
                  {' '}
                  upload foler
                </span>{' '}
                |
                <span
                  className={styles.create}
                  onClick={() => showModal('file', file)}
                >
                  {' '}
                  upload file
                </span>
              </span>
            }
          ></Empty>
        )}
      </div>
      <div className={styles.contentFooter}>
        <div className={styles.leftButton}>
          <Button type="primary" onClick={onSave} disabled={!file.is_edit}>
            save
          </Button>
        </div>
        <div className={styles.leftButton}>
          <Upload {...uploadProps}>
            <Button>
              <Icon type="upload" />
              upload
            </Button>
          </Upload>
        </div>
        <div className={styles.rightButton}>
          <Button onClick={showDrawer}>
            additions
            <Icon type="more" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Index
