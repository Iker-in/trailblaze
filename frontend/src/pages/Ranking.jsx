import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getRanking } from "../services/ranking.service.js"
import api from "../services/api.js"
import useAuthStore from "../store/authStore.js"
import Navbar from "../components/Navbar.jsx"
import LevelBadge from "../components/LevelBadge.jsx"

function RankingEntry({ entry, currentUser }) {
  return (
    <Link to={"/profile/" + entry.username} style={{background: currentUser && currentUser.id === entry.id ? "#2e1065" : "#241640", border: currentUser && currentUser.id === entry.id ? "1px solid #f97316" : "1px solid #3d2a5c", borderRadius: "14px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "14px", textDecoration: "none"}}>
      <div style={{width: "36px", textAlign: "center"}}>
        <span style={{color: entry.position === 1 ? "#fbbf24" : entry.position === 2 ? "#a78bb5" : entry.position === 3 ? "#b45309" : "#5a4670", fontWeight: "500", fontSize: "15px"}}>#{entry.position}</span>
      </div>
      <div style={{width: "38px", height: "38px", borderRadius: "50%", overflow: "hidden", border: "2px solid #3d2a5c", flexShrink: 0}}>
        {entry.avatarUrl ? (
          <img src={entry.avatarUrl} alt={entry.username} style={{width: "100%", height: "100%", objectFit: "cover"}} />
        ) : (
          <div style={{width: "100%", height: "100%", background: "#f97316", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "500", color: "white", fontSize: "15px"}}>
            {entry.username[0].toUpperCase()}
          </div>
        )}
      </div>
      <div style={{flex: 1}}>
        <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
          <p style={{color: "white", fontWeight: "500", margin: 0, fontSize: "15px"}}>{entry.username}{currentUser && currentUser.id === entry.id ? " (tu)" : ""}</p>
          <LevelBadge points={entry.points} size="sm" />
        </div>
        <p style={{color: "#8b7aa3", fontSize: "12px", margin: 0}}>{entry._count?.routes ?? entry.routes} rutas · {entry._count?.completions ?? entry.completions} completadas</p>
      </div>
      <div style={{textAlign: "right"}}>
        <p style={{color: "#fbbf24", fontWeight: "500", margin: 0, fontSize: "18px"}}>{entry.points}</p>
        <p style={{color: "#8b7aa3", fontSize: "12px", margin: 0}}>puntos</p>
      </div>
    </Link>
  )
}

function Ranking() {
  const { user: currentUser, isAuthenticated } = useAuthStore()
  const [tab, setTab] = useState("global")
  const [ranking, setRanking] = useState([])
  const [friendsRanking, setFriendsRanking] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingFriends, setLoadingFriends] = useState(false)
  const [search, setSearch] = useState("")

  useEffect(() => {
    getRanking()
      .then((data) => setRanking(data.ranking))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (tab === "amigos" && isAuthenticated && friendsRanking.length === 0) {
      setLoadingFriends(true)
      api.get("/users/me/following-ranking")
        .then((res) => setFriendsRanking(res.data.ranking))
        .catch(console.error)
        .finally(() => setLoadingFriends(false))
    }
  }, [tab, isAuthenticated])

  const filtered = ranking.filter((u) => u.username.toLowerCase().includes(search.toLowerCase()))

  const tabStyle = (t) => ({
    padding: "8px 20px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    background: tab === t ? "#f97316" : "#241640",
    color: tab === t ? "white" : "#a78bb5"
  })

  return (
    <div style={{minHeight: "100vh", background: "#160d28"}}>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px"}}>
          <h1 style={{color: "white", fontSize: "26px", fontWeight: "500", margin: 0}}>Ranking</h1>
          {tab === "global" && (
            <input type="text" placeholder="Buscar usuario..." value={search} onChange={(e) => setSearch(e.target.value)} style={{background: "#241640", border: "1px solid #3d2a5c", borderRadius: "10px", padding: "8px 14px", color: "white", fontSize: "13px", outline: "none", width: "180px"}} />
          )}
        </div>

        {isAuthenticated && (
          <div style={{display: "flex", gap: "8px", marginBottom: "20px"}}>
            <button onClick={() => setTab("global")} style={tabStyle("global")}>🌍 Global</button>
            <button onClick={() => setTab("amigos")} style={tabStyle("amigos")}>👥 Entre amigos</button>
          </div>
        )}

        {tab === "global" && (
          <>
            <p style={{color: "#8b7aa3", fontSize: "14px", marginBottom: "24px"}}>{ranking.length} senderistas en la comunidad</p>
            {loading && <div style={{color: "#a78bb5", textAlign: "center", padding: "48px"}}>Cargando ranking...</div>}
            <div className="flex flex-col gap-3">
              {filtered.map((entry) => <RankingEntry key={entry.id} entry={entry} currentUser={currentUser} />)}
              {filtered.length === 0 && !loading && <div style={{color: "#5a4670", textAlign: "center", padding: "32px"}}>No se encontro ese usuario</div>}
            </div>
          </>
        )}

        {tab === "amigos" && (
          <>
            <p style={{color: "#8b7aa3", fontSize: "14px", marginBottom: "24px"}}>Ranking entre los senderistas que sigues</p>
            {loadingFriends && <div style={{color: "#a78bb5", textAlign: "center", padding: "48px"}}>Cargando...</div>}
            {!loadingFriends && friendsRanking.length === 0 && (
              <div style={{background: "#241640", border: "1px solid #3d2a5c", borderRadius: "14px", padding: "40px", textAlign: "center"}}>
                <p style={{color: "#a78bb5", fontSize: "15px", margin: "0 0 16px"}}>Aun no sigues a nadie.</p>
                <Link to="/ranking" onClick={() => setTab("global")} style={{color: "#f97316", fontSize: "14px"}}>Ver ranking global</Link>
              </div>
            )}
            <div className="flex flex-col gap-3">
              {friendsRanking.map((entry, i) => (
                <RankingEntry key={entry.id} entry={{...entry, position: i + 1}} currentUser={currentUser} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Ranking
