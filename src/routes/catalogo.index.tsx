import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Sparkles, ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/catalogo/')({
  component: Catalogo,
})

function Catalogo() {
  const [servicos, setServicos] = useState([])
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = JSON.parse(localStorage.getItem('@clinic/servicos') || '[]')
      setServicos(stored)
    }
  }, [])
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-800 mb-4 transition">
        <ArrowLeft className="w-4 h-4" />
        Voltar ao Dashboard
      </Link>

      <div className="flex items-center gap-2 text-pink-600 mb-4">
        <Sparkles className="w-8 h-8" />
        <h1 className="text-3xl font-bold">Catálogo de Serviços</h1>
      </div>
      <p className="text-gray-600 mb-6">Escolha um serviço e agende o melhor horário para você.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicos.map(servico => (
          <Link key={servico.id} to={`/catalogo/${servico.id}`} className="block">
            <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition border border-pink-100">
              {servico.imagem && <img src={servico.imagem} alt={servico.nome} className="w-full h-48 object-cover rounded-lg" />}
              <h2 className="font-bold text-xl mt-2">{servico.nome}</h2>
              <p className="text-sm text-gray-600 line-clamp-2">{servico.descricao}</p>
              <p className="text-pink-600 font-bold mt-1">R$ {servico.preco}</p>
              <p className="text-sm text-gray-500">Duração: {servico.duracao} min</p>
              <p className="text-sm text-gray-500">Disponível: {servico.diasSemana?.join(', ')}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}