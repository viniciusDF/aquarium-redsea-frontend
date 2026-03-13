import { useState, useEffect } from "react"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"

function App() {
  const [isLogged, setIsLogged] = useState(
    !!localStorage.getItem("token")
  )

  const [dark, setDark] = useState(
    localStorage.getItem("theme") !== "light"
  )

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [dark])

  return (
    <div className={dark ? "bg-slate-900" : "bg-gray-100"}>
      
      <button
        onClick={() => setDark(!dark)}
        className="fixed top-4 right-4 bg-slate-700 text-white px-4 py-2 rounded-lg shadow-lg"
      >
        {dark ? "☀️ Light" : "🌙 Dark"}
      </button>

      {isLogged ? (
        <Dashboard />
      ) : (
        <Login onLogin={() => setIsLogged(true)} />
      )}
    </div>
  )
}

export default App