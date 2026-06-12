export const getLevelInfo = (points) => {
  if (points >= 5000) return {
    name: 'Diamante Electrico',
    tier: 'diamond',
    color: '#22d3ee',
    background: 'linear-gradient(135deg, #0e7490, #7c3aed)',
    border: '#22d3ee',
    glow: '0 0 12px #22d3ee, 0 0 24px #7c3aed',
    next: null,
    nextPoints: null
  }
  if (points >= 3000) return {
    name: 'Platino Apex',
    tier: 'platinum',
    color: '#e2e8f0',
    background: 'linear-gradient(135deg, #334155, #7c3aed33)',
    border: '#7c3aed',
    glow: '0 0 8px #7c3aed',
    next: 'Diamante Electrico',
    nextPoints: 5000
  }
  if (points >= 2000) return {
    name: 'Oro Montanista',
    tier: 'gold',
    color: '#eab308',
    background: 'linear-gradient(135deg, #713f12, #92400e)',
    border: '#eab308',
    glow: null,
    next: 'Platino Apex',
    nextPoints: 3000
  }
  if (points >= 1000) return {
    name: 'Plata Explorador',
    tier: 'silver',
    color: '#c0c0c0',
    background: 'linear-gradient(135deg, #1e293b, #334155)',
    border: '#94a3b8',
    glow: null,
    next: 'Oro Montanista',
    nextPoints: 2000
  }
  return {
    name: 'Bronce Senderista',
    tier: 'bronze',
    color: '#a0a0a0',
    background: '#1e293b',
    border: '#475569',
    glow: null,
    next: 'Plata Explorador',
    nextPoints: 1000
  }
}
