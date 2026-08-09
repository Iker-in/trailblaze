export const requireCsrfHeader = (req, res, next) => {
  if (req.headers['x-arventra-client'] !== 'web') {
    return res.status(403).json({ error: 'Peticion no permitida' })
  }
  next()
}
