import React, { useState, useContext, useEffect } from 'react'
import { Typography, Box, IconButton, Button } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import TipModal from '../TipModal/TipModal.component'
import { HomeVUContext } from '../../../../context/HomeVU/HomeVU.context'

import styles from './DidYouKnow.module.scss'

const DidYouKnow = () => {
  const [currentTip, setCurrentTip] = useState(0)
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const { tips, getTips } = useContext(HomeVUContext)

  const handleNext = () => {
    setCurrentTip((currentTip + 1) % tips.length)
  }

  const handlePrev = () => {
    setCurrentTip((currentTip - 1 + tips.length) % tips.length)
  }

  useEffect(() => {
    getTips('', true)
  }, [])

  useEffect(() => {
    setCurrentTip(Math.floor(Math.random() * tips.length))
  }, [tips])

  return (
    <Box className={styles.container}>
      {tips && tips[currentTip]
        ? (
        <>
          <IconButton onClick={handlePrev}>
            <ChevronLeftIcon className={styles.container__btn} />
          </IconButton>
          <div className={styles.tip}>
            <Typography className={styles.tip__title}>
              {tips[currentTip].title}
            </Typography>
            <Typography className={styles.tip__summary}>
              {tips[currentTip].summary}
            </Typography>
            <Button
              variant="outlined"
              className={styles.tip__btn}
              onClick={() => setModalIsOpen(true)}
            >
              Learn More
            </Button>
          </div>
          <IconButton onClick={handleNext}>
            <ChevronRightIcon className={styles.container__btn} />
          </IconButton>{' '}
          <TipModal
            open={modalIsOpen}
            setOpen={setModalIsOpen}
            tip={tips[currentTip]}
          />
        </>
          )
        : (
        <Typography>No current tips!</Typography>
          )}
    </Box>
  )
}

export default DidYouKnow
