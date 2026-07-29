import { createFileRoute, Link } from '@tanstack/react-router'
import { CalendarDays, Sparkles, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { storeConfig } from '../config/store.config'
import { storageSupabase } from '../services/storage.supabase.service'
import { RequireAuth } from '../components/RequireAuth'

export const Route = createFileRoute('/')({
  component: () => (
    <RequireAuth>
      <Dashboard />
    </RequireAuth>
  ),
})

function Dashboard() {
  const [carregando, setCarregando] = useState(true)
  const [servicos, setServicos] = useState([])
  const [agendamentos, setAgendamentos] = useState([])

  useEffect(() => {
    async function carregar() {
      setCarregando(true)
      const [listaServicos, listaAgendamentos] = await Promise.all([
        storageSupabase.get('servicos', []),
        storageSupabase.get('agendamentos', []),
      ])
      setServicos(listaServicos)
      setAgendamentos(listaAgendamentos)
      setCarregando(false)
    }
    carregar()
  }, [])

  if (carregando) {
    return <div className="p-6 text-stone-500">Carregando...</div>
  }

  const hojeStr = format(new Date(), 'yyyy-MM-dd')
  const totalServicos = servicos.length
  const totalAgendamentos = agendamentos.filter(a => a.status !== 'cancelado').length
  const agendamentosHoje = agendamentos.filter(a => a.data === hojeStr && a.status !== 'cancelado').length

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-stone-700 flex items-center gap-2">
        <img src="/vite.svg" alt="" className="w-8 h-8" />
        {storeConfig.nome}
      </h1>
      <p className="text-stone-600 mb-6">Dashboard – visão geral da sua clínica</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/servicos" className="bg-white p-6 rounded-xl shadow-md border border-stone-200 hover:shadow-lg transition block">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-stone-600" />
            <div>
              <p className="text-sm text-stone-500">Serviços cadastrados</p>
              <p className="text-2xl font-bold">{totalServicos}</p>
            </div>
          </div>
        </Link>
        <Link to="/agendamentos" className="bg-white p-6 rounded-xl shadow-md border border-stone-200 hover:shadow-lg transition block">
          <div className="flex items-center gap-3">
            <CalendarDays className="w-8 h-8 text-stone-600" />
            <div>
              <p className="text-sm text-stone-500">Agendamentos confirmados</p>
              <p className="text-2xl font-bold">{totalAgendamentos}</p>
            </div>
          </div>
        </Link>
        <Link
          to="/agendamentos"
          search={{ filtro: 'hoje' }}
          className="bg-white p-6 rounded-xl shadow-md border border-stone-200 hover:shadow-lg transition block"
        >
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-stone-600" />
            <div>
              <p className="text-sm text-stone-500">Agendamentos hoje</p>
              <p className="text-2xl font-bold">{agendamentosHoje}</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="mt-8 flex gap-4 flex-wrap">
        <Link to="/servicos" className="bg-stone-700 text-white px-6 py-3 rounded-lg hover:bg-stone-800 transition">
          Gerenciar Serviços
        </Link>
        <Link to="/catalogo" className="bg-neutral-700 text-white px-6 py-3 rounded-lg hover:bg-neutral-800 transition">
          Ver Catálogo
        </Link>
        <Link to="/agendamentos" className="bg-stone-700 text-white px-6 py-3 rounded-lg hover:bg-stone-800 transition">
          Ver Agendamentos
        </Link>
      </div>
    </div>
  )
}