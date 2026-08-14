# dsh-shutdown-button

在 DeepSeek Harness Web GUI 设置页添加"危险操作"区块：一个关闭按钮 + 勾选确认（RiskConfirmation），确认后优雅关闭服务，并尝试自动关闭当前标签页（浏览器不允许时显示"请手动关闭此标签页"提示）。

## 结构

- `src/index.ts` — Host 面：注册 `POST /api/dsh-shutdown`，应答后调 `ctx.appExit(0)` 触发优雅关闭（5 秒超时兜底）
- `src/client/` — Client 面：注册 `settings.section` 插槽（危险操作区块）、中/英词条、关闭按钮 + 确认 + 关标签页状态机
- `cordis.patch.yml` — bundle 层：插入插件行（同时是 host 插件行与浏览器 roster 行）
- `tsdown.config.ts` — 双面构建（`lib/index.js` + `lib/client.js`）

## 安装

```powershell
# 在 deepseek-harness checkout 目录执行
pnpm dsh plugin --profile web add <本插件目录绝对路径>
pnpm dsh web   # 重启 web 生效
```

`dsh plugin add` 会：pnpm link 依赖到 `$DSH_HOME/profiles/web`，并把包追加进 `dsh.profile.bundles`。

## 构建（源码改动后）

```powershell
& "D:\APPLICATIONS\DSH\deepseek-harness\node_modules\.bin\tsdown.cmd" --config ".\tsdown.config.ts"
```

产物：`lib/index.js`（host）、`lib/client.js`（browser bundle，经 `/plugins/dsh-shutdown-button/client.js` 加载，刷新页面即取新版本）。

## 卸载 / 回滚

```powershell
pnpm dsh plugin --profile web remove dsh-shutdown-button
pnpm dsh web   # 重启后按钮消失，功能还原
```

或手动删除 `C:\Users\21313\.dsh\profiles\web\package.json` 中的 `dsh-shutdown-button` 依赖与 bundles 条目。

## 行为

| 场景 | 行为 |
|---|---|
| 点击关闭（未勾选） | 确认按钮禁用 |
| 勾选 + 确认 | POST 关闭路由 → 服务优雅退出 → 尝试关标签页（成功或显示提示） |
| 请求失败 | 显示错误提示，服务保持运行 |
| 非 launcher 环境 | 路由应答但不退出 |
| 标签页被浏览器阻止关闭 | 显示"服务已关闭，请手动关闭此标签页" |

## harness 升级后的适配与验证

本插件与 harness 的 API 有耦合（`webServer`/`appExit`/`slots`/`locale`/`RiskConfirmation`/模块表）。harness 升级后按以下流程处理：

**1. 验证插件层还在组合树里**

```powershell
# 在 deepseek-harness checkout 目录
pnpm dsh --profile web --dump-config 2>&1 | Select-String "dsh-shutdown-button"
```

预期输出含 `# == dsh-shutdown-button` 与插件行；没有则用 `pnpm dsh plugin --profile web add <插件目录>` 重新安装。

**2. 重新构建插件（对齐新版 API）**

```powershell
# 在插件目录
& "D:\APPLICATIONS\DSH\deepseek-harness\node_modules\.bin\tsdown.cmd" --config ".\tsdown.config.ts"
```

编译期不报错不代表运行兼容——以运行验证为准。

**3. 重启并做运行验证**

```powershell
pnpm dsh web   # 控制台无插件加载报错
```

浏览器打开设置页：危险操作区块在不在 → 点一次关闭，确认服务优雅退出。

**4. 出问题时的处理**

- 快速回滚：`pnpm dsh plugin --profile web remove dsh-shutdown-button` → 重启即还原，不影响 harness
- 适配升级：改动集中在 `src/index.ts`（host）与 `src/client/index.ts`（client），改完重新构建 + 刷新页面（`link:` 依赖保持，无需重装）

**peerDependencies 说明**：当前为 `"*"` 宽松匹配；升级后若出现运行期错误，优先检查上表耦合点，必要时收紧版本号或调整 API 用法。
