import React from 'react'
import { Drawer } from 'antd'
import { CodeMirror } from 'components'
import { parseYaml, stringifyYaml } from 'utils'

const Index = ({
  visible,
  closeDrawer,
  showDrawer,
  previewContent,
  codeOptions = {},
  ...options
}) => {
  let codeValue = ''
  if (previewContent) {
    const previewText =
      typeof previewContent == 'string'
        ? parseYaml(previewContent)
        : previewContent
    codeValue = stringifyYaml(previewText) || ''
  }

  const codeOriginOptions = {
    lineNumbers: true,
    readOnly: true,
    CodeMirror: 'auto',
    viewportMargin: 50,
    theme: 'monokai',
  }

  codeOptions = Object.assign({}, codeOriginOptions, codeOptions)
  options.height = options.height || 350
  options.bodyStyle = Object.assign(
    { height: 300, overflow: 'scroll' },
    options.style || {}
  )

  return (
    <div>
      <Drawer
        title={options.title || '*'}
        placement="bottom"
        onClose={closeDrawer}
        visible={visible}
        mask={false}
        style={{ backgroundColor: 'black', overflow: 'scroll' }}
        bodyStyle={options.bodyStyle}
        {...options}
      >
        <CodeMirror value={codeValue} options={codeOptions} />
      </Drawer>
    </div>
  )
}

export default Index
