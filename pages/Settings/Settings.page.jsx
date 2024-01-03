import React from 'react'
import TopBar from '../../components/Shared/TopBar/TopBar.component'
import Settings from '../../components/Settings/Settings'
import { SettingsContextProvider } from '../../context/Settings/Settings.context'

const SettingsPage = () => {
  return (
    <SettingsContextProvider>
      <TopBar />
      <Settings />
    </SettingsContextProvider>
  )
}

export default SettingsPage
