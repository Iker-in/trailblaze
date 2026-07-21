function Skeleton({ width = "100%", height = "20px", borderRadius = "8px", style = {} }) {
  return <div className="arv-skeleton" style={{ width, height, borderRadius, ...style }} />
}

export default Skeleton
