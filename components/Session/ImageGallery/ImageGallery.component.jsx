import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { AiOutlineClear } from 'react-icons/ai'
import { FaRegSave } from 'react-icons/fa'
import { FiSend } from 'react-icons/fi'
import { HiOutlineFolderDownload } from 'react-icons/hi'
import { MdCancel, MdOutlineFileUpload } from 'react-icons/md'
import { RiDeleteBin2Fill, RiImageEditLine } from 'react-icons/ri'
import SettingButton from '../CallBar/SettingButton.component'
import './ImageGallery.scss'

const ImageDrawer = ({
  drawerOpen,
  closeDrawer,
  imagesArray,
  addImagesArray,
  clearImagesArray,
  setCurrentImage,
  toggleImageEditor,
  sendImage,
  removeImage,
  saveImage
}) => {
  const { t } = useTranslation()
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const inputFile = useRef(null)

  const handleChange = (event) => {
    addImagesArray(URL.createObjectURL(event.target.files[0]))
  }

  const editImage = (item) => {
    setCurrentImage(item)
    toggleImageEditor(true)
  }

  const downloadImage = (index) => {
    const data = imagesArray[index]
    const link = document.createElement('a')
    link.href = data
    link.download = name
    link.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      })
    )
  }

  const setSelected = (index, item) => {
    setSelectedIndex(index)
    setSelectedItem(item)
  }

  useEffect(() => {
    if (imagesArray.length > 0 && selectedIndex == null) {
      setSelectedIndex(0)
      setSelectedItem(imagesArray[0])
    }
  }, [imagesArray])

  const uploadFileClick = () => {
    inputFile.current.click()
  }

  return (
    <div className="imageGallery">
      <div className="imageGallery__top">
        <div>{t('Gallery')}</div>
        <SettingButton
          displayText={t('Close')}
          buttonAction={closeDrawer}
          buttonOffIcon={<MdCancel />}
          column={true}
          className="imageGallery__top__closeButton"
        />
      </div>
      <div className="imageGallery__centre">
        {selectedIndex != null
          ? (
          <div className="imageGallery__centre__top">
            <SettingButton
              displayText={t('Edit')}
              buttonAction={() => editImage(selectedItem)}
              buttonOffIcon={<RiImageEditLine />}
              column={true}
            />
            <SettingButton
              displayText={t('Download')}
              buttonAction={() => downloadImage(selectedIndex)}
              buttonOffIcon={<HiOutlineFolderDownload />}
              column={true}
            />
            <SettingButton
              displayText={t('Save')}
              buttonAction={() => saveImage(selectedItem)}
              buttonOffIcon={<FaRegSave />}
              column={true}
            />
            <SettingButton
              displayText={t('Clear')}
              buttonAction={clearImagesArray}
              buttonOffIcon={<AiOutlineClear />}
              column={true}
            />
            <SettingButton
              displayText={t('Send')}
              buttonAction={() => sendImage(selectedItem)}
              buttonOffIcon={<FiSend />}
              column={true}
            />
          </div>
            )
          : null}
        <div className="imageGallery__centre__images">
          {imagesArray.map((item, index) => {
            return (
              <div
                key={index}
                className={
                  selectedIndex === index ? 'imageBox active' : 'imageBox'
                }
                onClick={() => setSelected(index, item)}
              >
                <img src={item} />
              </div>
            )
          })}
        </div>
      </div>
      <div className="imageGallery__bottom">
        <SettingButton
          displayText={t('Delete')}
          buttonAction={() => removeImage(selectedIndex)}
          buttonOffIcon={<RiDeleteBin2Fill />}
          column={true}
        />
        <input
          type="file"
          hidden
          onChange={handleChange}
          id="raised-button-file"
          name="imageUpload"
          ref={inputFile}
        />
        <label htmlFor="raised-button-file">
          <SettingButton
            displayText={t('Upload')}
            buttonOffIcon={<MdOutlineFileUpload />}
            column={true}
            buttonAction={uploadFileClick}
          />
        </label>
      </div>
    </div>
  )
}

ImageDrawer.propTypes = {
  drawerOpen: PropTypes.bool,
  closeDrawer: PropTypes.func,
  imagesArray: PropTypes.array,
  addImagesArray: PropTypes.func,
  clearImagesArray: PropTypes.func,
  setCurrentImage: PropTypes.func,
  toggleImageEditor: PropTypes.func,
  sendImage: PropTypes.func,
  removeImage: PropTypes.func,
  saveImage: PropTypes.func
}

export default ImageDrawer
