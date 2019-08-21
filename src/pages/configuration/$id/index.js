import React from 'react'
import { connect } from 'dva'
import { Page, CodeMirror } from 'components'
import PropTypes from 'prop-types'
import Yaml from 'yaml'
import { Empty } from 'antd'
import styles from './index.less'


const Index = ({ configDetail, dispatch, loading, location }) => {

  const { users, currentItem } = configDetail
  const options = {
    lineNumbers: true,
    readOnly: true,
    CodeMirror: 'auto',
    viewportMargin: 40,
  }
  let variables = currentItem.variables
  let content = ''
  if (variables && typeof variables === 'object') {
    content = Yaml.stringify(variables)
  }

  return (
   <Page inner loading={loading}>
    <div className={styles.content}>
      <div className={styles.item}>
        <div>Name</div>
        <div>{currentItem.name}</div>
      </div>
      <div className={styles.item}>
        <div>Status</div>
        <div>{currentItem.status ? 'enable' : 'disable'}</div>
      </div>
      <div className={styles.item}>
        <div>Time</div>
        <div>{currentItem.created_at}</div>
      </div>
      <div className={styles.item}>
        <div>Description</div>
        <div>{currentItem.description}</div>
      </div>
      <div className={styles.item}>
        <div>Maintainer:</div>
        <div>{currentItem.maintainer}</div>
      </div>

      <div className={styles.item}>
        <div>Variables</div>
        <div>
        {content ?
          <CodeMirror value={content} options={options} />
          : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        }
        </div>
      </div>
    </div>
   </Page>
  )
}

Index.props = {
  configDetail: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object
}

export default connect(({ configDetail, loading, dispatch }) => ({ configDetail, loading, dispatch }))(Index)
