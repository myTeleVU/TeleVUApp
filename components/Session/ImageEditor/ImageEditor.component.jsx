import React from 'react'
import ImageEditor from '@toast-ui/react-image-editor'
import SaveIcon from '@mui/icons-material/Save'
import { useTranslation } from 'react-i18next'
import SettingButton from '../CallBar/SettingButton.component'
import PropTypes from 'prop-types'
import { theme } from '../../../styles/theme.style'
import { MdCancel } from 'react-icons/md'
import { SideBarContext } from '../../../context/Shared/SideBar.context'

import 'tui-image-editor/dist/tui-image-editor.css'
import styles from './ImageEditor.module.scss'
import './ImageEditor.extra.scss'

export const MyImageEditor = ({
  currentImage = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  closeImageEditor,
  saveImage,
  openDrawer
}) => {
  const { t } = useTranslation()
  const imageEditorRef = React.useRef(null)
  const { isMobile } = React.useContext(SideBarContext)
  const onSaveImage = () => {
    const editorInstance = imageEditorRef.current.getInstance()
    const image = editorInstance.toDataURL()
    saveImage(image)
    closeImageEditor()
    openDrawer()
  }

  return (
    <div className={styles.imageEditor}>
      <div className={styles.imageEditor__menu}>
        <div className={styles.imageEditor__buttons}>
          <SettingButton
            buttonAction={onSaveImage}
            buttonOffIcon={<SaveIcon />}
            displayText={t('Save Image')}
          />
          <div className={styles['imageEditor__buttons--yellow']}>
            <SettingButton
              buttonAction={() => closeImageEditor()}
              buttonOffIcon={<MdCancel />}
              displayText={t('Close Editor')}
            />
          </div>
        </div>
        {!isMobile && (
          <>
            <div className={styles.imageEditor__title}>Image Editor</div>
            <div className={styles.imageEditor__logo}>
              <img src={theme.LOGO_WHITE} />
            </div>
          </>
        )}
      </div>
      <ImageEditor
        ref={imageEditorRef}
        includeUI={{
          loadImage: {
            path: currentImage,
            name: 'SampleImage'
          },
          menuBarPosition: 'right'
        }}
        usageStatistics={false}
      />
    </div>
  )
}

MyImageEditor.propTypes = {
  currentImage: PropTypes.string,
  closeImageEditor: PropTypes.func,
  saveImage: PropTypes.func,
  openDrawer: PropTypes.func
}
