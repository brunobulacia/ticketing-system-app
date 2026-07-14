import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Check,
  Frown,
  type LucideIcon,
  Meh,
  Paperclip,
  Smile,
  Sparkles,
} from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { prioritiesApi, statusesApi } from '../api/catalogs.api';
import { apiErrorMessage } from '../api/client';
import { downloadAttachment } from '../api/misc.api';
import { ticketsApi } from '../api/tickets.api';
import { usersApi } from '../api/users.api';
import { Badge, Spinner } from '../components/ui';
import { useAuthStore } from '../stores/auth.store';
import { toast } from '../stores/toast.store';

const SENTIMENT: Record<string, { icon: LucideIcon; label: string; color: string }> = {
  positive: { icon: Smile, label: 'Positivo', color: '#16a34a' },
  neutral: { icon: Meh, label: 'Neutral', color: '#64748b' },
  negative: { icon: Frown, label: 'Negativo', color: '#dc2626' },
};

function SentimentLabel({ value }: { value: string | null }) {
  if (!value || !SENTIMENT[value]) return <b>—</b>;
  const { icon: Icon, label, color } = SENTIMENT[value];
  return (
    <b className="inline-flex items-center gap-1" style={{ color }}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </b>
  );
}

export function TicketDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, hasPermission } = useAuthStore();

  const [commentBody, setCommentBody] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [assigneeId, setAssigneeId] = useState('');

  const { data: ticket, isLoading } = useQuery({
    queryKey: ['tickets', id],
    queryFn: () => ticketsApi.get(id),
  });
  const { data: comments } = useQuery({
    queryKey: ['tickets', id, 'comments'],
    queryFn: () => ticketsApi.comments(id),
  });
  const { data: history } = useQuery({
    queryKey: ['tickets', id, 'history'],
    queryFn: () => ticketsApi.history(id),
  });
  const { data: attachments } = useQuery({
    queryKey: ['tickets', id, 'attachments'],
    queryFn: () => ticketsApi.attachments(id),
  });
  const { data: statuses } = useQuery({ queryKey: ['statuses'], queryFn: () => statusesApi.list() });
  const { data: priorities } = useQuery({ queryKey: ['priorities'], queryFn: () => prioritiesApi.list() });

  const canAssign = hasPermission('tickets.assign');
  const { data: agents } = useQuery({
    queryKey: ['users', 'agents'],
    queryFn: () => usersApi.list({ limit: 100 }),
    enabled: canAssign,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['tickets', id] });
    queryClient.invalidateQueries({ queryKey: ['tickets'] });
  };

  const updateMutation = useMutation({
    mutationFn: (patch: Parameters<typeof ticketsApi.update>[1]) =>
      ticketsApi.update(id, patch),
    onSuccess: invalidate,
    onError: (err) => toast.error('Error', apiErrorMessage(err)),
  });

  const commentMutation = useMutation({
    mutationFn: () => ticketsApi.addComment(id, commentBody, isInternal),
    onSuccess: () => {
      setCommentBody('');
      queryClient.invalidateQueries({ queryKey: ['tickets', id, 'comments'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', id, 'history'] });
    },
    onError: (err) => toast.error('Error', apiErrorMessage(err)),
  });

  if (isLoading || !ticket) return <Spinner />;

  const isClosed = ticket.status.isFinal;
  const ai = ticket.aiSuggestions ?? {};

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      {/* Columna principal */}
      <div className="space-y-6 xl:col-span-2">
        <div className="card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs text-slate-400">
                TCK-{String(ticket.number).padStart(5, '0')}
              </p>
              <h1 className="text-xl font-bold">{ticket.title}</h1>
            </div>
            <div className="flex shrink-0 gap-2">
              <Badge label={ticket.status.name} color={ticket.status.color} />
              <Badge label={ticket.priority.name} color={ticket.priority.color} />
            </div>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">
            {ticket.description}
          </p>
          {ticket.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {ticket.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500 md:grid-cols-4">
            <p>Categoría: <b>{ticket.category.name}</b></p>
            <p>Depto: <b>{ticket.department.name}</b></p>
            <p>Solicitante: <b>{ticket.requester.firstName} {ticket.requester.lastName}</b></p>
            <p className="flex items-center gap-1">Sentimiento: <SentimentLabel value={ticket.sentiment} /></p>
          </div>
        </div>

        {/* Comentarios (FR-014) */}
        <div className="card">
          <h2 className="mb-3 font-semibold">Comentarios</h2>
          <div className="space-y-3">
            {(comments ?? []).map((comment) => (
              <div
                key={comment.id}
                className={`rounded-lg border p-3 ${
                  comment.isInternal
                    ? 'border-amber-200 bg-amber-50'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-medium text-slate-700">
                    {comment.author.firstName} {comment.author.lastName}
                    {comment.isInternal && (
                      <span className="ml-2 rounded bg-amber-200 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
                        INTERNO
                      </span>
                    )}
                  </span>
                  <span>{new Date(comment.createdAt).toLocaleString('es')}</span>
                </div>
                <p className="mt-1 whitespace-pre-wrap text-sm">{comment.body}</p>
                {Object.entries(comment.translations ?? {}).map(([lang, text]) => (
                  <p key={lang} className="mt-2 rounded bg-white p-2 text-xs italic text-slate-500">
                    [{lang}] {text}
                  </p>
                ))}
                <button
                  className="mt-1 text-[11px] text-indigo-500 hover:underline"
                  onClick={async () => {
                    await ticketsApi.translateComment(comment.id, 'en');
                    toast.info('Traducción solicitada', 'Llegará en unos segundos');
                  }}
                >
                  Traducir a inglés (IA)
                </button>
              </div>
            ))}
            {(comments ?? []).length === 0 && (
              <p className="text-sm text-slate-400">Aún no hay comentarios.</p>
            )}
          </div>

          {!isClosed && (
            <form
              className="mt-4 space-y-2"
              onSubmit={(e) => {
                e.preventDefault();
                commentMutation.mutate();
              }}
            >
              <textarea
                className="input min-h-20"
                placeholder="Escribe un comentario…"
                value={commentBody}
                onChange={(e) => setCommentBody(e.target.value)}
                required
              />
              <div className="flex items-center justify-between">
                {hasPermission('comments.internal') ? (
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                    />
                    Comentario interno
                  </label>
                ) : (
                  <span />
                )}
                <button
                  className="btn-primary"
                  disabled={commentMutation.isPending}
                >
                  Comentar
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Historial (FR-016) */}
        <div className="card">
          <h2 className="mb-3 font-semibold">Historial</h2>
          <ol className="space-y-2 text-sm">
            {(history ?? []).map((entry) => (
              <li key={entry.id} className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-400" />
                <div>
                  <p className="text-slate-700">
                    <b>
                      {entry.actor
                        ? `${entry.actor.firstName} ${entry.actor.lastName}`
                        : 'Sistema'}
                    </b>{' '}
                    {describeHistory(entry.action, entry.field, entry.oldValue, entry.newValue)}
                  </p>
                  <p className="text-xs text-slate-400">
                    {new Date(entry.createdAt).toLocaleString('es')}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Columna lateral */}
      <div className="space-y-6">
        {/* Acciones */}
        {hasPermission('tickets.edit') && (
          <div className="card space-y-3">
            <h2 className="font-semibold">Acciones</h2>
            <div>
              <label className="label">Estado</label>
              <select
                className="input"
                value={ticket.status.id}
                onChange={(e) => updateMutation.mutate({ statusId: e.target.value })}
              >
                {statuses?.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Prioridad</label>
              <select
                className="input"
                value={ticket.priority.id}
                disabled={isClosed}
                onChange={(e) => updateMutation.mutate({ priorityId: e.target.value })}
              >
                {priorities?.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            {canAssign && (
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <label className="label">Asignación (FR-017)</label>
                <div className="flex gap-2">
                  <select
                    className="input"
                    value={assigneeId}
                    onChange={(e) => setAssigneeId(e.target.value)}
                  >
                    <option value="">Elegir agente…</option>
                    {agents?.items
                      .filter((u) => u.role.name !== 'Customer' && u.isActive)
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.firstName} {u.lastName}
                        </option>
                      ))}
                  </select>
                  <button
                    className="btn-secondary shrink-0"
                    disabled={!assigneeId}
                    onClick={async () => {
                      await ticketsApi.assign(id, 'manual', assigneeId);
                      invalidate();
                    }}
                  >
                    Asignar
                  </button>
                </div>
                <button
                  className="btn-secondary w-full"
                  onClick={async () => {
                    try {
                      await ticketsApi.assign(id, 'auto');
                      invalidate();
                      toast.success('Asignación automática realizada');
                    } catch (err) {
                      toast.error('Error', apiErrorMessage(err));
                    }
                  }}
                >
                  <Bot className="h-4 w-4" /> Asignación automática
                </button>
              </div>
            )}
            {hasPermission('tickets.delete') && (
              <button
                className="btn-danger w-full"
                onClick={async () => {
                  if (!confirm('¿Eliminar este ticket? (eliminación lógica)')) return;
                  await ticketsApi.remove(id);
                  toast.success('Ticket eliminado');
                  navigate('/tickets');
                }}
              >
                Eliminar ticket
              </button>
            )}
          </div>
        )}

        {/* Asistente IA (FR-021..FR-025) */}
        <div className="card space-y-3">
          <h2 className="flex items-center gap-2 font-semibold">
            <Sparkles className="h-4 w-4 text-indigo-500" /> Asistente IA
          </h2>
          {(ai.categoryName || ai.departmentName || ai.priorityName) && (
            <div className="rounded-lg bg-indigo-50 p-3 text-xs text-indigo-800">
              <p className="font-semibold">Sugerencias de clasificación:</p>
              {ai.categoryName && <p>Categoría: {ai.categoryName}</p>}
              {ai.departmentName && <p>Departamento: {ai.departmentName}</p>}
              {ai.priorityName && <p>Prioridad: {ai.priorityName}</p>}
            </div>
          )}
          {ai.summary && (
            <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-700">
              <p className="font-semibold">Resumen:</p>
              <p>{ai.summary}</p>
            </div>
          )}
          {ai.reply && (
            <div className="rounded-lg bg-green-50 p-3 text-xs text-green-800">
              <p className="font-semibold">Respuesta sugerida:</p>
              <p className="whitespace-pre-wrap">{ai.reply}</p>
              <button
                className="mt-1 text-indigo-600 hover:underline"
                onClick={() => setCommentBody(ai.reply ?? '')}
              >
                Usar como comentario
              </button>
            </div>
          )}
          {(ai.similar?.length ?? 0) > 0 && (
            <div className="text-xs">
              <p className="font-semibold text-slate-600">Tickets similares:</p>
              {ai.similar?.map((s) => (
                <button
                  key={s.id}
                  className="block truncate text-indigo-600 hover:underline"
                  onClick={() => navigate(`/tickets/${s.id}`)}
                >
                  #{s.number} — {s.title}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <button
              className="btn-secondary flex-1 text-xs"
              onClick={async () => {
                await ticketsApi.requestSummary(id);
                toast.info('Resumen solicitado', 'Se generará en segundos');
              }}
            >
              Resumir
            </button>
            <button
              className="btn-secondary flex-1 text-xs"
              onClick={async () => {
                await ticketsApi.requestReply(id);
                toast.info('Respuesta solicitada', 'Se generará en segundos');
              }}
            >
              Sugerir respuesta
            </button>
          </div>
        </div>

        {/* SLA (FR-029) */}
        <div className="card text-sm">
          <h2 className="mb-2 font-semibold">SLA</h2>
          <SlaRow label="Respuesta" due={ticket.slaResponseDue} done={ticket.firstResponseAt} />
          <SlaRow label="Resolución" due={ticket.slaResolutionDue} done={ticket.resolvedAt} />
        </div>

        {/* Adjuntos (FR-015) */}
        <div className="card">
          <h2 className="mb-2 font-semibold">Adjuntos</h2>
          <ul className="space-y-1 text-sm">
            {(attachments ?? []).map((a) => (
              <li key={a.id}>
                <button
                  className="inline-flex items-center gap-1 text-indigo-600 hover:underline"
                  onClick={() => downloadAttachment(a.id, a.originalName)}
                >
                  <Paperclip className="h-3.5 w-3.5" /> {a.originalName}
                </button>
                <span className="ml-1 text-xs text-slate-400">
                  ({Math.round(a.size / 1024)} KB)
                </span>
              </li>
            ))}
            {(attachments ?? []).length === 0 && (
              <p className="text-xs text-slate-400">Sin adjuntos</p>
            )}
          </ul>
          {!isClosed && (
            <input
              type="file"
              multiple
              className="input mt-3"
              onChange={async (e) => {
                const files = [...(e.target.files ?? [])];
                if (files.length === 0) return;
                try {
                  await ticketsApi.uploadAttachments(id, files);
                  queryClient.invalidateQueries({
                    queryKey: ['tickets', id, 'attachments'],
                  });
                  toast.success('Archivos subidos');
                } catch (err) {
                  toast.error('Error al subir', apiErrorMessage(err));
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );

  function describeHistory(
    action: string,
    field: string | null,
    oldValue: string | null,
    newValue: string | null,
  ): ReactNode {
    switch (action) {
      case 'created':
        return 'creó el ticket';
      case 'status_changed':
        return (
          <span className="inline-flex flex-wrap items-center gap-1">
            cambió el estado: {oldValue}
            <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
            {newValue}
          </span>
        );
      case 'assigned':
        return `asignó el ticket a ${newValue}`;
      case 'commented':
        return 'agregó un comentario';
      case 'deleted':
        return 'eliminó el ticket';
      case 'attachment_added':
        return `adjuntó: ${newValue}`;
      case 'updated':
        return `actualizó ${field ?? 'el ticket'}`;
      default:
        return action;
    }
  }
}

function SlaRow({
  label,
  due,
  done,
}: {
  label: string;
  due: string | null;
  done: string | null;
}) {
  if (!due) return null;
  const dueDate = new Date(due);
  const isDone = !!done;
  const isLate = !isDone && dueDate < new Date();
  return (
    <div className="flex items-center justify-between border-b border-slate-50 py-1.5 last:border-0">
      <span className="text-slate-500">{label}</span>
      <span
        className={`inline-flex items-center gap-1 text-xs font-medium ${
          isDone ? 'text-green-600' : isLate ? 'text-red-600' : 'text-slate-700'
        }`}
      >
        {isDone ? (
          <>
            <Check className="h-3.5 w-3.5" /> Cumplido
          </>
        ) : (
          <>
            {isLate && <AlertTriangle className="h-3.5 w-3.5" />}
            {isLate ? 'Vencido: ' : 'Vence: '}
            {dueDate.toLocaleString('es')}
          </>
        )}
      </span>
    </div>
  );
}
