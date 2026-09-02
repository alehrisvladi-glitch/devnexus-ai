import { FormEvent, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

type Props = { onClose: () => void }

export default function AuthPanel({ onClose }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!supabase) {
      setMessage('Supabase no está configurado todavía. Añ¡¡¡ade VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en frontend/.env.')
      return
    }
    setLoading(true)
    setMessage('')
    const result = mode === 'login'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (result.error) {
      setMessage(result.error.message)
      return
    }
    setMessage(mode === 'login' ? 'Sesion iniciada correctamente.' : 'Registro creado. Revisa tu correo si activaste confirmacion de email.')
    if (mode === 'login') onClose()
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-950 p-6 shadow-2xl">
        <div className="flex items-center justify-between"><h2 className="text-xl font-bold">{mode === 'login' ? 'Iniciar sesion' : 'Crear cuenta'}</h2><button type="button" onClick={onClose} className="text-slate-400 hover:text-white">Cerrar</button></div>
        {!isSupabaseConfigured && <p className="mt-3 rounded-lg bg-amber-400/10 p-3 text-sm text-amber-200">Modo local: configura Supabase para activar cuentas y guardado.</p>}
        <label className="mt-5 block text-sm">Email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 p-3 outline-none focus:border-emerald-400" /></label>
        <label className="mt-4 block text-sm">Contrase#a<input required minLength={6} type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 p-3 outline-none focus:border-emerald-400" /></label>
        <button disabled={loading} className="mt-5 w-full rounded-lg bg-emerald-400 px-4 py-3 font-semibold text-slate-950 disabled:opacity-60">{loading ? 'Procesando...' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}</button>
        <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="mt-3 w-full text-sm text-emerald-300">{mode === 'login' ? 'No tengo cuenta' : 'Ya tengo cuenta'}</button>
        {message && <p className="mt-4 text-sm text-slate-300">{message}</p>}
      </form>
    </div>
  )
}
