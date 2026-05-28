import { useEffect, useState } from "react"
import { getDashboard } from "../services/api"
import Loader from "../components/Loader"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { Thermometer, Sun, Wind, Cpu, RefreshCw, Radio, LogOut } from "lucide-react"

// Histórico fictício para o gráfico de linhas (futuramente você pode trazer isso do banco pelo Java)
const dadosHistoricoMock = [
  { hora: "12:00", agua: 25.4, led: 42.0 },
  { hora: "13:00", agua: 25.6, led: 48.5 },
  { hora: "14:00", agua: 25.9, led: 52.1 },
  { hora: "15:00", agua: 26.1, led: 55.0 },
  { hora: "16:00", agua: 25.8, led: 46.2 },
  { hora: "17:00", agua: 25.5, led: 38.0 },
]

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Função isolada para podermos chamar no carregamento e no botão de atualizar
  const loadData = async (isSilent = false) => {
    if (!isSilent) setRefreshing(true)
    try {
      const result = await getDashboard()
      setData(result)
    } catch (err) {
      console.error("Erro ao carregar dashboard:", err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    // Carregamento inicial do componente
    loadData()

    // POLLING: Atualiza os dados de forma silenciosa em segundo plano a cada 7s (sincronizado com a ESP32)
    const intervalo = setInterval(() => {
      loadData(true)
    }, 7000)

    return () => clearInterval(intervalo)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.reload()
  }

  // Função auxiliar para converter os valores de PWM (0-255) em Porcentagem (0-100%)
  const paraPorcentagem = (val) => (val != null ? Math.round((val / 255) * 100) : 0)

  if (loading) return <Loader />

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-4">
        <p className="text-slate-400 font-medium">Sem dados disponíveis do RedSea_Aquarium</p>
        <button onClick={() => loadData()} className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition text-sm">
          Tentar Novamente
        </button>
      </div>
    )
  }

  // Extração de variáveis do seu objeto integrado para facilitar o uso no HTML
  const statusAquario = data.status || {}
  const configAquario = data.configuracao || {}
  const modoAuto = configAquario.modoAuto ?? true

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 selection:bg-cyan-500 selection:text-slate-900">
      
      {/* HEADER PREMIUM */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
              RedSea_Aquarium
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">Painel de Monitoramento e Automação IoT</p>
        </div>

        <div className="flex items-center gap-4 bg-slate-900/40 backdrop-blur-md p-2 rounded-xl border border-slate-800/60 w-full sm:w-auto justify-between sm:justify-start">
          <button 
            onClick={() => loadData()}
            className={`p-2 rounded-lg text-slate-400 hover:text-cyan-400 transition-colors ${refreshing ? "animate-spin text-cyan-400" : ""}`}
            title="Atualizar agora"
          >
            <RefreshCw size={18} />
          </button>
          
          <div className="h-6 w-[1px] bg-slate-800 hidden sm:block"></div>

          <div className="flex items-center gap-2 text-sm font-medium">
            <Cpu size={16} className={modoAuto ? "text-cyan-400" : "text-amber-400"} />
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              modoAuto ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
            }`}>
              {modoAuto ? "AUTOMÁTICO" : "MANUAL"}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-900/30 px-3 py-1.5 rounded-lg text-sm font-semibold transition"
          >
            <LogOut size={14} />
            Sair
          </button>
        </div>
      </header>

      {/* DASHBOARD GRID */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUNA 1 & 2: TELEMETRIA E HISTÓRICO DE GRÁFICOS */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* CARDS PRINCIPAIS DE TEMPERATURA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* CARD: TEMPERATURA DA ÁGUA */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 p-6 rounded-2xl border border-slate-800/80 relative overflow-hidden group shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-500"></div>
              <div className="flex justify-between items-start mb-4">
                <span className="p-3 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
                  <Thermometer size={24} />
                </span>
                <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md">Estável</span>
              </div>
              <h3 className="text-slate-400 font-medium text-sm">Temperatura da Água</h3>
              <p className="text-4xl font-extrabold text-slate-100 mt-2 tracking-tight">
                {statusAquario.tempAgua != null ? statusAquario.tempAgua.toFixed(1) : "--"} <span className="text-xl text-blue-400 font-light">°C</span>
              </p>
            </div>

            {/* CARD: TEMPERATURA DO DISSIPADOR (LED) */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 p-6 rounded-2xl border border-slate-800/80 relative overflow-hidden group shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all duration-500"></div>
              <div className="flex justify-between items-start mb-4">
                <span className="p-3 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
                  <Sun size={24} />
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${statusAquario.tempLed > 60 ? "bg-rose-500/10 text-rose-400" : "bg-slate-800 text-slate-400"}`}>
                  {statusAquario.tempLed > 60 ? "Atenção" : "Seguro"}
                </span>
              </div>
              <h3 className="text-slate-400 font-medium text-sm">Dissipador da Calha</h3>
              <p className="text-4xl font-extrabold text-slate-100 mt-2 tracking-tight">
                {statusAquario.tempLed != null ? statusAquario.tempLed.toFixed(1) : "--"} <span className="text-xl text-amber-400 font-light">°C</span>
              </p>
            </div>
          </div>

          {/* GRÁFICO HISTÓRICO PREMIUM */}
          <div className="bg-slate-900/30 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Radio size={18} className="text-cyan-400 animate-pulse" />
                Histórico de Temperatura (24h)
              </h3>
              <div className="flex gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-blue-400"><span className="h-2 w-2 rounded-full bg-blue-400"></span> Água</span>
                <span className="flex items-center gap-1.5 text-amber-400"><span className="h-2 w-2 rounded-full bg-amber-400"></span> Calha LED</span>
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dadosHistoricoMock} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAgua" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="hora" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} domain={["dataMin - 1", "dataMax + 3"]} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#f8fafc", borderRadius: "12px" }} />
                  <Area type="monotone" dataKey="agua" stroke="#22d3ee" strokeWidth={2} fillOpacity={1} fill="url(#colorAgua)" name="Água (°C)" />
                  <Line type="monotone" dataKey="led" stroke="#fbbf24" strokeWidth={2} dot={false} name="Calha (°C)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* COLUNA 3: CANAIS DE ILUMINAÇÃO (PROGRAMAÇÃO DA CALHA) */}
        <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-6 rounded-2xl border border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.4)] flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sun size={18} className="text-indigo-400" />
              Canais de Iluminação
            </h3>

            {/* VISUALIZAÇÃO DOS VALORES DE PWM EM PORCENTAGEM */}
            <div className="space-y-6">
              
              {/* CANAL: BRANCO */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-200 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-100 shadow-[0_0_8px_#fef08a]"></span>
                    Canal Branco
                  </span>
                  <span className="text-slate-400 font-mono font-bold">{paraPorcentagem(configAquario.ledBranco)}%</span>
                </div>
                <div className="w-full h-2 rounded-lg bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-slate-100 transition-all duration-500 shadow-[0_0_8px_#fff]" 
                    style={{ width: `${paraPorcentagem(configAquario.ledBranco)}%` }}
                  ></div>
                </div>
              </div>

              {/* CANAL: AZUL */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-200 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></span>
                    Canal Azul Actínico
                  </span>
                  <span className="text-slate-400 font-mono font-bold">{paraPorcentagem(configAquario.ledAzul)}%</span>
                </div>
                <div className="w-full h-2 rounded-lg bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-500 shadow-[0_0_8px_#3b82f6]" 
                    style={{ width: `${paraPorcentagem(configAquario.ledAzul)}%` }}
                  ></div>
                </div>
              </div>

              {/* CANAL: ROYAL BLUE */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-200 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 shadow-[0_0_8px_#4f46e5]"></span>
                    Canal Royal Blue
                  </span>
                  <span className="text-slate-400 font-mono font-bold">{paraPorcentagem(configAquario.ledRoyal)}%</span>
                </div>
                <div className="w-full h-2 rounded-lg bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 transition-all duration-500 shadow-[0_0_8px_#4f46e5]" 
                    style={{ width: `${paraPorcentagem(configAquario.ledRoyal)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* MONITOR DO COOLER / ARREFECIMENTO */}
          <div className="mt-8 pt-4 border-t border-slate-800">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`p-2 rounded-lg ${statusAquario.fanPwm > 0 ? "bg-emerald-500/10 text-emerald-400 animate-spin [animation-duration:4s]" : "bg-slate-800 text-slate-500"}`}>
                  <Wind size={20} />
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">Cooler do Dissipador</h4>
                  <p className="text-xs text-slate-500">Controle por Histerese</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-mono font-bold text-slate-100">{paraPorcentagem(statusAquario.fanPwm)}%</span>
                <p className="text-[10px] text-slate-500 font-mono">PWM: {statusAquario.fanPwm || 0}/255</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}