import { getLevelInfo } from '../utils/levels.js'

function LevelBadge({ points, size = 'md' }) {
  const level = getLevelInfo(points)
  const sizes = {
    sm: { padding: '2px 8px', fontSize: '10px', borderRadius: '20px' },
    md: { padding: '4px 12px', fontSize: '12px', borderRadius: '20px' },
    lg: { padding: '6px 16px', fontSize: '14px', borderRadius: '24px' }
  }
  return (
    <span style={{
      background: level.background,
      color: level.color,
      border: '1px solid ' + level.border,
      fontWeight: '600',
      letterSpacing: '0.5px',
      boxShadow: level.glow || 'none',
      display: 'inline-block',
      ...sizes[size]
    }}>
      {level.name}
    </span>
  )
}

export default LevelBadge