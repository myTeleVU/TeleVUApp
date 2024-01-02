import React, { useState, useRef, useContext, useEffect, memo } from 'react'
import SettingButton from './SettingButton.component'
import moment from 'moment'
import { ReportsContext } from '../../../context/Session/Reports.context'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { BsSpeedometer } from 'react-icons/bs'

import styles from './SpeedMenu.module.scss'

const SpeedMenu = ({ time }) => {
  const [speed, setSpeed] = useState(false)
  const speedRef = useRef(null)
  const { inboundVideo, outboundVideo, inboundAudio, outboundAudio } =
    useContext(ReportsContext)
  const [now, setNow] = useState()
  const { t } = useTranslation()

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <>
      <SettingButton
        toolTipTitleOn={'Check Network Stats'}
        iconButtonRef={speedRef}
        buttonAction={() => setSpeed(!speed)}
        buttonToggleState={speed}
        buttonOnIcon={<BsSpeedometer className={styles.active} />}
        buttonOffIcon={<BsSpeedometer />}
        toolTipPlacement={'right'}
        displayText={t('Bandwidth')}
      />
      {speed && (
        <div className={styles.expandSpeed}>
          <div>{`${t('Time in Call')}: ${moment
            .utc(moment(now).diff(moment(time)))
            .format('HH:mm:ss')}`}</div>
          <br />
          <div className={styles.infoContainer}>
            <div className={styles.infoContainer__grid}>
              <div>
                <div className={styles['info__itemHeader--video']}>
                  {t('Inbound Video')}
                </div>
                {inboundVideo
                  ? (
                  <>
                    {`${t('Bytes Received')}: ${(
                      inboundVideo.bytesReceived / 1000000
                    ).toFixed(2)} MB`}
                    <br />
                    {t('Frame Height') + `: ${inboundVideo.frameHeight}`}
                    <br />
                    {t('Frame Width') + `: ${inboundVideo.frameWidth}`}
                    <br />
                    {t('Frame Per Seconds') +
                      `: ${inboundVideo.framesPerSecond}`}
                    <br />
                    {t('Packets Lost') + `: ${inboundVideo.packetsLost}`}
                    <br />
                    {t('Jitter') + `: ${inboundVideo.jitter}`}
                    <br />
                    {t('Average Bandwidth Used') +
                      `: ${(
                        (inboundVideo.bytesReceived / 1000000).toFixed(2) /
                        ((inboundVideo.timestamp - time) / 60000)
                      ).toFixed(2)} (${t('MB Per Minute')})`}
                  </>
                    )
                  : null}
              </div>
              <div>
                <div className={styles['info__itemHeader--video']}>
                  {t('Outbound Video')}
                </div>
                {outboundVideo
                  ? (
                  <>
                    {`Bytes Sent: ${(outboundVideo.bytesSent / 1000000).toFixed(
                      2
                    )} MB`}
                    <br />
                    {t('Frame Height') + `: ${outboundVideo.frameHeight}`}
                    <br />
                    {t('Frame Width') + `: ${outboundVideo.frameWidth}`}
                    <br />
                    {t('Frame Per Seconds') +
                      `: ${outboundVideo.framesPerSecond}`}
                    <br />
                  </>
                    )
                  : null}
              </div>
              <div>
                <div className={styles['info__itemHeader--audio']}>
                  {t('Inbound Audio')}
                </div>
                {inboundAudio
                  ? (
                  <>
                    {t('Bytes Received') +
                      `: ${(inboundAudio.bytesReceived / 1000000).toFixed(
                        2
                      )} MB`}
                    <br />
                    {t('Packets Lost') + `: ${inboundAudio.packetsLost}`}
                    <br />
                    {t('Jitter') + `: ${inboundAudio.jitter}`}
                    <br />
                  </>
                    )
                  : null}
              </div>
              <div>
                <div className={styles['info__itemHeader--audio']}>
                  {t('Outbound Audio')}
                </div>
                {outboundAudio
                  ? (
                  <>
                    {t('Bytes Sent') +
                      `: ${(outboundAudio.bytesSent / 1000000).toFixed(2)} MB`}
                    <br />
                  </>
                    )
                  : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

SpeedMenu.propTypes = {
  time: PropTypes.number
}

export default memo(SpeedMenu)
