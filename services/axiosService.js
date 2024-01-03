import axios from 'axios'
import { getJWT } from '../utils/functions'

const iseeBaseURL = process.env.REACT_APP_BACKEND
const flowvuBaseURL = process.env.REACT_APP_FLOWVU_BACKEND

const requestFunction = async (config) => {
  const token = await getJWT().catch(() => {
    window.location.reload(false)
  })
  if (token) {
    config.headers.common.Authorization = 'Bearer ' + token
  }
  return config
}

const errorFunction = async (error) => {
  // Do something with request error
  console.log(error)
  return Promise.reject(error)
}

const headers = {
  'Content-Type': 'application/json'
}

const iseeInstance = axios.create({
  baseURL: iseeBaseURL,
  timeout: 10000, // timeout selected to accomodate portal loading
  headers
})

const flowvuInstance = axios.create({
  baseURL: flowvuBaseURL,
  timeout: 30000, // timeout selected to accomodate large file upload
  headers
})

iseeInstance.interceptors.request.use(requestFunction, errorFunction)
flowvuInstance.interceptors.request.use(requestFunction, errorFunction)

export { iseeInstance, flowvuInstance }
