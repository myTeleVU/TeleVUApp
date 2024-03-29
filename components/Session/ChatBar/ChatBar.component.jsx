import React, { useContext, useState, useCallback } from 'react'
import { View, Text, FlatList, TextInput } from 'react-native'
import { ListItem } from 'react-native-elements'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
//import { CurrentUserContext } from '../../../context/Shared/CurrentUser.context'
//import SettingButton from '../CallBar/SettingButton.component'

import styles from './ChatBar.module.scss'



export const ChatBar = () => {
  const [message, setMessage] = useState('')
  const [chat, setChat] = useState(true)
  const [messages, setMessages] = useState([
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
      setMessages((prevMessages) => 
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
      <View>
      <View className={styles.chatBar}>
        <View className={styles.chatBar__body}>
          <View className={styles.chatBar__header}>
            <View><Text>{t('Chat')}</Text></View>
            
          </View>
          <View className={styles.chatBar__messages}>
            <FlatList
              data={messages}
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
                    <Text>
                      {item.from}:
                      {'\n'}
                      {item.message}
                    </Text>    
                  </ListItem.Content>
                </ListItem>
              )}
            />
          </View>
          
        </View>
      </View>
      <View className={styles.interactions}>
            <TextInput
              id="standard-basic"
              style={styles.interactions__input}
              placeholder={t('Write a message')}
              value={message}
              onChangeText={(event) => setMessage(event.target.value)}
            />
          </View>
      </View>
    )
  )
}

ChatBar.propTypes = {
  chat: PropTypes.bool,
  messages: PropTypes.array,
  sendMessage: PropTypes.func,
  toggleChat: PropTypes.func
}

export default ChatBar
