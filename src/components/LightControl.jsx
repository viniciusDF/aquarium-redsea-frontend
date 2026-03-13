import { useState } from "react"
import { salvarConfig } from "../services/api"

export default function LightControl() {
  const [branco, setBranco] = useState(100)
  const [azul, setAzul] = useState(100)
  const [royal, setRoyal] = useState(100)

  const enviar = async () => {
    await salvarConfig({
      branco,
      azul,
      royal,
      modoAuto: false
    })
    alert("Configuração enviada!")
  }

  return (
    <div className="card">
      <h3>Controle Manual</h3>

      <input type="range" min="0" max="255" value={branco}
        onChange={(e) => setBranco(e.target.value)} />
      <p>Branco: {branco}</p>

      <input type="range" min="0" max="255" value={azul}
        onChange={(e) => setAzul(e.target.value)} />
      <p>Azul: {azul}</p>

      <input type="range" min="0" max="255" value={royal}
        onChange={(e) => setRoyal(e.target.value)} />
      <p>Royal: {royal}</p>

      <button onClick={enviar}>Aplicar</button>
    </div>
  )
}