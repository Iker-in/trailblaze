import api from './api.js'

export const getRanking = async () => {
  const response = await api.get('/ranking')
  return response.data
}