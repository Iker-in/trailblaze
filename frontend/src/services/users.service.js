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

export const followUser = async (username) => {
  const response = await api.post(`/users/${username}/follow`)
  return response.data
}

export const unfollowUser = async (username) => {
  const response = await api.delete(`/users/${username}/follow`)
  return response.data
}

export const getFollowStatus = async (username) => {
  const response = await api.get(`/users/${username}/follow-status`)
  return response.data
}

export const searchUsers = async (query) => {
  const response = await api.get('/users/search?q=' + encodeURIComponent(query))
  return response.data
}
