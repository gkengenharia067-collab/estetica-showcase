import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ArrowLeft, CalendarDays, User, Phone, Trash2 } from 'lucide-react'

export const Route = createFileRoute('/agendamentos')({
  component: Agendamentos,
})

function Agendamentos() {
  const [agendamentos, setAgendamentos] = useState([])
  const [servicos, setServicos] = useState([])
  const [filtro, setFiltro] = useState('todos') // todos | hoje | futuros

  useEffect(() => {
    if (typeof window !== 'undefined') {
      carregar()
    }
  }, [])

  const carregar = () => {
    const storedAgendamentos = JSON.parse(localStorage.getItem('@clinic/agendamentos') || '[]')
    const storedServicos = JSON.parse(localStorage.getItem('@clinic/servicos') || '[]')
    setAgendamentos(storedAgendamentos)
    setServicos(storedServicos)
  }

  const nomeServico = (servicoId) => {
    const s = servicos.find(s => s.id === servicoId)
    return s ? s.nome : 'Serviço removido'
  }

  const handleCancelar = (id) => {
    if (!confirm('Cancelar este agendamento?')) return
    const atualizados = agendamentos.map(a =>
      a.id === id ? { ...a, status: 'cancelado' } : a
    )
    localStorage.setItem('@clinic/agendamentos', JSON.stringify(atualizados))
    setAgendamentos(atualizados)
  }

  const handleRemover = (id) => {
    if (!confirm('Remover este agendamento permanentemente?')) return
    const atualizados = agendamentos.filter(a => a.id !== id)
    localStorage.setItem('@clinic/agendamentos', JSON.stringify(atualizados))
    setAgendamentos(atualizados)
  }

  const hojeStr = new Date().toISOString().slice(0, 10)

  const listaFiltrada = agendamentos
    .filter(a => {
      if (filtro === 'hoje') return a.data === hojeStr
      if (filtro === 'futuros') return a.data >= hojeStr
      return true
    })
    .sort((a, b) => (a.data + a.horario).localeCompare(b.data + b.horario))

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-800 mb-4 transition">
        <ArrowLeft className="w-4 h-4" />
        Voltar ao Dashboard
      </Link>

      <h1 className="text-2xl font-bold text-pink-600 flex items-center gap-2">
        <CalendarDays className="w-6 h-6" />
        Agendamentos
      </h1>

      <div className="flex gap-2 mt-4 mb-6">
        {[
          { key: 'todos', label: 'Todos' },
          { key: 'hoje', label: 'Hoje' },
          { key: 'futuros', label: 'Futuros' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFiltro(f.key)}
            className={`px-4 py-2 rounded-lg text-sm ${
              filtro === f.key ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {listaFiltrada.length === 0 ? (
        <p className="text-gray-500">Nenhum agendamento encontrado.</p>
      ) : (
        <div className="space-y-3">
          {listaFiltrada.map(a => (
            <div
              key={a.id}
              className={`bg-white p-4 rounded-xl shadow-md border flex flex-col md:flex-row md:items-center md:justify-between gap-3 ${
                a.status === 'cancelado' ? 'border-gray-200 opacity-60' : 'border-pink-100'
              }`}
            >
              <div>
                <p className="font-bold">{nomeServico(a.servicoId)}</p>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <CalendarDays className="w-4 h-4" />
                  {new Date(a.data + 'T00:00:00').toLocaleDateString('pt-BR')} às {a.horario}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <User className="w-4 h-4" /> {a.clienteNome}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Phone className="w-4 h-4" /> {a.clienteTelefone}
                </p>
                <span
                  className={`inline-block mt-1 text-xs px-2 py-1 rounded-full ${
                    a.status === 'cancelado'
                      ? 'bg-gray-200 text-gray-600'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {a.status === 'cancelado' ? 'Cancelado' : 'Confirmado'}
                </span>
              </div>
              <div className="flex gap-2">
                {a.status !== 'cancelado' && (
                  <button
                    onClick={() => handleCancelar(a.id)}
                    className="bg-yellow-500 text-white px-3 py-2 rounded-lg text-sm"
                  >
                    Cancelar
                  </button>
                )}
                <button
                  onClick={() => handleRemover(a.id)}
                  className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}