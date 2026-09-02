import { useState } from 'react'
import Editor from '@monaco-editor/react'

type Generation = {
  title: string
  code: string
  explanation: string
  suggested_tests: string[]
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const templates = [
  ['React', 'Componente con búsqueda y filtro'],
  ['FastAPI', 'API REST CRUD para tareas'],
  ['Python', 'Script que procesa un CSV'],
  ['SQL', 'Consulta con filtros y paginación'],
]

export default function App() {
  const [request, setRequest] = useState('Crea un componente React de lista de usuarios con búsqueda y filtro')
  const [language, setLanguage] = useState('typescript')
  const [framework, setFramework] = useState('react')
  const [code, setCode] = useState('// Tu código aparecerá aquí')
  const [result, setResult] = useState<Generation | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function generate() {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_URL}/generate-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request, language, framework, level: 'junior', style: 'standard' }),
      })
      if (!response.ok) throw new Error('No se pudo generar el código')
      const data: Generation = await response.json()
      setResult(data)
      setCode(data.code)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ha ocurrido un error')
    } finally {
      setLoading(false)
    }
  }

  async function copyCode() {
    await navigator.clipboard.writeText(code)
  }

  return (
    <main className="min-h-screen bg-ink text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/70 px-5 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div><span className="text-xl font-bold text-neon">DevNexus</span><span className="text-xl font-bold"> AI</span></div>
          <button className="rounded-lg border border-slate-700 px-3 py-2 text-sm hover:border-neon">Iniciar sesión</button>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-6 p-5 lg:grid-cols-[220px_1fr]">
        <aside className="rounded-2xl border border-slate-800 bg-panel p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Espacio de trabajo</p>
          {['Inicio', 'Generar código', 'Depurar', 'Documentar', 'Plantillas', 'Historial', 'Favoritos', 'Perfil'].map((item) => (
            <button key={item} className="mb-1 w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-800">{item}</button>
          ))}
        </aside>
        <section className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-panel p-5 shadow-2xl shadow-black/20">
            <p className="text-sm font-medium text-neon">Generador inteligente</p>
            <h1 className="mt-1 text-3xl font-bold">¿Qué quieres programar hoy?</h1>
            <p className="mt-2 text-slate-400">Describe lo que necesitas; DevNexus AI te propondrá código y una explicación.</p>
            <textarea value={request} onChange={(event) => setRequest(event.target.value)} className="mt-5 min-h-32 w-full rounded-xl border border-slate-700 bg-slate-950 p-4 outline-none focus:border-neon" />
            <div className="mt-4 flex flex-wrap gap-3">
              <select value={language} onChange={(event) => setLanguage(event.target.value)} className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2">
                <option value="typescript">TypeScript</option><option value="javascript">JavaScript</option><option value="python">Python</option><option value="sql">SQL</option><option value="html">HTML/CSS</option>
              </select>
              <select value={framework} onChange={(event) => setFramework(event.target.value)} className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2">
                <option value="react">React</option><option value="fastapi">FastAPI</option><option value="express">Express</option><option value="none">Sin framework</option>
              </select>
              <button onClick={generate} disabled={loading} className="rounded-lg bg-neon px-4 py-2 font-semibold text-slate-950 disabled:opacity-60">{loading ? 'Generando…' : 'Generar código'}</button>
            </div>
            {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
          </div>
          <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-panel">
              <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3"><span className="font-semibold">Código</span><button onClick={copyCode} className="rounded-md border border-slate-700 px-3 py-1 text-sm hover:border-neon">Copiar</button></div>
              <Editor height="460px" theme="vs-dark" language={language === 'typescript' ? 'typescript' : language} value={code} onChange={(value) => setCode(value || '')} options={{ minimap: { enabled: false }, fontSize: 14 }} />
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-panel p-4"><h2 className="font-semibold">Explicación</h2><p className="mt-2 text-sm leading-6 text-slate-300">{result?.explanation || 'Genera código para ver la explicación paso a paso.'}</p></div>
              <div className="rounded-2xl border border-slate-800 bg-panel p-4"><h2 className="font-semibold">Tests sugeridos</h2><ul className="mt-2 space-y-2 text-sm text-slate-300">{(result?.suggested_tests || ['Los tests sugeridos aparecerán aquí.']).map((test) => <li key={test}>• {test}</li>)}</ul></div>
              <div className="rounded-2xl border border-slate-800 bg-panel p-4"><h2 className="font-semibold">Plantillas rápidas</h2>{templates.map(([name, description]) => <button key={name} onClick={() => setRequest(description)} className="mt-3 block w-full rounded-lg bg-slate-800 p-3 text-left text-sm hover:bg-slate-700"><strong>{name}</strong><br /><span className="text-slate-400">{description}</span></button>)}</div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
