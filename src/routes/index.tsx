import { createFileRoute } from '@tanstack/react-router'
import { CalendarDays, Sparkles, Users } from 'lucide-react'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/')({
  component: Dashboard,
})

function Dashboard() {
  const [servicos, setServicos] = useState([])
  const [agendamentos, setAgendamentos] = useState([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedServicos = JSON.parse(localStorage.getItem('@clinic/servicos') || '[]')
      const storedAgendamentos = JSON.parse(localStorage.getItem('@clinic/agendamentos') || '[]')
      setServicos(storedServicos)
      setAgendamentos(storedAgendamentos)
    }
  }, [])

  const totalServicos = servicos.length
  const totalAgendamentos = agendamentos.length
  const agendamentosHoje = agendamentos.filter(a => a.data === new Date().toISOString().slice(0,10)).length

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-pink-600 flex items-center gap-2">
        <Sparkles className="w-8 h-8" />
        Clínica Showcase
      </h1>
      <p className="text-gray-600 mb-6">Dashboard – visão geral da sua clínica</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-pink-100">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-pink-500" />
            <div>
              <p className="text-sm text-gray-500">Serviços cadastrados</p>
              <p className="text-2xl font-bold">{totalServicos}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-pink-100">
          <div className="flex items-center gap-3">
            <CalendarDays className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Agendamentos totais</p>
              <p className="text-2xl font-bold">{totalAgendamentos}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-pink-100">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Agendamentos hoje</p>
              <p className="text-2xl font-bold">{agendamentosHoje}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <a href="/servicos" className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition">
          Gerenciar Serviços
        </a>
        <a href="/catalogo" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition">
          Ver Catálogo Público
        </a>
      </div>
    </div>
  )
}
