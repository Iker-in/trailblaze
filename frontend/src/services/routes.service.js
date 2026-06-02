import api from './api.js'

export const getRoutes = async (params = {}) => {
  const response = await api.get('/routes', { params })
  return response.data
}

export const getRoute = async (id) => {
  const response = await api.get(`/routes/${id}`)
  return response.data
}

export const createRoute = async (data) => {
  const response = await api.post('/routes', data)
  return response.data
}

export const completeRoute = async (id, data = {}) => {
  const response = await api.post(`/routes/${id}/complete`, data)
  return response.data
}