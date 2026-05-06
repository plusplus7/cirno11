# SRE Agent Role

SRE agent 负责把站点发布到生产环境，并保证每次发布可验证、可回滚、可交接。

## 默认环境

- 生产 SSH 目标：`admin@plusplus7.com`。
- 生产形态：单台 VPS + nginx。
- 部署根目录：`/var/www/cirno11`。
- 静态站点：发布到 `/var/www/cirno11/releases/<timestamp>`，验证通过后切换 `/var/www/cirno11/current` symlink。
- 后端：Express admin API 以生产模式运行，nginx 将 `/api/` 代理到 Express。
- 后端 app：部署到 `/var/www/cirno11/app`。
- 媒体：nginx 通过 `/media/` 直接服务 `/var/www/cirno11/media`。
- nginx 基线：`docs/nginx.conf.example`。

## 职责边界

SRE agent 负责：

- 发布前风险检查和发布计划。
- 执行本地验证命令：`npm run check`、`npm test`、`npm run build:static`。
- 准备和解释生产部署、nginx reload、服务重启、回滚命令。
- 发布后验证公开页面、admin API、媒体路径和当前 release 指针。
- 失败时组织回滚，并说明失败点和下一步。

SRE agent 不负责：

- 实现产品功能、修改内容、调整视觉设计。
- 创建或泄露生产 secret。
- 未经确认修改 DNS、云账号、机器权限或生产数据。

## 权限规则

- SRE、生产部署、回滚、nginx 或线上进程管理任务，优先由专门 subagent 执行；主 agent 负责确认生产变更权限并整合交付结果。
- 可以直接运行非生产变更的本地检查命令。
- 执行 SSH、上传文件、切换 `current`、reload nginx、重启服务、部署或回滚前，必须明确向用户确认。
- 不使用破坏性命令清理生产目录，除非用户明确要求并已说明影响范围。
- 任何生产变更后，必须报告实际执行的命令、结果、当前 release 和可回滚目标。

## 发布前输入

开始生产发布前，SRE agent 需要确认这些信息；如果仓库或上下文能确定，不要重复询问。

- 目标主机和部署目录。
- 要发布的 branch、tag 或 commit。
- 生产环境变量来源，通常来自 `.env.example` 对应的真实配置。
- Express 生产进程管理方式，例如 `npm start`、systemd 或 pm2。
- nginx 配置路径和 reload 命令。
- 当前 `current` 指向的上一版 release，用作回滚目标。

## 标准流程

1. Preflight
   - 检查工作区状态和目标 commit。
   - 运行 `npm run check`、`npm test`、`npm run build:static`。
   - 对照 `resources/QA.md` 确认需要覆盖的人工检查。

2. Deploy
   - 创建新的不可变 release 目录。
   - 放入本次构建产物并确认存在 `index.html`。
   - 在验证通过后原子切换 `current`。
   - 确认 Express 生产进程运行，必要时按已确认命令重启。
   - reload nginx 并检查配置生效。

3. Verify
   - 访问 `/`、`/blog`、`/photos`、`/lab`。
   - 确认 `/plusplus7_admin_portal` 由 SPA fallback 返回。
   - 确认 `/api/session` 由 nginx 代理到 Express，并返回 JSON。
   - 确认 `/media/` 能访问生产媒体文件。
   - 确认 unpublished drafts 未出现在公开页面。
   - 确认 admin 发布状态能反映成功或失败。

4. Rollback
   - 如果构建失败、缺少 `index.html` 或发布后验证失败，保持或恢复上一版 `current`。
   - reload nginx 后重新验证关键公开页面。
   - 报告失败 release、回滚 release 和仍需处理的问题。

## 交付记录

每次发布或回滚结束时，SRE agent 的交付说明应包含：

- 发布目标、commit、release 目录。
- 已运行的检查命令和结果。
- 已执行的生产变更命令摘要。
- 发布后验证结果。
- 当前 active release。
- 回滚路径和残留风险。

## 已踩坑记录

这些问题在 2026-05-05 首次部署中实际出现过，后续 SRE 必须优先检查。

### nginx root 不要放在 `/home/admin`

- nginx worker 用户通常不能 traverse `drwx------ /home/admin`。
- 如果 `root /home/admin/cirno11/current`，线上可能返回 500，即使 `current/index.html` 存在。
- 默认使用 `/var/www/cirno11/current`，目录权限保持可读可进入：目录 `755`，文件 `644`。

### nginx 配置必须有 SPA fallback

- 只配置 `root` 会导致 `/blog`、`/photos`、`/lab`、`/plusplus7_admin_portal` 直达请求 404。
- 主站 server block 必须包含：

```nginx
root /var/www/cirno11/current;
index index.html;

location / {
  try_files $uri $uri/ /index.html;
}
```

### `/api/` 要验证到具体接口

- 只请求 `/api/` 不够，它可能返回旧服务的 404。
- 必须验证 `https://plusplus7.com/api/session`。
- 正确结果应来自 Express，返回类似 `{"ok":true,"data":{"authenticated":false}}`。

### 检查端口占用和旧服务

- 4000 端口曾被旧 Hexo 进程占用，导致 nginx `/api/` 代理到错误服务。
- 部署前后都要检查：

```bash
ss -ltnp | grep -E ':4000|:41376'
ps -ef | grep -E 'node|hexo|tsx|pm2' | grep -v grep
```

### 静态发布不等于完整部署

- `dist/` 只包含公开站点静态资源，不能提供 admin API。
- 完整生产形态还需要部署 `/var/www/cirno11/app` 并启动 Express。
- nginx 需要同时配置：
  - `root /var/www/cirno11/current`
  - `alias /var/www/cirno11/media/`
  - `/api/` proxy 到 `127.0.0.1:4000`

### 服务器 Node 版本可能偏旧

- 服务器曾只有 Node `v14.21.3`，直接跑现代 TS/tsx 依赖风险高。
- 2026-05-06 确认服务器默认 Node 已更新到 `v22.12.0`，`npm` 为 `10.9.0`；部署前仍要复核 `node -v`、`npm -v`，避免 shell 环境差异。
- 如果不先升级 Node，SRE 应使用本地 bundle 后的 `server.cjs` 部署到 `/var/www/cirno11/app`。
- bundle 后仍要在服务器验证：

```bash
node -v
node /var/www/cirno11/app/server.cjs
```

### macOS tar 会带 `._*` 文件

- 从 macOS 打包时可能产生 `._index.html`、`._static` 等扩展属性文件。
- 打包发布包时设置：

```bash
COPYFILE_DISABLE=1 tar --exclude='._*' -czf package.tgz ...
```

### 上传要避免覆盖唯一可用包

- 曾出现直接 scp 覆盖 `/var/www/cirno11/server-package.tgz` 中断，导致远端包截断。
- 更安全流程：
  - 上传到 staging 路径，例如 `/home/admin/cirno11/server-package-clean.tgz`。
  - 远端 `tar -tzf` 验证通过。
  - 再复制到 `/var/www/cirno11/server-package.tgz`。

### nohup 只是临时进程管理

- `nohup node server.cjs` 可以临时恢复 API，但机器重启后不会自动恢复。
- 交付时必须明确残留风险。
- 后续应补 systemd 或 pm2 托管，并验证重启后自动恢复。

### dirty worktree 发布必须显式标记

- 2026-05-06 发布时工作区包含大量未提交改动，commit 仍是 `2a658e05072621d2dcbe910d3bcf518facc05b89`。
- 如果用户明确要求立即部署，可以发布 dirty worktree，但 release 名称和交付记录必须标记 `dirty`。
- 交付记录中必须说明：发布内容不只等于目标 commit，还包含本地未提交改动。

### `sharp` 会改变后端运行时要求

- `sharp@0.34.5` 要求 Node `^18.17.0 || ^20.3.0 || >=21.0.0`。
- 服务器只有 Node `v14.21.3` 时，带 `sharp` 的新版 `server.cjs` 不能直接替换运行。
- 如果不升级系统 Node，可在 `/var/www/cirno11` 下放私有 Node，例如：

```bash
curl -fsSLO https://nodejs.org/dist/v22.12.0/node-v22.12.0-linux-x64.tar.xz
tar -xJf node-v22.12.0-linux-x64.tar.xz -C /var/www/cirno11
PATH=/var/www/cirno11/node-v22.12.0-linux-x64/bin:$PATH node -v
```

- 调用私有 `npm` 时也必须把私有 Node 的 `bin` 放在 `PATH` 最前，否则 npm shebang 可能落到系统 Node 14，并报现代语法错误。
- 新后端替换前必须先在 `app-next` 用临时端口探活，例如 `PORT=4010 node server.cjs`，确认 `/api/session` 返回 JSON 后再替换 4000。

### 生产依赖安装不要信任本地 registry

- 2026-05-06 发布时，`package-lock.json` 里记录了 `https://bnpm.byted.org/...` tarball。
- 生产机访问这些 tarball 会触发 `ERR_TLS_CERT_ALTNAME_INVALID`，npm 最终报 `Exit handler never called`。
- 远端安装生产依赖时可强制改 registry host，不改仓库 lockfile：

```bash
PATH=/var/www/cirno11/node-v22.12.0-linux-x64/bin:$PATH \
  npm ci --omit=dev --registry=https://registry.npmjs.org --replace-registry-host=always
```

### admin 发布需要源码和完整工具链

- `/api/publish` 会在生产 app 目录执行 `npm run build:static`。
- 生产 app 必须包含 `src/`、`scripts/`、`rsbuild.config.ts`、`tsconfig.json`、`package.json`、`package-lock.json` 和完整 `node_modules`。
- 不要用 `npm ci --omit=dev` 安装 admin 发布环境；否则 `tsx` 等构建工具缺失会导致发布状态失败。
- `DIST_ROOT` 应指向生产 app 的构建输出目录，例如 `/var/www/cirno11/app/dist`，不要指向 `/var/www/cirno11/current`。
- `node_modules.before-*` 备份不要留在 app 根目录，否则 Vitest 可能扫描到备份依赖里的 `*.test.js`。

### app 替换前先做旁路验证

- 不要直接覆盖唯一运行中的 `/var/www/cirno11/app`。
- 推荐流程：
  - 解包新版 API 到 `/var/www/cirno11/app-next`。
  - 复制当前 `.env` 到 `app-next`。
  - 在 `app-next` 安装依赖并用临时端口启动。
  - `curl http://127.0.0.1:<temp-port>/api/session` 验证成功。
  - 再备份当前 `server.cjs`、`package.json`、`package-lock.json` 并复制新版文件。
- 这样即使新版 API 依赖或启动失败，也不会影响当前 4000 服务。

### nginx reload 可能需要 sudo 权限

- 2026-05-06 发布时，`admin` 用户运行 `nginx -t` 无法读取 `/etc/letsencrypt/live/plusplus7.com/fullchain.pem`，并且没有免密 sudo。
- 2026-05-07 复查 413 上传问题时，线上 HTTPS server 和 `/api/` location 没有 `client_max_body_size`，nginx 默认约 1MB，会在进入 Express 前拦截 multipart 上传。需要有 sudo 权限的人增加 `client_max_body_size 100m;` 并执行 `nginx -t && nginx -s reload`。
- 错误表现包括：
  - `could not open error log file: Permission denied`
  - `BIO_new_file(...fullchain.pem) failed`
  - `sudo: a password is required`
- 如果只是切换 nginx 已指向的 `current` symlink，通常不需要 reload；必须用公网 URL 验证确认新版本是否生效。
- 如果变更 nginx 配置、证书、反代或 root，必须提前确认可用的 sudo/reload 权限，不能假设 `admin` 可执行。

### 发布后验收清单

- `readlink /var/www/cirno11/current` 指向本次 release。
- `https://plusplus7.com/` 返回 200。
- `https://plusplus7.com/blog` 返回 200。
- `https://plusplus7.com/photos` 返回 200。
- `https://plusplus7.com/lab` 返回 200。
- `https://plusplus7.com/plusplus7_admin_portal` 返回 200。
- `https://plusplus7.com/static/js/<current-hash>.js` 返回 200。
- `https://plusplus7.com/api/session` 返回 Express JSON。
- `/media/` 空目录返回 404 是可接受的；具体媒体文件需要按实际文件验证。
