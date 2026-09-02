import { useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'
import type { Session } from '@supabase/supabase-js'
import AuthPanel from './components/AuthPanel'
import { isSupabaseConfigured, supabase } from './lib/supabase'

type Generation = { title: string; code: string; explanation: string; suggested_tests: string[] }
type Snippet = { id: string; title: string; code: string; language: string; framework?: string; is_favorite: boolean; created_at: string }
type GitHubRepo = { name: string; full_name: string; private: boolean; updated_at: string; html_url: string }

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const templates = [['React', 'Componente con busqueda y filtro'], ['FastAPI', 'API REST CRUD para tareas'], ['Python', 'Script que procesa un CSV'], ['SQL', 'Consulta con filtros y paginacion']]

export default function App() {
  const [request, setRequest] = useState('Crea un componente React de lista de usuarios con busqueda y filtro')
  const [language, setLanguage] = useState('typescript')
  const [framework, setFramework] = useState('react')
  const [code, setCode] = useState('// Tu codigo aparecera aqui')
  const [result, setResult] = useState<Generation | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [showAuth, setShowAuth] = useState(false)
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([])
  const [githubLoading, setGithubLoading] = useState(false)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession))
    return () => listener.subscription.unsubscribe()
  }, [])

  function authHeaders(): Record<string, string> {
    const token = session?.access_token
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  async function generate() {
    if (!session) { setShowAuth(true); return }
    setLoading(true); setError('')
    try {
      const response = await fetch(`${API_URL}/generate-code`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify({ request, language, framework, level: 'junior', style: 'standard' }) })
      if (!response.ok) throw new Error('No se pudo generar el codigo')
      const data: Generation = await response.json(); setResult(data); setCode(data.code)
    } catch (err) { setError(err instanceof Error ? err.message : 'Ha ocurrido un error') } finally { setLoading(false) }
  }

  async function saveSnippet() {
    if (!session) { setShowAuth(true); return }
    try {
      const response = await fetch(`${API_URL}/snippets`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify({ title: result?.title || 'Snippet sin titulo', prompt: request, code, language, framework, category: 'generated' }) })
      if (!response.ok) throw new Error('No se pudo guardar el snippet')
      await loadSnippets()
    } catch (err) { setError(err instanceof Error ? err.message : 'No se pudo guardar') }
  }

  async function loadSnippets() {
    if (!session) return
    try {
      const response = await fetch(`${API_URL}/snippets`, { headers: authHeaders() })
      if (response.ok) setSnippets(await response.json())
    } catch { /* La app sigue funcionando aunque no este configurado el backend */ }
  }

  useEffect(() => { loadSnippets() }, [session])

  async function loadGithubRepos() {
    if (!session) { setShowAuth(true); return }
    setGithubLoading(true); setError('')
    try {
      const response = await fetch(`${API_URL}/github/repositories`, { headers: authHeaders() })
      if (!response.ok) throw new Error(response.status === 503 ? 'GitHub todavía no está configurado en el backend.' : 'No se pudieron cargar los repositorios de GitHub.')
      setGithubRepos(await response.json())
    } catch (err) { setError(err instanceof Error ? err.message : 'No se pudieron cargar los repositorios de GitHub') } finally { setGithubLoading(false) }
  }

  async function logout() { if (supabase) await supabase.auth.signOut() }
  async function copyCode() { await navigator.clipboard.writeText(code) }

  return <main className="min-h-screen bg-ink text-slate-100">
    <header className="border-b border-slate-800 bg-slate-950/70 px-5 py-4 backdrop-blur"><div className="mx-auto flex max-w-7xl items-center justify-between"><div><span className="text-xl font-bold text-neon">DevNexus</span><span className="text-xl font-bold"> AI</span></div>{session ? <div className="flex items-center gap-3"><span className="hidden text-sm text-slate-400 sm:block">{session.user.email}</span><button onClick={logout} className="rounded-lg border border-slate-700 px-3 py-2 text-sm hover:border-neon">Salir</button></div> : <button onClick={() => setShowAuth(true)} className="rounded-lg border border-slate-700 px-3 py-2 text-sm hover:border-neon">Iniciar sesion</button>}</div></header>
    <div className="mx-auto grid max-w-7xl gap-6 p-5 lg:grid-cols-[220px_1fr]"><aside className="rounded-2xl border border-slate-800 bg-panel p-4"><p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Espacio de trabajo</p>{['Inicio', 'Generar codigo', 'Depurar', 'Documentar', 'Plantillas', 'Historial', 'Favoritos', 'Perfil'].map((item) => <button key={item} className="mb-1 w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-800">{item}</button>)}{session && <><button onClick={loadGithubRepos} className="mb-1 w-full rounded-lg border border-slate-700 px-3 py-2 text-left text-sm text-emerald-300 hover:border-emerald-400">{githubLoading ? 'Cargando GitHub...' : 'Repositorios GitHub'}</button>{githubRepos.slice(0, 3).map((repo) => <a key={repo.full_name} href={repo.html_url} target="_blank" rel="noreferrer" className="mt-2 block truncate text-xs text-slate-400 hover:text-emerald-300">{repo.full_name}</a>)}</>}{isSupabaseConfigured && <div className="mt-5 border-t border-slate-800 pt-4"><p className="text-xs text-slate-400">Guardados recientes</p>{snippets.slice(0, 3).map((snippet) => <button key={snippet.id} onClick={() => setCode(snippet.code)} className="mt-2 block w-full truncate text-left text-xs text-emerald-300">{snippet.title}</button>)}</div>}</aside>
      <section className="space-y-6"><div className="rounded-2xl border border-slate-800 bg-panel p-5 shadow-2xl shadow-black/20"><p className="text-sm font-medium text-neon">Generador inteligente</p><h1 className="mt-1 text-3xl font-bold">Que quieres programar hoy?</h1><p className="mt-2 text-slate-400">Describe lo que necesitas; DevNexus AI te propondra codigo y una explicacion.</p><textarea value={request} onChange={(e) => setRequest(e.target.value)} className="mt-5 min-h-32 w-full rounded-xl border border-slate-700 bg-slate-950 p-4 outline-none focus:border-neon" /><div className="mt-4 flex flex-wrap gap-3"><select value={language} onChange={(e) => setLanguage(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"><option value="typescript">TypeScript</option><option value="javascript">JavaScript</option><option value="python">Python</option><option value="sql">SQL</option><option value="html">HTML/CSS</option></select><select value={framework} onChange={(e) => setFramework(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"><option value="react">React</option><option value="fastapi">FastAPI</option><option value="express">Express</option><option value="none">Sin framework</option></select><button onClick={generate} disabled={loading} className="rounded-lg bg-neon px-4 py-2 font-semibold text-slate-950 disabled:opacity-60">{loading ? 'Generando...' : 'Generar codigo'}</button></div>{error && <p className="mt-4 text-sm text-red-400">{error}</p>}</div>
        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]"><div className="overflow-hidden rounded-2xl border border-slate-800 bg-panel"><div className="flex items-center justify-between border-b border-slate-800 px-4 py-3"><span className="font-semibold">Codigo</span><div className="flex gap-2"><button onClick={saveSnippet} className="rounded-md border border-slate-700 px-3 py-1 text-sm hover:border-neon">Guardar</button><button onClick={copyCode} className="rounded-md border border-slate-700 px-3 py-1 text-sm hover:border-neon">Copiar</button></div></div><Editor height="460px" theme="vs-dark" language={language === 'typescript' ? 'typescript' : language} value={code} onChange={(value) => setCode(value || '')} options={{ minimap: { enabled: false }, fontSize: 14 }} /></div><div className="space-y-4"><div className="rounded-2xl border border-slate-800 bg-panel p-4"><h2 className="font-semibold">Explicacion</h2><p className="mt-2 text-sm leading-6 text-slate-300">{result?.explanation || 'Genera codigo para ver la explicacion paso a paso.'}</p></div><div className="rounded-2xl border border-slate-800 bg-panel p-4"><h2 className="font-semibold">Tests sugeridos</h2><ul className="mt-2 space-y-2 text-sm text-slate-300">{(result?.suggested_tests || ['Los tests sugeridos apareciran aqui.']).map((test) => <li key={test}>• {test}</li>)}</ul></div><div className="rounded-2xl border border-slate-800 bg-panel p-4"><h2 className="font-semibold">Plantillas rapidas</h2>{templates.map(([name, description]) => <button key={name} onClick={() => setRequest(description)} className="mt-3 block w-full rounded-lg bg-slate-800 p-3 text-left text-sm hover:bg-slate-700"><strong>{name}</strong><br /><span className="text-slate-400">{description}</span></button>)}</div></div></div></section></div>{showAuth && <AuthPanel onClose={() => setShowAuth(false)} />}</main>
}
