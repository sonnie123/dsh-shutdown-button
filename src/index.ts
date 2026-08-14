/**
 * dsh-shutdown-button — host half. Registers POST /api/dsh-shutdown; after
 * answering 200 it requests a bounded graceful exit through ctx.appExit
 * (wired by the launcher to the 5s-grace shutdown controller). Outside a
 * launcher boot (tests) appExit is absent and the route answers without
 * exiting.
 * @module dsh-shutdown-button
 */

import type { Context } from '@deepseek-ai/cordis'
import type { AppExit } from '@deepseek-ai/dsh-cmdline'
import type {} from '@deepseek-ai/dsh-cmdline'
import type {} from '@deepseek-ai/dsh-host-webserver'

export const name = 'dsh-shutdown-button'

/** Wait after responding so the browser receives the 200 before the server exits. */
const RESPONSE_FLUSH_MS = 200

/** Required services: the webserver route registry. */
export const inject = ['webServer']

/**
 * Register the shutdown route.
 * @param ctx - plugin context with the webserver service.
 */
export function apply(ctx: Context): void {
  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: '/api/dsh-shutdown',
    handler: (_req, res) => {
      res.writeHead(200, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ ok: true, message: 'shutting down' }))
      const exit = ctx.get('appExit') as AppExit | undefined
      if (exit === undefined) return // non-launcher context: answer without exiting
      setTimeout(() => exit(0), RESPONSE_FLUSH_MS)
    },
  }), 'dsh-shutdown-button: /api/dsh-shutdown route')
}
