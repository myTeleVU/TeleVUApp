import React, { memo, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { BsChevronRight } from 'react-icons/bs'
import ChatBar from '../ChatBar/ChatBar.component'
import { MyImageEditor } from '../ImageEditor/ImageEditor.component'
import ImageGallery from '../ImageGallery/ImageGallery.component'
import ThumbnailsAndLayouts from '../ThumbnailsAndLayouts/ThumbnailsAndLayouts.component'
import { UserVideoFeed } from '../UserVideoFeed/UserVideoFeed.component'
import { videoBoxLayoutOptions } from '../../../utils/constants'

import styles from './VideoBox.module.scss'

const VideoBox = ({
  publisher,
  handleMainVideoStream,
  subscribers,
  mainStreamManager,
  imageEditorState,
  recordingMode,
  sendPointer,
  sendStartDrawing,
  sendStopDrawing,
  sendDrawing,
  sendResetDrawing,
  takePhoto,
  setTakePhoto,
  addImagesArray,
  currentImage,
  setImageEditorState,
  setDrawerOpen,
  sendPausedScreen,
  clearImagesArray,
  sendSignal,
  handleAddSubscriberOnGlassOpen,
  time,
  setCurrentImage,
  toggleImageEditor,
  sendImage,
  removeImage,
  saveImage,
  drawerOpen,
  closeDrawer,
  imagesArray,
  chat,
  sendMessage,
  messageHistory,
  addChatMessage,
  toggleChat,
  setChat,
  showThumbnails,
  setShowThumbnails
}) => {
  const prevChatStateRef = useRef()
  const prevDrawerStateRef = useRef()

  const [currLayout, setCurrLayout] = useState('FULLSCREEN')
  const [currMainStreams, setCurrMainStreams] = useState([subscribers[0]])
  const [showStreamIndex, setShowStreamIndex] = useState(false)

  useEffect(() => {
    if ((chat === true) & (chat !== prevChatStateRef.current)) {
      // chat has opened
      closeDrawer()
    }
    if ((drawerOpen === true) & (drawerOpen !== prevDrawerStateRef.current)) {
      // image gallery opened
      setChat(false)
    }
    prevChatStateRef.current = chat
    prevDrawerStateRef.current = drawerOpen
  }, [chat, drawerOpen])

  useEffect(() => {
    const maxCapacity = videoBoxLayoutOptions[currLayout].capacity
    const newMainStreams = [...currMainStreams]

    // Remove streams that are no longer in subscribers (excluding the publisher)
    const filteredMainStreams = newMainStreams.filter(
      (stream) => stream === publisher || subscribers.includes(stream)
    )

    // If there is capacity, add subscribers to main streams
    if (filteredMainStreams.length < maxCapacity) {
      const additionalStreamsNeeded = maxCapacity - filteredMainStreams.length
      const additionalSubscribers = subscribers.filter(
        (subscriber) => !filteredMainStreams.includes(subscriber)
      )

      filteredMainStreams.push(
        ...additionalSubscribers.slice(0, additionalStreamsNeeded)
      )
    }

    // Add the publisher if it's not already included
    if (!filteredMainStreams.includes(publisher)) {
      filteredMainStreams.push(publisher)
    }

    // If the new layout has less capacity, remove streams from the end of the array
    if (filteredMainStreams.length > maxCapacity) {
      filteredMainStreams.length = maxCapacity
    }

    setCurrMainStreams(filteredMainStreams)
  }, [currLayout, publisher, subscribers])

  const isRTL = document.body.dir === 'rtl'

  return (
    <div id="video-container" className={styles.videoBox}>
      {!imageEditorState && (
        <div className={styles.videoBox__videos}>
          <div
            className={`${isRTL ? styles.thumbnailsBoxRTL : ''} ${
              styles.thumbnailsBox
            } ${showThumbnails ? styles.visible : styles.hidden}`}
          >
            {chat && (
              <ChatBar
                chat={chat}
                sendMessage={sendMessage}
                messageHistory={messageHistory}
                setMessageHistory={addChatMessage}
                toggleChat={toggleChat}
              />
            )}
            {drawerOpen && !imageEditorState && (
              <ImageGallery
                drawerOpen={drawerOpen}
                closeDrawer={closeDrawer}
                imagesArray={imagesArray}
                addImagesArray={addImagesArray}
                clearImagesArray={clearImagesArray}
                setCurrentImage={setCurrentImage}
                toggleImageEditor={() => setImageEditorState(!imageEditorState)}
                sendImage={sendImage}
                removeImage={removeImage}
                saveImage={saveImage}
              />
            )}
            {!drawerOpen && !chat && (
              <ThumbnailsAndLayouts
                setCurrLayout={setCurrLayout}
                publisher={publisher}
                subscribers={subscribers}
                currMainStreams={currMainStreams}
                setCurrMainStreams={setCurrMainStreams}
                setShowThumbnails={setShowThumbnails}
                showStreamIndex={showStreamIndex}
                setShowStreamIndex={setShowStreamIndex}
                showThumbnails={showThumbnails}
              />
            )}
          </div>
          <button
            title="Expand Thumbnails"
            className={`${styles.videoBox__expandThumbnails} ${
              showThumbnails ? styles.hidden : styles.visible
            }`}
            onClick={() => setShowThumbnails(true)}
          >
            <BsChevronRight />
          </button>
          {!imageEditorState && (
            <div
              className={`${styles.videoBox__mainStreams} ${
                styles['layout-' + currLayout]
              }`}
            >
              {currMainStreams.map((streamManager, index) => (
                <UserVideoFeed
                  key={`main-stream-${index}`}
                  isThumbnail={false}
                  recordingMode={recordingMode}
                  streamManager={streamManager}
                  sendPointer={sendPointer}
                  sendStartDrawing={sendStartDrawing}
                  sendStopDrawing={sendStopDrawing}
                  sendDrawing={sendDrawing}
                  sendResetDrawing={sendResetDrawing}
                  takePhoto={takePhoto}
                  setTakePhoto={setTakePhoto}
                  addImagesArray={addImagesArray}
                  sendPausedScreen={sendPausedScreen}
                  clearImagesArray={clearImagesArray}
                  sendSignal={sendSignal}
                  handleAddSubscriberOnGlassOpen={
                    handleAddSubscriberOnGlassOpen
                  }
                  time={time}
                  currLayout={currLayout}
                  currMainStreams={currMainStreams}
                  streamIndex={index}
                  showStreamIndex={showStreamIndex}
                  setShowStreamIndex={setShowStreamIndex}
                  showThumbnails={showThumbnails}
                />
              ))}
            </div>
          )}
        </div>
      )}
      {imageEditorState && currentImage && (
        <MyImageEditor
          currentImage={currentImage}
          closeImageEditor={() => setImageEditorState(false)}
          saveImage={addImagesArray}
          openDrawer={() => setDrawerOpen(true)}
        />
      )}
    </div>
  )
}

VideoBox.propTypes = {
  publisher: PropTypes.object,
  handleMainVideoStream: PropTypes.func,
  subscribers: PropTypes.array,
  mainStreamManager: PropTypes.object,
  imageEditorState: PropTypes.bool,
  recordingMode: PropTypes.bool,
  sendPointer: PropTypes.func,
  sendStartDrawing: PropTypes.func,
  sendStopDrawing: PropTypes.func,
  sendDrawing: PropTypes.func,
  sendResetDrawing: PropTypes.func,
  takePhoto: PropTypes.bool,
  setTakePhoto: PropTypes.func,
  addImagesArray: PropTypes.func,
  currentImage: PropTypes.string,
  setImageEditorState: PropTypes.func,
  setDrawerOpen: PropTypes.func,
  sendPausedScreen: PropTypes.func,
  clearImagesArray: PropTypes.func,
  sendSignal: PropTypes.func,
  handleAddSubscriberOnGlassOpen: PropTypes.func,
  time: PropTypes.number,
  setCurrentImage: PropTypes.func,
  toggleImageEditor: PropTypes.func,
  sendImage: PropTypes.func,
  removeImage: PropTypes.func,
  saveImage: PropTypes.func,
  drawerOpen: PropTypes.bool,
  closeDrawer: PropTypes.func,
  imagesArray: PropTypes.array,
  chat: PropTypes.bool,
  sendMessage: PropTypes.func,
  messageHistory: PropTypes.array,
  addChatMessage: PropTypes.func,
  toggleChat: PropTypes.func,
  setChat: PropTypes.func
}

export default memo(VideoBox)
