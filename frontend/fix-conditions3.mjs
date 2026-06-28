import { readFileSync, writeFileSync } from "fs"
let lines = readFileSync("C:/proyectos/trailblaze/frontend/src/pages/RouteDetail.jsx", "utf8").split("\n")

const conditionSection = [
  "            <div style={{background: '#0D1F35', border: '1px solid #1A3050', borderRadius: '14px', padding: '16px', marginBottom: '16px'}}>",
  "              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>",
  "                <h3 style={{color: 'white', fontSize: '15px', fontWeight: '500', margin: 0}}>Estado del sendero</h3>",
  "                {isAuthenticated && (",
  "                  <button onClick={() => setShowConditionForm(!showConditionForm)} style={{background: 'none', border: '1px solid #1A3050', color: '#6B8CAE', borderRadius: '8px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer'}}>",
  "                    Reportar",
  "                  </button>",
  "                )}",
  "              </div>",
  "              {condition && condition.latest ? (",
  "                <div>",
  "                  <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px'}}>",
  "                    <span style={{fontSize: '20px'}}>{CONDITIONS.find(c => c.value === condition.latest.condition)?.emoji}</span>",
  "                    <div>",
  "                      <p style={{color: 'white', fontSize: '14px', fontWeight: '500', margin: 0}}>{CONDITIONS.find(c => c.value === condition.latest.condition)?.label}</p>",
  "                      <p style={{color: getFreshnessColor(condition.latest.createdAt), fontSize: '11px', margin: 0}}>{timeAgo(condition.latest.createdAt)} por {condition.latest.user.username}</p>",
  "                    </div>",
  "                  </div>",
  "                  {condition.history && condition.history.length > 0 && (",
  "                    <div style={{borderTop: '1px solid #1A3050', paddingTop: '8px', marginTop: '8px'}}>",
  "                      <p style={{color: '#4A6480', fontSize: '11px', margin: '0 0 6px'}}>Reportes anteriores:</p>",
  "                      {condition.history.map((h, i) => (",
  "                        <p key={i} style={{color: '#4A6480', fontSize: '12px', margin: '2px 0'}}>{CONDITIONS.find(c => c.value === h.condition)?.emoji} {CONDITIONS.find(c => c.value === h.condition)?.label} · {timeAgo(h.createdAt)}</p>",
  "                      ))}",
  "                    </div>",
  "                  )}",
  "                </div>",
  "              ) : (",
  "                <p style={{color: '#4A6480', fontSize: '13px', margin: 0}}>Sin reportes recientes.</p>",
  "              )}",
  "              {showConditionForm && (",
  "                <div style={{marginTop: '12px', borderTop: '1px solid #1A3050', paddingTop: '12px'}}>",
  "                  <p style={{color: '#6B8CAE', fontSize: '13px', margin: '0 0 10px'}}>Como encontraste el sendero?</p>",
  "                  <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>",
  "                    {CONDITIONS.map(cond => (",
  "                      <button key={cond.value} onClick={() => handleCondition(cond.value)} disabled={submittingCondition} style={{background: '#050B18', border: '1px solid #1A3050', color: 'white', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px'}}>",
  "                        <span>{cond.emoji}</span> {cond.label}",
  "                      </button>",
  "                    ))}",
  "                  </div>",
  "                </div>",
  "              )}",
  "            </div>"
]

// Insertar antes de la linea 351 (LoginPrompt comentar)
const insertIdx = lines.findIndex(l => l.includes('Inicia sesion para comentar'))
lines.splice(insertIdx, 0, ...conditionSection)

writeFileSync("C:/proyectos/trailblaze/frontend/src/pages/RouteDetail.jsx", lines.join("\n"))
console.log("Listo, lineas:", lines.length)
