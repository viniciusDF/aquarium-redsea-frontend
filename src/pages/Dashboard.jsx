import { useEffect, useState } from "react"
import { getDashboard } from "../services/api"
import Loader from "../components/Loader"

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getDashboard()
        setData(result)
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading) return <Loader />

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p>Sem dados disponíveis</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">📊 RedSea 250 Dashboard</h1>

        <button
          onClick={() => {
            localStorage.removeItem("token")
            window.location.reload()
          }}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg shadow-lg transition"
        >
          Sair
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Temperatura Água</h2>
          <p className="text-2xl">{data.status?.tempAgua} °C</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Temperatura LED</h2>
          <p className="text-2xl">{data.status?.tempLed} °C</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Modo</h2>
          <p className="text-2xl">
            {data.configuracao?.modoAuto ? "Automático" : "Manual"}
          </p>
        </div>

      </div>
    </div>
  )
}