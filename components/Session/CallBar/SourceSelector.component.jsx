import React, { memo } from 'react'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import styles from './SourceSelector.module.scss'

const SourceSelector = ({
  isOpen,
  setShowSources,
  sourceSelected,
  toggleSource,
  foundSources
}) => {
  const { t } = useTranslation()
  return (
    <Select
      open={isOpen}
      onClose={() => setShowSources(false)}
      onOpen={() => setShowSources(true)}
      value={sourceSelected}
      onChange={toggleSource}
      className={styles.sourceSelector}
      variant="standard"
      disableUnderline
      label="Select Source"
      labelId="sourceSelector-label"
      displayEmpty
    >
      {!sourceSelected && (
        <MenuItem value="" className={styles.sourceSelector__menuItem}>
          {t('Default')}
        </MenuItem>
      )}
      {foundSources &&
        Object.keys(foundSources).map((item) => (
          <MenuItem
            key={item}
            value={item}
            className={styles.sourceSelector__menuItem}
          >
            {t(foundSources[item])}
          </MenuItem>
        ))}
    </Select>
  )
}

SourceSelector.propTypes = {
  isOpen: PropTypes.bool,
  setShowSources: PropTypes.func,
  sourceSelected: PropTypes.string,
  toggleSource: PropTypes.func,
  foundSources: PropTypes.object
}

export default memo(SourceSelector)
