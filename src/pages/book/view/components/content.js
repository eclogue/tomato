import React from 'react'
import PropTypes from 'prop-types';
import { Button, Upload, Empty, Icon, Typography, Popconfirm } from 'antd'
import styles from './content.less'
import CodeMirror from 'components/CodeMirror'
import Yaml from 'yaml'

const { Paragraph } = Typography;

const Index = ({
  contextProps
}) => {
  const {
    file,
    onSave,
    onChange,
    readOnly,
    onRename,
    showModal,
    showDrawer,
  } = contextProps
  const options = {
    lineNumbers: true,
    readOnly: readOnly,
    CodeMirror: 'auto',
    viewportMargin: 50,
  }
  const configOptions = Object.assign({}, options)
  configOptions.readOnly = true
  const configVariables = typeof file.configVariables === 'object' ? Yaml.stringify(file.configVariables): file.configVariables
  const uploadProps = {
    name: 'file',
    action: '#',
    headers: {
      authorization: 'authorization-text'
    },
    beforeUpload(file) {
      contextProps.resetFileList()
      contextProps.onAddFile({ uploader: file })
    },
    customRequest(uploader) {
      contextProps.onUpload()
        .then(response => {
          uploader.onSuccess(response, uploader.file)
        })
    },
    onChange: function(params) {
      console.log('1111',params)
    },
  }

  const contentChange = (...params) => {
    onChange(params[2])
  }

  const codeIde = (
    <div>
      <CodeMirror value={file.content} onChange={contentChange} options={options} />
      {configVariables ?
        <div>
          <p style={{padding: 15 }}>### Auto register from config center:</p>
          <CodeMirror value={configVariables} options={configOptions} />
        </div> : null}
    </div>

  )


  const rename = (value) => {
    const params = { id: file._id, path: value}
    onRename(params)
  }

  const removeFile = (event) => {
    contextProps.onRemove(file._id)
  }

  return (
    <div >
      <div className={styles.contentHeader}>
        <div className={styles.file}>
          <Paragraph editable={{ onChange: console.log }}
            underline
            type="secondary"
            style={{display: "inline", width: '80%'}}
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
      <div style={{display: 'block', minHeight: 400}}>
        { file.is_edit ? codeIde :
         <Empty >
          <Button onClick={() => showModal('folder', file)}>
          <Icon type="folder" />create folder
          </Button>
          <Button onClick={() => showModal('file', file)}>
            <Icon type="upload" />upload file
          </Button>
         </Empty>
        }
      </div>
      <div className={styles.contentFooter}>
        <div className={styles.leftButton}>
          <Button type="primary" onClick={onSave}>save</Button>
        </div>
        <div className={styles.leftButton}>
          <Upload {...uploadProps}>
            <Button>
              <Icon type="upload" />upload
            </Button>
          </Upload>
        </div>
        <div className={styles.rightButton}>
          <Button onClick={showDrawer}>
            additions<Icon type="more" />
          </Button>
        </div>
      </div>
    </div>
  )
}


export default Index
