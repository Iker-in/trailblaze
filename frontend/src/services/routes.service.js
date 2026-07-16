import api from './api.js'
import axios from 'axios'

export const getRoutes = async (params = {}) => {
  const response = await api.get('/routes', { params })
  return response.data
}

export const getRoute = async (id) => {
  const response = await api.get('/routes/' + id)
  return response.data
}

export const createRoute = async (data) => {
  const response = await api.post('/routes', data)
  return response.data
}

export const completeRoute = async (id, data = {}) => {
  const response = await api.post('/routes/' + id + '/complete', data)
  return response.data
}

export const uploadPhoto = async (routeId, file) => {
  const formData = new FormData()
  formData.append('photo', file)
  const token = localStorage.getItem('token')
  const response = await axios.post(
    (import.meta.env.VITE_API_URL || 'http://localhost:3000/api') + '/routes/' + routeId + '/photos',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + token
      },
      withCredentials: true
    }
  )
  return response.data
}

export const updateCompletion = async (completionId, data) => {
  const response = await api.patch('/completions/' + completionId, data)
  return response.data
}

export const uploadCompletionPhoto = async (completionId, file) => {
  const formData = new FormData()
  formData.append('photo', file)
  const token = localStorage.getItem('token')
  const response = await axios.post(
    (import.meta.env.VITE_API_URL || 'http://localhost:3000/api') + '/completions/' + completionId + '/photos',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + token
      },
      withCredentials: true
    }
  )
  return response.data
}