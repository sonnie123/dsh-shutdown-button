//#region src/index.ts
const name = "dsh-shutdown-button";
/** Wait after responding so the browser receives the 200 before the server exits. */
const RESPONSE_FLUSH_MS = 200;
/** Required services: the webserver route registry. */
const inject = ["webServer"];
/**
* Register the shutdown route.
* @param ctx - plugin context with the webserver service.
*/
function apply(ctx) {
	ctx.effect(() => ctx.webServer.register({
		kind: "exact",
		path: "/api/dsh-shutdown",
		handler: (_req, res) => {
			res.writeHead(200, { "content-type": "application/json" });
			res.end(JSON.stringify({
				ok: true,
				message: "shutting down"
			}));
			const exit = ctx.get("appExit");
			if (exit === void 0) return;
			setTimeout(() => exit(0), RESPONSE_FLUSH_MS);
		}
	}), "dsh-shutdown-button: /api/dsh-shutdown route");
}
//#endregion
export { apply, inject, name };
