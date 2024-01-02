import React from 'react'
import { BsArrowsFullscreen } from 'react-icons/bs'
import { UserVideoFeed } from '../UserVideoFeed/UserVideoFeed.component'

import styles from './ThumbnailsAndLayouts.module.scss'

import { videoBoxLayoutOptions } from '../../../utils/constants'

const ThumbnailsAndLayouts = ({
  setCurrLayout,
  publisher,
  subscribers,
  currMainStreams,
  setCurrMainStreams,
  setShowThumbnails,
  setShowStreamIndex,
  showThumbnails
}) => {
  return (
    <div className={styles.thumbnailsAndLayouts}>
      <div className={styles.thumbnailsAndLayouts__layouts}>
        <button
          title="Hide Thumbnails"
          className={`${styles.thumbnailsAndLayouts__button} ${styles.controls}`}
          onClick={() => setShowThumbnails(false)}
        >
          <BsArrowsFullscreen />
        </button>
        {Object.entries(videoBoxLayoutOptions).map(
          ([layoutKey, layoutVal], index) => (
            <button
              key={index}
              title={layoutVal.name}
              className={styles.thumbnailsAndLayouts__button}
              onClick={() => setCurrLayout(layoutKey)}
            >
              {layoutVal.icon}
            </button>
          )
        )}
      </div>

      <div className={styles.thumbnailsAndLayouts__thumbnails}>
        {[publisher, ...subscribers].map(
          (streamManager, index) =>
            streamManager && (
              <div
                className={styles.thumbnailsAndLayouts__thumbnail}
                key={`thumbnail-${index}`}
              >
                <UserVideoFeed
                  streamManager={streamManager}
                  isThumbnail={true}
                  currMainStreams={currMainStreams}
                  setCurrMainStreams={setCurrMainStreams}
                  setShowStreamIndex={setShowStreamIndex}
                  showThumbnails={showThumbnails}
                />
              </div>
            )
        )}
      </div>
    </div>
  )
}

export default ThumbnailsAndLayouts
