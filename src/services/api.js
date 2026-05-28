// O Vite detecta automaticamente se existe uma variável de ambiente. 
// Se não existir (desenvolvimento local), ele usa o localhost como fallback.
const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

function token() {
  return localStorage.getItem("token");
}

export async function getDashboard() {
  const res = await fetch(`${API}/dashboard`, {
    headers: {
      Authorization: `Bearer ${token()}`
    }
  });

  if (!res.ok) {
    throw new Error(`Erro no Dashboard: ${res.status}`);
  }

  return res.json();
}

export async function salvarConfig(config) {
  const res = await fetch(`${API}/config`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token()}`
    },
    body: JSON.stringify(config)
  });

  if (!res.ok) {
    throw new Error(`Erro ao salvar configuração: ${res.status}`);
  }

  return res.json();
}