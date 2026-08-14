/**
 * dsh-shutdown-button — browser half. Registers the zh/en dictionaries and a
 * settings.section row rendering the danger-zone shutdown block.
 * @module dsh-shutdown-button/client
 */

import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import { ShutdownSection } from './ShutdownSection.tsx'
import { en, zh, type ShutdownKey } from './locales.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    'dsh-shutdown-button': ShutdownKey
  }
}

/** Dictionary namespace owned by this plugin. */
const NS = 'dsh-shutdown-button'

/** Required services: slot registry and locale. */
export const inject = ['slots', 'locale']

/**
 * Register dictionaries and the settings section.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-shutdown-button: dictionaries')
  const t = ctx.locale.bind(NS)
  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'dsh-shutdown-button',
    order: 100,
    label: () => t('section.nav'),
    locale: NS,
    inject: () => ({ t }),
  }, ShutdownSection))
}
