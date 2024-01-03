import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Auth } from 'aws-amplify'

export const SignOut = () => {
  const navigate = useNavigate()
  React.useEffect(() => {
    navigate('/')
    try {
      Auth.signOut()
    } catch (e) {
      console.log(e)
    }
  }, [])

  return null
}
