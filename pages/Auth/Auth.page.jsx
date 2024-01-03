import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import { SignInForm } from '../../components/Auth/SignInForm/SignInForm.component'
import { ResetPasswordForm } from '../../components/Auth/ResetPasswordForm/ResetPasswordForm.component'
import { containsEmail } from '../../utils/functions'
import { theme } from '../../styles/theme.style'
import ChangeLanguageRow from '../../components/Settings/UserSettings/ChangeLanguageRow'
import styles from './Auth.page.module.scss'

const Auth = () => {
  const { t } = useTranslation()
  const [showSignIn, setShowSignIn] = useState(false)
  const [showPasswordReset, setShowPasswordReset] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState(false)
  const [errorText, setErrorText] = useState('')
  const [prefill, setPrefill] = useState(true)
  const [idps, setIdps] = useState({})

  const handleLogin = (e) => {
    setEmail(e.target.value)
  }

  useEffect(() => {
    if (email.length > 0) {
      if (!containsEmail(email)) {
        setError(true)
        setErrorText(t('Please enter a valid email address'))
      } else {
        setError(false)
        setErrorText('')
      }
    }
  }, [email])

  const getSAMLURL = (idp) => {
    return `https://${
      process.env.REACT_APP_oath_domain
    }/oauth2/authorize?identity_provider=${idp}&client_id=${
      process.env.REACT_APP_aws_user_pools_web_client_id
    }&response_type=code&scope=email+openid+profile&redirect_uri=${encodeURIComponent(
      process.env.REACT_APP_FRONTEND
    )}`
  }

  const redirectToSAML = (idp) => {
    window.location.assign(getSAMLURL(idp))
  }

  const submitPrefill = () => {
    const domain = email.split('@')[1]
    if (Object.keys(idps).includes(domain.toLowerCase())) {
      redirectToSAML(idps[domain.toLowerCase()])
    } else {
      setPrefill(false)
      setShowSignIn(true)
    }
  }

  const submitShowResetPassword = () => {
    setShowSignIn(false)
    setShowPasswordReset(true)
  }

  const submitShowSignIn = () => {
    setShowPasswordReset(false)
    setShowSignIn(true)
  }

  const getAllIdps = async () => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND}/users/idps`)
    const idps = await response.json()
    if (idps.length > 0) {
      const idpsObject = {}
      for (const idp of idps) {
        idpsObject[idp.domain] = idp.name
      }
      setIdps(idpsObject)
    }
  }

  useEffect(() => {
    getAllIdps()
  }, [])

  return (
    <Grid container slot="sign-in" className={styles.signIn}>
      <Grid item sm={12} md={6}>
        <div className={styles.leftPage}>
          <p>&nbsp;</p>
          <div className={styles.signInBox}>
            <img className={styles.logoEye} src={theme.LOGO_EYE} alt="Logo" />
            {showSignIn && <SignInForm prefilledEmail={email} />}
            {showPasswordReset && <ResetPasswordForm prefilledEmail={email} />}
            {prefill && (
              <>
                <TextField
                  id="outlined-basic"
                  label={t('Email')}
                  variant="outlined"
                  error={error}
                  value={email}
                  onChange={handleLogin}
                  helperText={errorText}
                  sx={{ marginBottom: 2 }}
                  onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                      submitPrefill()
                    }
                  }}
                />
                <Button
                  variant="outlined"
                  onClick={submitPrefill}
                  disabled={error || email.length === 0}
                  className={styles.signInBox__loginBtn}
                >
                  {t('Login')}
                </Button>
              </>
            )}
            <div className={styles.signInFooter}>
              {showSignIn && (
                <Button
                  className={styles.signInFooter__btn}
                  variant="text"
                  onClick={submitShowResetPassword}
                >
                  {t('Forgot Password')}
                </Button>
              )}
              {showPasswordReset && (
                <Button
                  className={styles.signInFooter__btn}
                  variant="text"
                  onClick={submitShowSignIn}
                >
                  {t('Back To Sign In')}
                </Button>
              )}
            </div>
            <div className={styles.signInFooter}>
              <Button
                className={styles.signInFooter__btn}
                variant="text"
                href={theme.TERMS_OF_SERVICE}
                target="_blank"
              >
                {t('Terms of Service')}
              </Button>
              <Button
                className={styles.signInFooter__btn}
                variant="text"
                href={theme.PRIVACY_POLICY}
                target="_blank"
              >
                {t('Privacy Policy')}
              </Button>
            </div>
          </div>
          <div className={styles.reserved}>
            <div>
              © {new Date().getFullYear()} {theme.COMPANY_NAME}
            </div>
            <div>{t('All Rights Reserved.')}</div>
          </div>
        </div>
      </Grid>
      <Grid item sm={12} md={6}>
        <div className={styles.rightPage}>
          <div className={styles.language}>
            <ChangeLanguageRow showLabel={false} />
          </div>
          <div className={styles.logoWhite}>
            <img src={theme.LOGO_WHITE} alt="Logo" />
          </div>
          <p>&nbsp;</p>
        </div>
      </Grid>
    </Grid>
  )
}

export default Auth
