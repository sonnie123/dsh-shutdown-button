/** Dictionary keys owned by dsh-shutdown-button. */
export interface ShutdownKey {
  'section.nav': string
  'button.label': string
  'confirm.title': string
  'confirm.description': string
  'confirm.acknowledge': string
  'confirm.confirm': string
  'confirm.cancel': string
  'error.failed': string
  'closing.message': string
  'closed.message': string
}

export const zh: ShutdownKey = {
  'section.nav': '危险操作',
  'button.label': '关闭 DeepSeek Harness',
  'confirm.title': '关闭 DeepSeek Harness？',
  'confirm.description': '服务将停止运行，所有进行中的会话都会中断。关闭后需要重新启动 dsh web 才能继续使用。',
  'confirm.acknowledge': '我了解服务将停止',
  'confirm.confirm': '确认关闭',
  'confirm.cancel': '取消',
  'error.failed': '关闭请求失败，服务仍在运行。',
  'closing.message': '正在关闭服务…',
  'closed.message': '服务已关闭，请手动关闭此标签页。',
}

export const en: ShutdownKey = {
  'section.nav': 'Danger Zone',
  'button.label': 'Shut Down DeepSeek Harness',
  'confirm.title': 'Shut down DeepSeek Harness?',
  'confirm.description': 'The service will stop and all running sessions will be interrupted. Restart dsh web to use it again.',
  'confirm.acknowledge': 'I understand the service will stop',
  'confirm.confirm': 'Shut down',
  'confirm.cancel': 'Cancel',
  'error.failed': 'Shutdown request failed; the service is still running.',
  'closing.message': 'Shutting down…',
  'closed.message': 'Service stopped. You can close this tab now.',
}
