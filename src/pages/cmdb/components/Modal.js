import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Select, Modal, Tabs, message } from 'antd'
import FileForm from './FileForm'
import ManualForm from './ManualForm'

const FormItem = Form.Item
const Option = Select.Option
const TabPane = Tabs.TabPane
const modal = ({
  currentItem = {},
  onOk,
  onAddFile,
  resetFileList,
  targetTab = 1,
  fileList = [],
  regions,
  groups,
  searchRegions,
  searchGroups,
  searchMaintainer,
  ...modalProps
}) => {
  console.log('==========', regions, groups)
  const handleOk = () => {
    // validateFields((errors) => {
    //   if (errors) {
    //     return
    //   }
    //   console.log('ooooooojbk', getFieldsValue())
    //   const data = {
    //     ...getFieldsValue(),
    //     id: currentItem.id,
    //   };
    //   onOk(data);
    // })
  }

  const uploadProps = {
    name: 'file',
    multiple: false,
    action: '/',
    fileList: fileList,
    listType: "picture-card",
    customRequest(uploader) {
      onAddFile({uploader})
    },

    onChange(info) {
      const status = info.file.status;
      if (status !== 'uploading') {
      } else if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
      if (status === 'removed') {
        resetFileList()
      }
    },
  }

  return (
    <Modal footer={null} visible={modalProps.visible} onCancel={modalProps.onCancel}>
      <Tabs defaultActiveKey="file">
        <TabPane tab="import by inventory" key="file">
          <FileForm uploadProps={uploadProps}
            searchMaintainer={searchMaintainer}
            users={modalProps.users}
            searchRegions={searchRegions}
            regions={regions}
            currentItem={currentItem}
            onOk={onOk}
            pending={modalProps.pending}
            credentials={modalProps.credentials}
            searchCredentials={modalProps.searchCredentials}
          />
        </TabPane>
        <TabPane tab="manual" key="manual">
          <ManualForm onOk={onOk}
            searchMaintainer={searchMaintainer}
            searchRegions={searchRegions}
            searchGroups={searchGroups}
            users={modalProps.users}
            regions={regions}
            groups={groups}
            currentItem={currentItem}
            pending={modalProps.pending}
            credentials={modalProps.credentials}
            searchCredentials={modalProps.searchCredentials}
          />
        </TabPane>
      </Tabs>
    </Modal>
  )
}

modal.propTypes = {
  // form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default modal
