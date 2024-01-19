import React, { useContext, useState, useCallback } from 'react'
import { View, Text, FlatList } from 'react-native'
import { ListItem } from 'react-native-elements'
import { Input } from '@mui/material'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { FiSend } from 'react-icons/fi'
import { MdCancel } from 'react-icons/md'
//import { CurrentUserContext } from '../../../context/Shared/CurrentUser.context'
import { trackEvent } from '../../../utils/functions'
import SettingButton from '../CallBar/SettingButton.component'

import styles from './ChatBar.module.scss'



export const ChatBar = () => {
  const [message, setMessage] = useState('')
  const [chat, setChat] = useState(true)
  const [messageHistory, setMessageHistory] = useState([
    { from: 'Adam', message: 'Hello' },
    { from: 'Eden', message: 'Hello!' },
    { from: 'Eden', message: 'How are you' },
    { from: 'Adam', message: 'Good! How about you?' },
  ])
  const { t } = useTranslation()
  //const { me } = useContext(CurrentUserContext)

  const toggleChat = useCallback(() => {
    setChat(!chat)
  }, [chat])

  const sendMessage = (newMessage) => {
      setMessageHistory((prevMessages) => 
        [...prevMessages, {from: "Adam", message: newMessage}]
      )
  };  

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
      <View className={styles.chatBar}>
        <View className={styles.chatBar__body}>
          <View className={styles.chatBar__header}>
            <View>{t('Chat')}</View>
            <SettingButton
              displayText={t('Close')}
              buttonAction={() => toggleChat()}
              buttonOffIcon={<MdCancel />}
              column={true}
            />
          </View>
          <View className={styles.chatBar__messages}>
            <FlatList
              data={messageHistory}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <ListItem
                  containerStyle={[
                    item.from === "Adam" //me.name
                      ? styles['chatBar__messages--blue']
                      : styles['chatBar__messages--grey']
                  ]}
                >
                  <ListItem.Content>
                    <Text>{item.from}:
                      {"\n"}
                      {item.message}
                    </Text>
                  </ListItem.Content>
                </ListItem>
              )}
            />
          </View>
          <View className={styles.interactions}>
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
          </View>
        </View>
      </View>
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
