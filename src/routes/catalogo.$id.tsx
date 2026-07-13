import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import Calendar from 'react-calendar'
import { format, isToday, isPast } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarDays, Clock, User, Phone, Sparkles } from 'lucide-react'
import 'react-calendar/dist/Calendar.css'
import { storeConfig } from '../config/store.config'
import { storage } from '../services/storage.service'

export const Route = createFileRoute('/catalogo/$id')({
  component: DetalhesServico,
})

// Normaliza o nome do dia da semana vindo do date-fns (ex: "segunda-feira")
// para o mesmo formato salvo no cadastro do serviço (ex: "Segunda").
function normalizarDia(diaSemana: string) {
  return diaSemana
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace('-feira', '')
}

function DetalhesServico() {
  const { id } = Route.useParams()
  const [servico, setServico] = useState(null)
  const [agendamentos, setAgendamentos] = useState([])
  const [dataSelecionada, setDataSelecionada] = useState(new Date())
  const [horarioSelecionado, setHorarioSelecionado] = useState('')
  const [clienteNome, setClienteNome] = useState('')
  const [clienteTelefone, setClienteTelefone] = useState('')
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([])

  useEffect(() => {
    const storedServicos = storage.get('servicos', [])
    const found = storedServicos.find(s => s.id === id)
    setServico(found)

    const storedAgendamentos = storage.get('agendamentos', [])
    setAgendamentos(storedAgendamentos)
  }, [id])

  useEffect(() => {
    if (!servico) return
    const dataStr = format(dataSelecionada, 'yyyy-MM-dd')
    const diaSemana = format(dataSelecionada, 'EEEE', { locale: ptBR })
    const diaNormalizado = normalizarDia(diaSemana)
    const diasDisponiveis = servico.diasSemana.map(d => normalizarDia(d))

    if (!diasDisponiveis.includes(diaNormalizado)) {
      setHorariosDisponiveis([])
      return
    }

    const ocupados = agendamentos
      .filter(a => a.servicoId === id && a.data === dataStr && a.status !== 'cancelado')
      .map(a => a.horario)

    const todosHorarios = servico.horarios || []
    const agora = new Date()
    const hoje = isToday(dataSelecionada)

    const disponiveis = todosHorarios.filter(h => {
      if (ocupados.includes(h)) return false
      if (hoje) {
        const [hora, min] = h.split(':').map(Number)
        const horarioDate = new Date()
        horarioDate.setHours(hora, min, 0, 0)
        return horarioDate > agora
      }
      return true
    })

    setHorariosDisponiveis(disponiveis)
    setHorarioSelecionado('')
  }, [dataSelecionada, servico, agendamentos, id])

  const handleAgendar = () => {
    if (!clienteNome || !clienteTelefone || !horarioSelecionado) {
      alert('Preencha todos os campos e selecione um horário.')
      return
    }

    const dataStr = format(dataSelecionada, 'yyyy-MM-dd')
    const novoAgendamento = {
      id: Date.now().toString(),
      servicoId: id,
      data: dataStr,
      horario: horarioSelecionado,
      clienteNome,
      clienteTelefone,
      status: 'confirmado',
      criadoEm: new Date().toISOString(),
    }

    const updated = [...agendamentos, novoAgendamento]
    storage.set('agendamentos', updated)
    setAgendamentos(updated)

    const mensagem = `Olá! Gostaria de confirmar meu agendamento:\n\n*Serviço:* ${servico.nome}\n*Data:* ${format(dataSelecionada, 'dd/MM/yyyy')}\n*Horário:* ${horarioSelecionado}\n*Cliente:* ${clienteNome}\n*Telefone:* ${clienteTelefone}\n\nAguardando confirmação.`
    const url = `https://wa.me/${storeConfig.whatsappNumero}?text=${encodeURIComponent(mensagem)}`
    window.open(url, '_blank')

    alert('Agendamento realizado com sucesso! Você será redirecionado ao WhatsApp para finalizar.')
    setClienteNome('')
    setClienteTelefone('')
    setHorarioSelecionado('')
  }

  if (!servico) return <div className="p-6">Serviço não encontrado.</div>

  const tileDisabled = ({ date }) => {
    if (isPast(date) && !isToday(date)) return true
    const diaSemana = format(date, 'EEEE', { locale: ptBR })
    const diaNormalizado = normalizarDia(diaSemana)
    const diasDisponiveis = servico.diasSemana.map(d => normalizarDia(d))
    return !diasDisponiveis.includes(diaNormalizado)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-pink-100">
        {servico.imagem && <img src={servico.imagem} alt={servico.nome} className="w-full h-64 object-cover" />}
        <div className="p-6">
          <h1 className="text-3xl font-bold text-pink-600">{servico.nome}</h1>
          <p className="text-gray-600 mt-2">{servico.descricao}</p>
          <div className="flex gap-4 mt-3">
            <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm">R$ {servico.preco}</span>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">{servico.duracao} min</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Disponível: {servico.diasSemana.join(', ')}</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CalendarDays className="w-5 h-5" /> Escolha o dia
          </h2>
          <Calendar
            onChange={setDataSelecionada}
            value={dataSelecionada}
            tileDisabled={tileDisabled}
            locale="pt-BR"
            className="mt-2 rounded-lg shadow border border-pink-200"
            minDate={new Date()}
          />
          <p className="text-sm text-gray-500 mt-2">
            Dias destacados estão disponíveis. Dias cinza não atendemos.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Clock className="w-5 h-5" /> Horários disponíveis
            <span className="text-sm font-normal text-gray-500">
              ({format(dataSelecionada, 'dd/MM/yyyy')})
            </span>
          </h2>

          {horariosDisponiveis.length === 0 ? (
            <p className="text-gray-500 mt-2">Nenhum horário disponível para esta data.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {horariosDisponiveis.map(h => (
                <button
                  key={h}
                  onClick={() => setHorarioSelecionado(h)}
                  className={`py-2 px-3 rounded-lg border ${
                    horarioSelecionado === h
                      ? 'bg-pink-500 text-white border-pink-500'
                      : 'bg-white border-gray-300 hover:bg-pink-50'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          )}

          {horarioSelecionado && (
            <div className="mt-6 bg-pink-50 p-4 rounded-xl border border-pink-200">
              <p className="font-semibold">Horário selecionado: {horarioSelecionado}</p>
              <div className="mt-3 space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-pink-600" />
                  <input
                    type="text"
                    placeholder="Seu nome"
                    value={clienteNome}
                    onChange={(e) => setClienteNome(e.target.value)}
                    className="flex-1 border rounded-lg p-2"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-pink-600" />
                  <input
                    type="tel"
                    placeholder="Seu telefone (com DDD)"
                    value={clienteTelefone}
                    onChange={(e) => setClienteTelefone(e.target.value)}
                    className="flex-1 border rounded-lg p-2"
                  />
                </div>
                <button
                  onClick={handleAgendar}
                  className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Agendar e enviar WhatsApp
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <Link to="/catalogo" className="text-pink-500 hover:underline">← Voltar ao catálogo</Link>
      </div>
    </div>
  )
}