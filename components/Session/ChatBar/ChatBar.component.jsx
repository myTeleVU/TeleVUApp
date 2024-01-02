import React, { useContext, useState } from 'react'
import { Input } from '@mui/material'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { FiSend } from 'react-icons/fi'
import { MdCancel } from 'react-icons/md'
import { CurrentUserContext } from '../../../context/Shared/CurrentUser.context'
import { trackEvent } from '../../../utils/functions'
import SettingButton from '../CallBar/SettingButton.component'

import styles from './ChatBar.module.scss'

const ChatBar = ({ chat, messageHistory, sendMessage, toggleChat }) => {
  const [message, setMessage] = useState('')
  const { t } = useTranslation()
  const { me } = useContext(CurrentUserContext)

  function sendChat () {
    trackEvent('Chat Message Sent')
    sendMessage(message)
    setMessage('')
  }

  function handleKeyPress (event) {
    if (event.key === 'Enter') {
      sendChat()
    }
  }

  return (
    chat && (
      <div className={styles.chatBar}>
        <div className={styles.chatBar__body}>
          <div className={styles.chatBar__header}>
            <div>{t('Chat')}</div>
            <SettingButton
              displayText={t('Close')}
              buttonAction={() => toggleChat()}
              buttonOffIcon={<MdCancel />}
              column={true}
            />
          </div>
          <div className={styles.chatBar__messages}>
            {messageHistory.map((item, index) => {
              return (
                <li
                  key={index}
                  className={
                    item.from === me.name
                      ? styles['chatBar__messages--blue']
                      : styles['chatBar__messages--grey']
                  }
                >
                  <span>{item.from}</span>:<br />
                  {item.message}
                </li>
              )
            })}
          </div>
          <div className={styles.interactions}>
            <Input
              id="standard-basic"
              className={styles.interactions__input}
              label={t('Write a message')}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyPress={handleKeyPress}
              sx={{ backgroundColor: 'white' }}
            />
            <SettingButton
              displayText={t('Send')}
              buttonAction={() => sendChat()}
              buttonOffIcon={<FiSend />}
              column={true}
            />
          </div>
        </div>
      </div>
    )
  )
}

ChatBar.propTypes = {
  chat: PropTypes.bool,
  messageHistory: PropTypes.array,
  sendMessage: PropTypes.func,
  toggleChat: PropTypes.func
}

export default ChatBar
