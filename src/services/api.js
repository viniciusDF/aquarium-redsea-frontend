const API_URL = "http://localhost:8080/api"

function getToken() {
  return localStorage.getItem("token")
}

export async function salvarConfig(config) {
  const token = getToken()

  const response = await fetch(`${API_URL}/config`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(config)
  })

  if (!response.ok) throw new Error("Erro ao salvar config")

  return response.json()
}

export async function getDashboard() {
  const token = getToken()

  const response = await fetch(`${API_URL}/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!response.ok) {
    throw new Error("Erro ao buscar dashboard")
  }

  return response.json()
}