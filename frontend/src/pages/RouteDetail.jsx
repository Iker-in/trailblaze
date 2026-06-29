import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getRoute, completeRoute } from '../services/routes.service.js'
import api from '../services/api.js'
import useAuthStore from '../store/authStore.js'
import Navbar from '../components/Navbar.jsx'
import LoginPrompt from '../components/LoginPrompt.jsx'
import RouteMap from '../components/RouteMap.jsx'
import RouteFollowMap from '../components/RouteFollowMap.jsx'

const DIFFICULTY_STYLES = {
  facil: { background: '#14532d', color: '#86efac' },
  moderado: { background: '#713f12', color: '#fde68a' },
  dificil: { background: '#7c2d12', color: '#fdba74' },
  experto: { background: '#450a0a', color: '#fca5a5' }
}

function RouteDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()
  const [route, setRoute] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [completing, setCompleting] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [currentPhoto, setCurrentPhoto] = useState(0)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [replyingTo, setReplyingTo] = useState(null)
  const [sendingComment, setSendingComment] = useState(false)
  const [commentsPage, setCommentsPage] = useState(1)
const [commentsTotalPages, setCommentsTotalPages] = useState(1)
const [commentsTotal, setCommentsTotal] = useState(0)
const [loadingMore, setLoadingMore] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [ratings, setRatings] = useState({ thumbsUp: 0, thumbsDown: 0, userRating: null })
  const [ratingLoading, setRatingLoading] = useState(false)
  const [showFollowMap, setShowFollowMap] = useState(false)
  const [condition, setCondition] = useState(null)
  const [showConditionForm, setShowConditionForm] = useState(false)
  const [submittingCondition, setSubmittingCondition] = useState(false)

  useEffect(() => { loadRoute(); loadComments() }, [id])

  const loadRoute = async () => {
    try {
      const data = await getRoute(id)
      setRoute(data.route)
      const ratingRes = await api.get('/routes/' + id + '/rating')
      setRatings(ratingRes.data)
      const condRes = await api.get('/routes/' + id + '/condition')
      setCondition(condRes.data)
      if (isAuthenticated) {
        const favRes = await api.get('/routes/' + id + '/favorite-status')
        setIsFavorite(favRes.data.isFavorite)
      }
    } catch (err) {
      setError('Ruta no encontrada')
    } finally {
      setLoading(false)
    }
  }

  const loadComments = async (page = 1) => {
  try {
    const res = await api.get('/routes/' + id + '/comments?page=' + page + '&limit=10')
    if (page === 1) {
      setComments(res.data.comments)
    } else {
      setComments((prev) => [...prev, ...res.data.comments])
    }
    setCommentsPage(res.data.pagination.page)
    setCommentsTotalPages(res.data.pagination.totalPages)
    setCommentsTotal(res.data.pagination.total)
  } catch (err) {}
}

const loadMoreComments = async () => {
  setLoadingMore(true)
  await loadComments(commentsPage + 1)
  setLoadingMore(false)
}

  const handleComplete = async () => {
    if (!isAuthenticated) { navigate('/login'); return }
    setCompleting(true)
    try {
      const data = await completeRoute(id)
      setCompleted(true)
      setSuccessMsg(data.message)
      setRoute((prev) => ({ ...prev, _count: { completions: prev._count.completions + 1 } }))
    } catch (err) {
      setError(err.response?.data?.error || 'Error al completar la ruta')
    } finally {
      setCompleting(false)
    }
  }

  const handleFavorite = async () => {
    if (!isAuthenticated) { navigate('/login'); return }
    setFavoriteLoading(true)
    try {
      if (isFavorite) {
        await api.delete('/routes/' + id + '/favorite')
        setIsFavorite(false)
      } else {
        await api.post('/routes/' + id + '/favorite')
        setIsFavorite(true)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setFavoriteLoading(false)
    }
  }

  const handleComment = async (e) => {
  e.preventDefault()
  if (!commentText.trim()) return
  setSendingComment(true)
  try {
    const res = await api.post('/routes/' + id + '/comments', { content: commentText, parentId: replyingTo })
    if (replyingTo) {
      setComments((prev) => prev.map((c) => c.id === replyingTo ? { ...c, replies: [...(c.replies || []), res.data.comment] } : c))
    } else {
      setComments((prev) => [res.data.comment, ...prev])
      setCommentsTotal((prev) => prev + 1)
    }
    setCommentText('')
    setReplyingTo(null)
  } catch (err) {
    console.error(err)
  } finally {
    setSendingComment(false)
  }
}

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete('/routes/' + id + '/comments/' + commentId)
      setComments((prev) => prev.filter((c) => c.id !== commentId))
    } catch (err) {}
  }

  const handleRate = async (value) => {
    if (!isAuthenticated) return
    setRatingLoading(true)
    try {
      await api.post('/routes/' + id + '/rate', { rating: value })
      const res = await api.get('/routes/' + id + '/rating')
      setRatings(res.data)
    } catch {}
    setRatingLoading(false)
  }

  const CONDITIONS = [
    { value: 'excelente', label: 'Excelente condicion', emoji: '🟢' },
    { value: 'humedo', label: 'Humedo / con lodo', emoji: '🟡' },
    { value: 'vegetacion', label: 'Vegetacion densa', emoji: '🟡' },
    { value: 'cerrado', label: 'Sendero cerrado', emoji: '🔴' },
    { value: 'inundado', label: 'Zona inundada', emoji: '🔴' },
    { value: 'equipo_especial', label: 'Requiere equipo especial', emoji: '⚠️' }
  ]
  const handleCondition = async (value) => {
    setSubmittingCondition(true)
    try {
      await api.post('/routes/' + id + '/condition', { condition: value })
      const res = await api.get('/routes/' + id + '/condition')
      setCondition(res.data)
      setShowConditionForm(false)
    } catch {}
    setSubmittingCondition(false)
  }
  const getFreshnessColor = (date) => {
    if (!date) return '#4A6480'
    const days = (Date.now() - new Date(date)) / (1000 * 60 * 60 * 24)
    if (days <= 7) return '#86efac'
    if (days <= 20) return '#fde68a'
    return '#4A6480'
  }
  const timeAgo = (date) => {
    const days = Math.floor((Date.now() - new Date(date)) / (1000 * 60 * 60 * 24))
    if (days === 0) return 'hoy'
    if (days === 1) return 'hace 1 dia'
    return 'hace ' + days + ' dias'
  }
  const handleShare = () => {
    const url = window.location.origin + '/#/routes/' + id
    if (navigator.share) {
      navigator.share({ title: route.title, text: 'Mira esta ruta en ARVENTRA: ' + route.title, url })
    } else {
      navigator.clipboard.writeText(url)
      alert('Link copiado al portapapeles')
    }
  }

  const handleDeleteRoute = async () => {
    if (!window.confirm('Estas seguro de que quieres eliminar esta ruta?')) return
    setDeleting(true)
    try {
      await api.delete('/routes/' + id)
      navigate('/routes')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al eliminar la ruta')
      setDeleting(false)
    }
  }

  if (loading) return <div style={{minHeight: '100vh', background: '#050B18', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><p style={{color: '#6B8CAE'}}>Cargando...</p></div>

  if (error && !route) return (
    <div style={{minHeight: '100vh', background: '#050B18', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{textAlign: 'center'}}>
        <p style={{color: '#fca5a5', fontSize: '18px', marginBottom: '16px'}}>{error}</p>
        <Link to="/routes" style={{color: '#f97316'}}>Volver a rutas</Link>
      </div>
    </div>
  )

  return (
    <div style={{minHeight: '100vh', background: '#050B18'}}>
      <Helmet>
        <title>{route ? route.title + ' - ARVENTRA' : 'ARVENTRA'}</title>
        <meta name="description" content={route ? route.description.slice(0, 150) : ''} />
        <meta property="og:title" content={route ? route.title : 'ARVENTRA'} />
        <meta property="og:description" content={route ? route.description.slice(0, 150) : ''} />
        <meta property="og:image" content={route && route.photos && route.photos.length > 0 ? route.photos[0].url : ''} />
        <meta property="og:url" content={'https://arventra.app/routes/' + id} />
        <meta property="og:type" content="article" />
      </Helmet>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        {successMsg && <div style={{background: '#14532d', border: '1px solid #16a34a', color: '#86efac', borderRadius: '12px', padding: '14px', marginBottom: '20px', fontWeight: '500'}}>{successMsg}</div>}
        {error && <div style={{background: '#450a0a', border: '1px solid #991b1b', color: '#fca5a5', borderRadius: '12px', padding: '14px', marginBottom: '20px'}}>{error}</div>}

        <div style={{background: '#0D1F35', border: '1px solid #1A3050', borderRadius: '16px', overflow: 'hidden', marginBottom: '20px'}}>
          {route.photos && route.photos.length > 0 && (
            <div style={{position: 'relative'}}>
              <img src={route.photos[currentPhoto].url} alt={route.title} style={{width: '100%', height: '280px', objectFit: 'contain', background: '#050B18'}} />
              {route.photos.length > 1 && (
              <div style={{display: 'flex', gap: '8px', padding: '8px', overflowX: 'auto', background: '#050B18'}}>
                {route.photos.map((photo, i) => (
                  <img key={i} src={photo.url} alt={route.title + ' foto ' + (i+1)} onClick={() => setCurrentPhoto(i)} style={{width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px', cursor: 'pointer', border: i === currentPhoto ? '2px solid #f97316' : '2px solid transparent', flexShrink: 0}} />
                ))}
              </div>
            )}
            {route.photos.length > 1 && (
                <div style={{position: 'absolute', bottom: '12px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '6px'}}>
                  {route.photos.map((_, i) => (
                    <button key={i} onClick={() => setCurrentPhoto(i)} style={{width: '8px', height: '8px', borderRadius: '50%', border: 'none', background: i === currentPhoto ? '#fb923c' : 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: 0}} />
                  ))}
                </div>
              )}
            </div>
          )}

          <div style={{padding: '28px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px'}}>
              <h1 style={{color: 'white', fontSize: '26px', fontWeight: '500', margin: 0}}>{route.title}</h1>
              <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                <span style={{...DIFFICULTY_STYLES[route.difficulty], fontSize: '12px', padding: '4px 12px', borderRadius: '20px', fontWeight: '500', whiteSpace: 'nowrap'}}>{route.difficulty}</span>
                {isAuthenticated && user && user.id === route.userId && (
                  <div style={{display: 'flex', gap: '8px'}}>
                    <Link to={'/routes/' + id + '/edit'} style={{background: '#1e3a5f', color: '#93c5fd', border: '1px solid #1e40af', borderRadius: '8px', padding: '4px 12px', fontSize: '12px', textDecoration: 'none'}}>Editar</Link>
                    <button onClick={handleDeleteRoute} disabled={deleting} style={{background: '#450a0a', color: '#fca5a5', border: '1px solid #991b1b', borderRadius: '8px', padding: '4px 12px', fontSize: '12px', cursor: 'pointer', opacity: deleting ? 0.6 : 1}}>
                      {deleting ? '...' : 'Eliminar'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <p style={{color: '#4A6480', fontSize: '14px', marginBottom: '20px'}}>
              Publicada por{' '}
              <Link to={'/profile/' + route.user.username} style={{color: '#f43f5e', textDecoration: 'none', fontWeight: '500'}}>{route.user.username}</Link>
            </p>

            {route.completions && route.completions.length > 0 && (
  <p style={{color: '#fb923c', fontSize: '13px', margin: '4px 0 0'}}>
    🏆 Primer explorador:{' '}
    <Link to={'/profile/' + route.completions[0].user.username} style={{color: '#fb923c', textDecoration: 'none', fontWeight: '500'}}>
      {route.completions[0].user.username}
    </Link>
  </p>
)}

            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px'}}>
              {[
                { value: route.distanceKm, label: 'km' },
                route.elevationM ? { value: route.elevationM, label: 'metros' } : null,
                route.estimatedTime ? { value: route.estimatedTime, label: 'minutos' } : null
              ].filter(Boolean).map((stat) => (
                <div key={stat.label} style={{background: '#050B18', borderRadius: '12px', padding: '14px', textAlign: 'center', border: '1px solid #0D1F35'}}>
                  <p style={{color: '#fb923c', fontSize: '22px', fontWeight: '500', margin: 0}}>{stat.value}</p>
                  <p style={{color: '#4A6480', fontSize: '13px', margin: 0}}>{stat.label}</p>
                </div>
              ))}
            </div>

            <RouteMap latitude={route.latitudeStart} longitude={route.longitudeStart} title={route.title} trackPoints={route.trackPoints} />

            <p style={{color: '#6B8CAE', lineHeight: '1.7', marginBottom: '24px'}}>{route.description}</p>

            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid #1A3050'}}>
              <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                <p style={{color: '#2A4A6A', fontSize: '14px', margin: 0}}>Completada {route._count.completions} veces</p>
                <button onClick={handleFavorite} disabled={favoriteLoading} style={{background: 'transparent', color: isFavorite ? '#fb923c' : '#2A4A6A', border: '1px solid ' + (isFavorite ? '#fb923c' : '#1A3050'), borderRadius: '10px', padding: '8px 14px', fontSize: '13px', cursor: 'pointer'}}>
                  {isFavorite ? 'Guardado' : 'Guardar'}
                </button>
              </div>
              {route.trackPoints && route.trackPoints.length > 1 && (
                <button onClick={() => setShowFollowMap(true)} style={{background: '#0D1F35', color: '#fb923c', border: '1px solid #fb923c', borderRadius: '10px', padding: '10px 20px', fontWeight: '500', fontSize: '14px', cursor: 'pointer'}}>
                  🗺️ Seguir ruta
                </button>
              )}
              {isAuthenticated && route.userId !== user?.id && (
                <button onClick={handleComplete} disabled={completing || completed} style={{background: completed ? '#14532d' : '#f97316', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 24px', fontWeight: '500', fontSize: '14px', cursor: 'pointer', opacity: completing ? 0.6 : 1}}>
                  {completed ? 'Completada' : completing ? 'Guardando...' : 'Marcar como completada'}
                </button>
              )}
              {!isAuthenticated && <LoginPrompt message="Inicia sesion para completar esta ruta" />}
              <button onClick={handleShare} style={{background: '#0D1F35', color: '#6B8CAE', border: '1px solid #1A3050', borderRadius: '10px', padding: '10px 20px', fontSize: '14px', cursor: 'pointer'}}>🔗 Compartir ruta</button>
              <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                <button onClick={() => handleRate(1)} disabled={ratingLoading || !isAuthenticated} style={{background: ratings.userRating === 1 ? '#14532d' : '#0D1F35', color: ratings.userRating === 1 ? '#86efac' : '#6B8CAE', border: '1px solid #1A3050', borderRadius: '10px', padding: '10px 16px', fontSize: '14px', cursor: isAuthenticated ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: '6px'}}>
                  👍 {ratings.thumbsUp}
                </button>
                <button onClick={() => handleRate(-1)} disabled={ratingLoading || !isAuthenticated} style={{background: ratings.userRating === -1 ? '#450a0a' : '#0D1F35', color: ratings.userRating === -1 ? '#fca5a5' : '#6B8CAE', border: '1px solid #1A3050', borderRadius: '10px', padding: '10px 16px', fontSize: '14px', cursor: isAuthenticated ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: '6px'}}>
                  👎 {ratings.thumbsDown}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div style={{background: '#0D1F35', border: '1px solid #1A3050', borderRadius: '16px', padding: '24px'}}>
            <div style={{background: '#0D1F35', border: '1px solid #1A3050', borderRadius: '14px', padding: '16px', marginBottom: '16px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
                <h3 style={{color: 'white', fontSize: '15px', fontWeight: '500', margin: 0}}>Estado del sendero</h3>
                {isAuthenticated && <button onClick={() => setShowConditionForm(!showConditionForm)} style={{background: 'none', border: '1px solid #1A3050', color: '#6B8CAE', borderRadius: '8px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer'}}>Reportar</button>}
              </div>
              {condition && condition.latest ? (
                <div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px'}}>
                    <span style={{fontSize: '20px'}}>{CONDITIONS.find(c => c.value === condition.latest.condition)?.emoji}</span>
                    <div>
                      <p style={{color: 'white', fontSize: '14px', fontWeight: '500', margin: 0}}>{CONDITIONS.find(c => c.value === condition.latest.condition)?.label}</p>
                      <p style={{color: getFreshnessColor(condition.latest.createdAt), fontSize: '11px', margin: 0}}>{timeAgo(condition.latest.createdAt)} · por {condition.latest.user.username}</p>
                    </div>
                  </div>
                  {condition.history && condition.history.length > 0 && <div style={{borderTop: '1px solid #1A3050', paddingTop: '8px', marginTop: '8px'}}><p style={{color: '#4A6480', fontSize: '11px', margin: '0 0 6px'}}>Reportes anteriores:</p>{condition.history.map((h, i) => <p key={i} style={{color: '#4A6480', fontSize: '12px', margin: '2px 0'}}>{CONDITIONS.find(c => c.value === h.condition)?.emoji} {CONDITIONS.find(c => c.value === h.condition)?.label} · {timeAgo(h.createdAt)}</p>)}</div>}
                </div>
              ) : <p style={{color: '#4A6480', fontSize: '13px', margin: 0}}>Sin reportes recientes.</p>}
              {showConditionForm && <div style={{marginTop: '12px', borderTop: '1px solid #1A3050', paddingTop: '12px'}}><p style={{color: '#6B8CAE', fontSize: '13px', margin: '0 0 10px'}}>Como encontraste el sendero?</p><div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>{CONDITIONS.map(cond => <button key={cond.value} onClick={() => handleCondition(cond.value)} disabled={submittingCondition} style={{background: '#050B18', border: '1px solid #1A3050', color: 'white', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px'}}><span>{cond.emoji}</span> {cond.label}</button>)}</div></div>}
            </div>
          <h3 style={{color: 'white', fontWeight: '500', margin: '0 0 20px', fontSize: '16px'}}>Comentarios ({commentsTotal})</h3>

          {isAuthenticated && !replyingTo && (
  <form onSubmit={handleComment} style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
              <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Escribe un comentario..." maxLength={500} style={{flex: 1, background: '#050B18', border: '1px solid #1A3050', borderRadius: '10px', padding: '10px 14px', color: 'white', fontSize: '14px', outline: 'none'}} />
              <button type="submit" disabled={sendingComment || !commentText.trim()} style={{background: '#f97316', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 18px', fontWeight: '500', fontSize: '14px', cursor: 'pointer', opacity: sendingComment ? 0.6 : 1}}>
                {sendingComment ? '...' : 'Enviar'}
              </button>
            </form>
          )}

          {!isAuthenticated && (
            <p style={{color: '#2A4A6A', fontSize: '13px', marginBottom: '20px'}}>
              <LoginPrompt message="Inicia sesion para comentar" />
            </p>
          )}

          <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            {comments.length === 0 && <p style={{color: '#2A4A6A', fontSize: '14px', textAlign: 'center', padding: '16px'}}>Sin comentarios todavia. Se el primero.</p>}
            {comments.map((comment) => (
  <div key={comment.id}>
    <div style={{display: 'flex', gap: '10px', alignItems: 'flex-start'}}>
      <div style={{width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #1A3050', flexShrink: 0}}>
        {comment.user.avatarUrl ? (
          <img src={comment.user.avatarUrl} alt={comment.user.username} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        ) : (
          <div style={{width: '100%', height: '100%', background: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '500', color: 'white'}}>
            {comment.user.username[0].toUpperCase()}
          </div>
        )}
      </div>
      <div style={{flex: 1, background: '#050B18', borderRadius: '10px', padding: '10px 14px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px'}}>
          <Link to={'/profile/' + comment.user.username} style={{color: '#f43f5e', fontSize: '13px', fontWeight: '500', textDecoration: 'none'}}>{comment.user.username}</Link>
          <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
            <span style={{color: '#2A4A6A', fontSize: '11px'}}>{new Date(comment.createdAt).toLocaleDateString()}</span>
            {user && user.id === comment.user.id && (
              <button onClick={() => handleDeleteComment(comment.id)} style={{color: '#2A4A6A', background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', padding: 0}}>eliminar</button>
            )}
          </div>
        </div>
        <p style={{color: '#6B8CAE', fontSize: '14px', margin: '0 0 6px'}}>{comment.content}</p>
        {isAuthenticated && (
          <button onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)} style={{color: '#f97316', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', padding: 0}}>
            {replyingTo === comment.id ? 'Cancelar' : 'Responder'}
          </button>
        )}
      </div>
    </div>

    {comment.replies && comment.replies.length > 0 && (
      <div style={{marginLeft: '42px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px'}}>
        {comment.replies.map((reply) => (
          <div key={reply.id} style={{display: 'flex', gap: '10px', alignItems: 'flex-start'}}>
            <div style={{width: '26px', height: '26px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #1A3050', flexShrink: 0}}>
              {reply.user.avatarUrl ? (
                <img src={reply.user.avatarUrl} alt={reply.user.username} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              ) : (
                <div style={{width: '100%', height: '100%', background: '#f43f5e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '500', color: 'white'}}>
                  {reply.user.username[0].toUpperCase()}
                </div>
              )}
            </div>
            <div style={{flex: 1, background: '#0D1F35', borderRadius: '10px', padding: '8px 12px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px'}}>
                <Link to={'/profile/' + reply.user.username} style={{color: '#f43f5e', fontSize: '12px', fontWeight: '500', textDecoration: 'none'}}>{reply.user.username}</Link>
                {user && user.id === reply.user.id && (
                  <button onClick={() => handleDeleteComment(reply.id)} style={{color: '#2A4A6A', background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', padding: 0}}>eliminar</button>
                )}
              </div>
              <p style={{color: '#6B8CAE', fontSize: '13px', margin: 0}}>{reply.content}</p>
            </div>
          </div>
        ))}
      </div>
    )}

    {replyingTo === comment.id && (
      <form onSubmit={handleComment} style={{display: 'flex', gap: '8px', marginTop: '10px', marginLeft: '42px'}}>
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder={'Responder a ' + comment.user.username + '...'}
          maxLength={500}
          autoFocus
          style={{flex: 1, background: '#050B18', border: '1px solid #1A3050', borderRadius: '10px', padding: '8px 12px', color: 'white', fontSize: '13px', outline: 'none'}}
        />
        <button type="submit" disabled={sendingComment || !commentText.trim()} style={{background: '#f97316', color: 'white', border: 'none', borderRadius: '10px', padding: '8px 14px', fontWeight: '500', fontSize: '13px', cursor: 'pointer', opacity: sendingComment ? 0.6 : 1}}>
          {sendingComment ? '...' : 'Enviar'}
        </button>
      </form>
    )}
  </div>
))}
            {commentsPage < commentsTotalPages && (
  <button onClick={loadMoreComments} disabled={loadingMore} style={{background: 'transparent', color: '#f97316', border: '1px solid #1A3050', borderRadius: '10px', padding: '10px', fontSize: '13px', cursor: 'pointer', marginTop: '12px', width: '100%'}}>
    {loadingMore ? 'Cargando...' : 'Cargar mas comentarios'}
  </button>
)}
          </div>
        </div>
      </div>
      {showFollowMap && route && isAuthenticated && <RouteFollowMap route={route} onClose={() => setShowFollowMap(false)} onComplete={() => { setShowFollowMap(false); handleComplete() }} />}
    </div>
  )
}

export default RouteDetail