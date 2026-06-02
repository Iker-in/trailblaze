import api from './api.js'

export const getProfile = async (username) => {
  const response = await api.get(`/users/${username}`)
  return response.data
}

export const getUserRoutes = async (username) => {
  const response = await api.get(`/users/${username}/routes`)
  return response.data
}

export const getUserCompletions = async (username) => {
  const response = await api.get(`/users/${username}/completions`)
  return response.data
}

export const updateProfile = async (data) => {
  const response = await api.patch('/users/me/profile', data)
  return response.data
}