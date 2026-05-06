# AGENTS.md

本文件是 agent 在本仓库工作的导航地图。保持简短、面向任务，控制在 300 行以内。不要把它写成手册。

## 核心规则

agent 需要看到的知识必须放在仓库里。如果某条规则、工作流、架构说明、QA 方法或部署指令会影响 agent 执行任务，就把它放到 `resources/` 下，并从这张地图链接过去。

SRE、生产部署、回滚、nginx 或线上进程管理任务，优先启动专门的 subagent 执行；主 agent 负责确认权限边界、整合结果和向用户交付。

## 上下文加载

- 不要预加载 `resources/` 下的所有文件。
- 不要无脑打开所有外部链接。
- 只加载当前任务真正需要的资源文件。
- 如果资源文件继续指向其他文档，只有在任务需要该细节时才继续加载。
- 优先使用仓库内资源，而不是外部知识库。agent 看不到的知识，对执行来说就不存在。

## 资源地图

- 产品意图和用户可见行为：[resources/PRODUCT.md](resources/PRODUCT.md)
- 工程约定和架构说明：[resources/ENGINEERING.md](resources/ENGINEERING.md)
- 测试、观察、验证命令和质量记录：[resources/QA.md](resources/QA.md)
- 部署和发布操作说明：[resources/DEPLOY.md](resources/DEPLOY.md)
- SRE 生产部署角色：[resources/SRE_AGENT.md](resources/SRE_AGENT.md)
- agent 需求开发流程和交付记录规则：[resources/AGENT_DEVELOPMENT.md](resources/AGENT_DEVELOPMENT.md)

## 外部参考

- Rsbuild 文档：<https://rsbuild.rs/llms.txt>
- Rspack 文档：<https://rspack.rs/llms.txt>
