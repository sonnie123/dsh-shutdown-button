/**
 * Danger-zone settings section: the shutdown button plus a risk confirmation.
 * Confirm is gated behind an explicit checkbox (RiskConfirmation); on confirm
 * the section POSTs the shutdown route and the page disconnects as the
 * service exits gracefully. After the 200, the section tries window.close();
 * browsers only honor it for script-opened tabs, so when the page survives we
 * switch to a "close this tab manually" overlay instead.
 */
import { useState } from 'react'
import { Button, RiskConfirmation } from '@deepseek-ai/dsh-client-ui-primitives'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { ShutdownKey } from './locales.ts'

/** Full component props: settings-section runtime share plus the injected locale binder. */
export type ShutdownSectionProps = PropsRuntime<'settings.section'> & {
  /** Locale-bound translation function for this plugin's dictionary namespace. */
  t: (key: keyof ShutdownKey) => string
}

/** Shutdown flow phases: idle → closing (try window.close) → closed (tab survived). */
type Phase = 'idle' | 'closing' | 'closed'

/** Delay before attempting window.close so the 200 has rendered state. */
const CLOSE_DELAY_MS = 500
/** How long to wait for window.close before declaring the tab survived. */
const CLOSE_SETTLE_MS = 1500

/**
 * Render the shutdown section.
 * @param props - composed slot props (runtime share + injected locale binder).
 * @returns the section element tree.
 */
export function ShutdownSection({ t }: ShutdownSectionProps) {
  const [open, setOpen] = useState(false)
  const [acknowledged, setAcknowledged] = useState(false)
  const [phase, setPhase] = useState<Phase>('idle')
  const [failed, setFailed] = useState(false)

  const requestShutdown = (): void => {
    setFailed(false)
    setPhase('closing')
    fetch('/api/dsh-shutdown', { method: 'POST' })
      .then(() => {
        // The service confirmed; try to close this tab (script-opened tabs
        // close; manually opened ones are blocked by the browser).
        window.setTimeout(() => { window.close() }, CLOSE_DELAY_MS)
        // If the tab is still alive after the close attempt, tell the user.
        window.setTimeout(() => { setPhase('closed') }, CLOSE_DELAY_MS + CLOSE_SETTLE_MS)
      })
      .catch(() => { setPhase('idle'); setFailed(true) })
  }

  const overlay = phase === 'closing' || phase === 'closed'
    ? (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(15, 17, 21, 0.92)', color: '#fff',
        fontFamily: 'system-ui, sans-serif', fontSize: 16, textAlign: 'center',
        padding: 24,
      }}>
        {phase === 'closing' ? t('closing.message') : t('closed.message')}
      </div>
    )
    : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
      {overlay}
      <Button variant="primary" onClick={() => { setOpen(true) }}>
        {t('button.label')}
      </Button>
      {failed && <span>{t('error.failed')}</span>}
      <RiskConfirmation
        open={open}
        title={t('confirm.title')}
        description={t('confirm.description')}
        acknowledgeLabel={t('confirm.acknowledge')}
        cancelLabel={t('confirm.cancel')}
        confirmLabel={t('confirm.confirm')}
        acknowledged={acknowledged}
        onAcknowledgedChange={setAcknowledged}
        onCancel={() => { setOpen(false) }}
        onConfirm={() => { setOpen(false); requestShutdown() }}
      />
    </div>
  )
}
