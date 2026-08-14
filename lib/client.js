window.__ModuleLoader__.load({
	id: "dsh-shutdown-button",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region src/client/ShutdownSection.tsx
		/**
		* Danger-zone settings section: the shutdown button plus a risk confirmation.
		* Confirm is gated behind an explicit checkbox (RiskConfirmation); on confirm
		* the section POSTs the shutdown route and the page disconnects as the
		* service exits gracefully. After the 200, the section tries window.close();
		* browsers only honor it for script-opened tabs, so when the page survives we
		* switch to a "close this tab manually" overlay instead.
		*/
		/** Delay before attempting window.close so the 200 has rendered state. */
		const CLOSE_DELAY_MS = 500;
		/**
		* Render the shutdown section.
		* @param props - composed slot props (runtime share + injected locale binder).
		* @returns the section element tree.
		*/
		function ShutdownSection({ t }) {
			const [open, setOpen] = (0, react.useState)(false);
			const [acknowledged, setAcknowledged] = (0, react.useState)(false);
			const [phase, setPhase] = (0, react.useState)("idle");
			const [failed, setFailed] = (0, react.useState)(false);
			const requestShutdown = () => {
				setFailed(false);
				setPhase("closing");
				fetch("/api/dsh-shutdown", { method: "POST" }).then(() => {
					window.setTimeout(() => {
						window.close();
					}, CLOSE_DELAY_MS);
					window.setTimeout(() => {
						setPhase("closed");
					}, 2e3);
				}).catch(() => {
					setPhase("idle");
					setFailed(true);
				});
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					flexDirection: "column",
					gap: 8,
					alignItems: "flex-start"
				},
				children: [
					phase === "closing" || phase === "closed" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: {
							position: "fixed",
							inset: 0,
							zIndex: 9999,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							background: "rgba(15, 17, 21, 0.92)",
							color: "#fff",
							fontFamily: "system-ui, sans-serif",
							fontSize: 16,
							textAlign: "center",
							padding: 24
						},
						children: phase === "closing" ? t("closing.message") : t("closed.message")
					}) : null,
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						variant: "primary",
						onClick: () => {
							setOpen(true);
						},
						children: t("button.label")
					}),
					failed && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("error.failed") }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.RiskConfirmation, {
						open,
						title: t("confirm.title"),
						description: t("confirm.description"),
						acknowledgeLabel: t("confirm.acknowledge"),
						cancelLabel: t("confirm.cancel"),
						confirmLabel: t("confirm.confirm"),
						acknowledged,
						onAcknowledgedChange: setAcknowledged,
						onCancel: () => {
							setOpen(false);
						},
						onConfirm: () => {
							setOpen(false);
							requestShutdown();
						}
					})
				]
			});
		}
		//#endregion
		//#region src/client/locales.ts
		const zh = {
			"section.nav": "危险操作",
			"button.label": "关闭 DeepSeek Harness",
			"confirm.title": "关闭 DeepSeek Harness？",
			"confirm.description": "服务将停止运行，所有进行中的会话都会中断。关闭后需要重新启动 dsh web 才能继续使用。",
			"confirm.acknowledge": "我了解服务将停止",
			"confirm.confirm": "确认关闭",
			"confirm.cancel": "取消",
			"error.failed": "关闭请求失败，服务仍在运行。",
			"closing.message": "正在关闭服务…",
			"closed.message": "服务已关闭，请手动关闭此标签页。"
		};
		const en = {
			"section.nav": "Danger Zone",
			"button.label": "Shut Down DeepSeek Harness",
			"confirm.title": "Shut down DeepSeek Harness?",
			"confirm.description": "The service will stop and all running sessions will be interrupted. Restart dsh web to use it again.",
			"confirm.acknowledge": "I understand the service will stop",
			"confirm.confirm": "Shut down",
			"confirm.cancel": "Cancel",
			"error.failed": "Shutdown request failed; the service is still running.",
			"closing.message": "Shutting down…",
			"closed.message": "Service stopped. You can close this tab now."
		};
		//#endregion
		//#region src/client/index.ts
		/** Dictionary namespace owned by this plugin. */
		const NS = "dsh-shutdown-button";
		/** Required services: slot registry and locale. */
		const inject = ["slots", "locale"];
		/**
		* Register dictionaries and the settings section.
		* @param ctx - client root context.
		*/
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "dsh-shutdown-button: dictionaries");
			const t = ctx.locale.bind(NS);
			ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: "dsh-shutdown-button",
				order: 100,
				label: () => t("section.nav"),
				locale: NS,
				inject: () => ({ t })
			}, ShutdownSection));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
