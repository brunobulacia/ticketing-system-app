import {
  ArrowRight,
  BarChart3,
  Bot,
  Check,
  Clock,
  Languages,
  type LucideIcon,
  ScrollText,
  Search,
  ShieldCheck,
  Sparkles,
  Ticket,
  Users,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function LandingPage() {
  return (
    <div className="min-h-screen scroll-smooth bg-white text-slate-800">
      <LandingNav />
      <Hero />
      <MetricsStrip />
      <Features />
      <AiSpotlight />
      <FinalCta />
      <Footer />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Navegación                                                          */
/* ------------------------------------------------------------------ */

function LandingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href="#top" className="flex items-center gap-2 text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <Ticket className="h-4 w-4" />
          </span>
          <span className="text-lg font-semibold tracking-tight">Deskly</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <a href="#features" className="transition hover:text-white">
            Funciones
          </a>
          <a href="#ia" className="transition hover:text-white">
            Inteligencia
          </a>
        </nav>
        <Link
          to="/login"
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-200"
        >
          Entrar
        </Link>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-slate-950 pb-40 pt-20">
      {/* Retícula técnica de fondo, desvanecida hacia los bordes */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgb(99 102 241 / 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgb(99 102 241 / 0.4) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage:
            'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)',
        }}
      />
      {/* Resplandor indigo */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-10%] h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-indigo-600/30 blur-[120px]"
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Mesa de ayuda con IA · en tiempo real
        </span>

        <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl">
          El soporte que se resuelve
          <span className="bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">
            {' '}antes de escalar
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
          Deskly centraliza los tickets de tu organización, los clasifica y
          prioriza con IA, controla los SLA y mantiene a todo el equipo
          sincronizado al instante. Un helpdesk completo, no una bandeja de
          entrada.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/login"
            className="group inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500"
          >
            Ver la demo
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
          >
            Explorar funciones
          </a>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          Acceso de prueba:{' '}
          <span className="font-mono text-slate-400">admin@demo.com</span> /{' '}
          <span className="font-mono text-slate-400">Admin123!</span>
        </p>
      </div>

      {/* Mockup del producto */}
      <div className="relative mx-auto mt-16 max-w-5xl px-6">
        <ProductMockup />
      </div>
    </section>
  );
}

function ProductMockup() {
  const statuses = [
    { label: 'New', count: 42, color: '#3b82f6' },
    { label: 'Open', count: 31, color: '#06b6d4' },
    { label: 'In Progress', count: 24, color: '#8b5cf6' },
    { label: 'Pending', count: 12, color: '#eab308' },
    { label: 'Resolved', count: 58, color: '#22c55e' },
  ];
  const max = Math.max(...statuses.map((s) => s.count));

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white shadow-2xl shadow-indigo-950/50 ring-1 ring-black/5">
      {/* Barra de ventana */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-100 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-400" />
        <span className="h-3 w-3 rounded-full bg-amber-400" />
        <span className="h-3 w-3 rounded-full bg-green-400" />
        <div className="ml-3 hidden rounded-md bg-white px-3 py-1 text-xs text-slate-400 sm:block">
          app.deskly.io/dashboard
        </div>
      </div>

      <div className="grid gap-5 p-5 sm:grid-cols-3 sm:p-6">
        <MockStat label="Tickets abiertos" value="109" accent="#6366f1" />
        <MockStat label="Resueltos este mes" value="342" accent="#22c55e" />
        <MockStat label="Cumplimiento SLA" value="96%" accent="#0ea5e9" />

        <div className="rounded-xl border border-slate-200 bg-white p-5 sm:col-span-2">
          <p className="mb-4 text-sm font-semibold text-slate-700">
            Tickets por estado
          </p>
          <div className="space-y-2.5">
            {statuses.map((s) => (
              <div
                key={s.label}
                className="grid grid-cols-[6rem_1fr_2rem] items-center gap-3"
              >
                <span className="truncate text-xs text-slate-600">{s.label}</span>
                <div className="h-4 rounded-sm bg-slate-100">
                  <div
                    className="h-4 rounded-sm"
                    style={{
                      width: `${(s.count / max) * 100}%`,
                      backgroundColor: s.color,
                    }}
                  />
                </div>
                <span className="text-right text-xs font-semibold tabular-nums text-slate-700">
                  {s.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-indigo-700">
            <Sparkles className="h-4 w-4" /> Asistente IA
          </div>
          <p className="mt-3 text-xs leading-relaxed text-indigo-900/70">
            Categoría sugerida: <b>Redes</b>
          </p>
          <p className="mt-1 text-xs leading-relaxed text-indigo-900/70">
            Prioridad: <b>Alta</b> · Sentimiento: <b>Negativo</b>
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {['vpn', 'conexión', 'urgente'].map((t) => (
              <span
                key={t}
                className="rounded-full bg-white px-2 py-0.5 text-[10px] text-indigo-600"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MockStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5">
      <span
        className="absolute inset-y-0 left-0 w-1"
        style={{ backgroundColor: accent }}
      />
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-3xl font-bold tabular-nums text-slate-800">{value}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Banda de métricas                                                   */
/* ------------------------------------------------------------------ */

function MetricsStrip() {
  const metrics = [
    { value: '4', label: 'roles con permisos independientes' },
    { value: '7', label: 'estados de flujo configurables' },
    { value: '8', label: 'capacidades de IA integradas' },
    { value: '100%', label: 'de la API disponible por REST' },
  ];
  return (
    <section className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 lg:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="text-center">
            <p className="text-3xl font-bold tabular-nums text-slate-900">
              {m.value}
            </p>
            <p className="mt-1 text-sm text-slate-500">{m.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Funciones                                                           */
/* ------------------------------------------------------------------ */

interface Feature {
  icon: LucideIcon;
  title: string;
  body: string;
  tint: string;
  fg: string;
}

const FEATURES: Feature[] = [
  {
    icon: Bot,
    title: 'Clasificación automática',
    body: 'La IA sugiere categoría, departamento y prioridad, genera etiquetas y detecta el sentimiento apenas se crea el ticket.',
    tint: 'bg-indigo-50',
    fg: 'text-indigo-600',
  },
  {
    icon: Zap,
    title: 'Tiempo real',
    body: 'Dashboard, tickets y notificaciones se actualizan por WebSocket sin recargar la página. El equipo siempre ve lo último.',
    tint: 'bg-emerald-50',
    fg: 'text-emerald-600',
  },
  {
    icon: Clock,
    title: 'Control de SLA',
    body: 'Tiempos de respuesta y resolución por prioridad, con alertas automáticas cuando un acuerdo está próximo a vencer.',
    tint: 'bg-amber-50',
    fg: 'text-amber-600',
  },
  {
    icon: ShieldCheck,
    title: 'Roles y permisos',
    body: 'Administrador, supervisor, agente y cliente. Cada rol ve y hace exactamente lo que le corresponde, con visibilidad acotada.',
    tint: 'bg-sky-50',
    fg: 'text-sky-600',
  },
  {
    icon: ScrollText,
    title: 'Historial y auditoría',
    body: 'Cada cambio, asignación, comentario y acceso queda registrado. Trazabilidad completa para cumplimiento y soporte.',
    tint: 'bg-violet-50',
    fg: 'text-violet-600',
  },
  {
    icon: BarChart3,
    title: 'Reportes y métricas',
    body: 'Panel con tickets por estado, prioridad, categoría y agente. Exporta a CSV, Excel o PDF en un clic.',
    tint: 'bg-rose-50',
    fg: 'text-rose-600',
  },
];

function Features() {
  return (
    <section id="features" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
            Todo en un lugar
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Un helpdesk que hace el trabajo pesado por ti
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            Desde la creación del ticket hasta su resolución, cada paso está
            cubierto y automatizado donde importa.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
            >
              <span
                className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${f.tint} ${f.fg}`}
              >
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Spotlight de IA                                                     */
/* ------------------------------------------------------------------ */

const AI_CAPABILITIES = [
  'Clasifica categoría y departamento',
  'Sugiere la prioridad según urgencia',
  'Redacta una respuesta para el agente',
  'Resume conversaciones largas',
  'Encuentra tickets similares',
  'Genera etiquetas automáticamente',
  'Detecta el sentimiento del cliente',
  'Traduce comentarios a otro idioma',
];

function AiSpotlight() {
  return (
    <section id="ia" className="relative overflow-hidden bg-slate-950 py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-indigo-600/20 blur-[120px]"
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-indigo-300">
            <Sparkles className="h-3.5 w-3.5" /> Inteligencia integrada
          </p>
          <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            La IA trabaja en cada ticket, no en una pestaña aparte
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-300">
            Las tareas de IA se ejecutan de forma asíncrona sobre una cola de
            mensajes y el resultado llega al ticket en segundos. Funciona con un
            proveedor heurístico sin costo o con Claude para máxima calidad.
          </p>
          <ul className="mt-8 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {AI_CAPABILITIES.map((c) => (
              <li key={c} className="flex items-start gap-2 text-sm text-slate-200">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                {c}
              </li>
            ))}
          </ul>
        </div>

        {/* Tarjeta ilustrativa */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
          <div className="rounded-xl bg-white p-5 shadow-xl">
            <p className="font-mono text-[11px] text-slate-400">TCK-00218</p>
            <p className="mt-1 font-semibold text-slate-900">
              Error urgente en la red wifi
            </p>
            <p className="mt-1 text-sm text-slate-500">
              El internet y la VPN están caídos, no funciona la conexión…
            </p>
            <div className="mt-4 space-y-2 rounded-lg border border-indigo-100 bg-indigo-50/60 p-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700">
                <Bot className="h-3.5 w-3.5" /> Análisis de IA
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-indigo-900/70">
                <span>Categoría: <b>Redes</b></span>
                <span>Depto: <b>IT</b></span>
                <span>Prioridad: <b>Alta</b></span>
                <span>Sentimiento: <b>Negativo</b></span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['vpn', 'internet', 'urgente', 'wifi'].map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-white px-2 py-0.5 text-[10px] text-indigo-600"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
              <Search className="h-3.5 w-3.5" /> 3 tickets similares encontrados
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* CTA final                                                           */
/* ------------------------------------------------------------------ */

function FinalCta() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-indigo-600 px-8 py-16 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 20%, white 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
          <div className="relative">
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Entra a la demo y explóralo tú mismo
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-indigo-100">
              Hay usuarios de prueba para cada rol: administrador, supervisor,
              agente y cliente.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/login"
                className="group inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-indigo-700 shadow-lg transition hover:bg-indigo-50"
              >
                Iniciar sesión
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <span className="text-sm text-indigo-200">
                <span className="font-mono">cliente@demo.com</span> ·{' '}
                <span className="font-mono">Client123!</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 py-12 text-slate-400">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
        <div className="flex items-center gap-2 text-white">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600">
            <Ticket className="h-3.5 w-3.5" />
          </span>
          <span className="font-semibold tracking-tight">Deskly</span>
        </div>
        <p className="flex items-center gap-1.5 text-sm">
          <Users className="h-4 w-4" />
          Sistema de gestión de tickets · Proyecto full-stack de portfolio
        </p>
        <p className="text-sm">© {new Date().getFullYear()} Deskly</p>
      </div>
    </footer>
  );
}
