import { useState, useEffect } from 'react'
import { Lock, LogOut } from 'lucide-react'
import { auth } from '../services/auth.service'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  // Começa como "null" (ainda não sabemos) para evitar mostrar a tela de
  // login por uma fração de segundo antes de checar a sessão já existente.
  const [autenticado, setAutenticado] = useState<boolean | null>(null)
  const [senhaDigitada, setSenhaDigitada] = useState('')
  const [erro, setErro] = useState(false)

  useEffect(() => {
    setAutenticado(auth.estaAutenticado())
  }, [])

  const handleEntrar = (e: React.FormEvent) => {
    e.preventDefault()
    const ok = auth.autenticar(senhaDigitada)
    if (ok) {
      setAutenticado(true)
      setErro(false)
      setSenhaDigitada('')
    } else {
      setErro(true)
    }
  }

  const handleSair = () => {
    auth.sair()
    setAutenticado(false)
  }

  // Ainda checando a sessão — não mostra nada para evitar "piscar" a tela de login.
  if (autenticado === null) {
    return null
  }

  if (!autenticado) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <form
          onSubmit={handleEntrar}
          className="bg-white p-8 rounded-xl shadow-md border border-pink-100 w-full max-w-sm"
        >
          <div className="flex items-center gap-2 text-pink-600 mb-4">
            <Lock className="w-6 h-6" />
            <h1 className="text-xl font-bold">Área restrita</h1>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Digite a senha de acesso ao painel administrativo.
          </p>
          <input
            type="password"
            value={senhaDigitada}
            onChange={(e) => {
              setSenhaDigitada(e.target.value)
              setErro(false)
            }}
            className={`w-full border rounded-lg p-2 ${erro ? 'border-red-500' : ''}`}
            placeholder="Senha"
            autoFocus
          />
          {erro && (
            <p className="text-red-500 text-sm mt-1">Senha incorreta. Tente novamente.</p>
          )}
          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition mt-4"
          >
            Entrar
          </button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-end px-6 pt-4">
        <button
          onClick={handleSair}
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
      {children}
    </div>
  )
}