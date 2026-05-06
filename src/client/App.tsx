import { useEffect, useMemo, useRef, useState } from 'react';
import siteData from './generated/site-data.json';
import { api } from './api';
import type { AboutContent, BlogPost, LabTool, PhotoEntry, PublicBlogPost, SiteData } from '../shared/types';
import './styles/app.css';

const data = siteData as SiteData;
const homeEntryImage = new URL('./assets/home-entry-scenes.jpg', import.meta.url).href;
const adminRoute = '/plusplus7_admin_portal';

const ownerProfile = {
  head: 'plusplus7',
  name: '加七的个人主页',
  intro: '新的博客系统已上线',
  links: [
    { label: '文章', path: '/blog' },
    { label: '摄影', path: '/photos' },
    { label: '杂物间', path: '/lab' },
    { label: '关于我', path: '/about' },
  ],
};

const publicNav = [
  { label: '主页', path: '/' },
  { label: '文章', path: '/blog' },
  { label: '摄影', path: '/photos' },
  { label: '杂物间', path: '/lab' },
];

function route(): string {
  return window.location.pathname;
}

function pathFrom(nextPath: string): string {
  return new URL(nextPath, window.location.origin).pathname;
}

export function App() {
  const [path, setPath] = useState(route());

  useEffect(() => {
    const onPop = () => setPath(route());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = (nextPath: string) => {
    window.history.pushState({}, '', nextPath);
    setPath(pathFrom(nextPath));
  };

  if (path === adminRoute) {
    return (
      <main className="admin-app">
        <Admin />
      </main>
    );
  }

  return (
    <main className="public-app">
      <PublicShell path={path} navigate={navigate}>
        {path.startsWith('/blog/') ? (
          <BlogDetail slug={decodeURIComponent(path.replace('/blog/', ''))} navigate={navigate} />
        ) : path === '/blog' ? (
          <BlogList navigate={navigate} />
        ) : path === '/photos' ? (
          <Photos />
        ) : path === '/lab' ? (
          <Lab />
        ) : path === '/about' ? (
          <About />
        ) : (
          <Home navigate={navigate} />
        )}
      </PublicShell>
    </main>
  );
}

function PublicShell({ children, path, navigate }: { children: React.ReactNode; path: string; navigate: (path: string) => void }) {
  const tagCounts = useMemo(() => getTagCounts(data.posts), []);
  const isHome = path === '/';

  return (
    <div className="site-frame">
      <header className="site-header">
        <button className="brand-mark" onClick={() => navigate('/')}>
          <span>{ownerProfile.head}</span>
        </button>
        <nav className="site-nav" aria-label="Public navigation">
          {publicNav.map((item) => (
            <button className={isActivePath(path, item.path) ? 'active' : ''} key={item.path} onClick={() => navigate(item.path)}>
              {item.label}
            </button>
          ))}
        </nav>
      </header>
      <div className={`archive-layout ${isHome ? 'home-shell' : ''}`}>
        {!isHome && (
          <aside className="archive-aside" aria-label="Archive profile">
            <div className="profile-card">
              <h1>{ownerProfile.name}</h1>
              <p>{ownerProfile.intro}</p>
              <div className="profile-links">
                {ownerProfile.links.map((link) => (
                  <button key={link.path} onClick={() => navigate(link.path)}>{link.label}</button>
                ))}
              </div>
            </div>
            <div className="aside-block">
              <dl className="stat-list">
                <div><dt>文章</dt><dd>{data.posts.length}</dd></div>
                <div><dt>标签</dt><dd>{Object.keys(tagCounts).length}</dd></div>
              </dl>
            </div>
          </aside>
        )}
        <div className="content-stage">{children}</div>
      </div>
      <SiteFooter />
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <span><a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">蜀ICP备15023168号-1</a></span>
      <span>© Copyright 2014 - 2026 plusplus7.com</span>
      <span>Designer & Author: plusplus7</span>
      <span>ECS & Azure</span>
    </footer>
  );
}

function Home({ navigate }: { navigate: (path: string) => void }) {
  const sections = [
    { label: 'Writing', title: '文章', path: '/blog', imageClass: 'entry-writing' },
    { label: 'Photography', title: '摄影', path: '/photos', imageClass: 'entry-photography' },
    { label: 'Lab', title: '杂物间', path: '/lab', imageClass: 'entry-lab' },
    { label: 'About', title: '关于我', path: '/about', imageClass: 'entry-about' },
  ];

  return (
    <section className="page page-home">
      <div className="section-index home-entry-list">
        {sections.map((section) => (
          <button className="section-tile" key={section.path} onClick={() => navigate(section.path)}>
            <span className={`section-tile-art ${section.imageClass}`}>
              <img src={homeEntryImage} alt="" loading="eager" />
            </span>
            <span className="section-tile-copy">
              <span>{section.label}</span>
              <strong>{section.title}</strong>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function About() {
  const about = data.about;

  return (
    <section className="page page-about">
      <PageHeader eyebrow="About" title="关于我" description="个人简历和一些可公开的背景信息。" />
      <div className="about-card" aria-labelledby="about-profile-title">
        <h2 id="about-profile-title">{about.heading}</h2>
        <p>{about.intro}</p>
        <dl className="resume-list">
          {about.sections.map((section) => (
            <div key={section.term}>
              <dt>{section.term}</dt>
              <dd>{section.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function BlogList({ navigate }: { navigate: (path: string) => void }) {
  const [tag, setTag] = useState(() => new URLSearchParams(window.location.search).get('tag') ?? '');
  const tags = useMemo(() => Object.entries(getTagCounts(data.posts)).sort(([a], [b]) => a.localeCompare(b)), []);
  const posts = tag ? data.posts.filter((post) => post.tags.includes(tag)) : data.posts;

  return (
    <section className="page">
      <PageHeader eyebrow="Article Archive" title="文章" description="技术笔记、解题报告、旅行、游戏和生活记录.." />
      <div className="filter-bar">
        <button className={!tag ? 'active' : ''} onClick={() => setTag('')}>All <span>{data.posts.length}</span></button>
        {tags.map(([item, count]) => (
          <button className={tag === item ? 'active' : ''} key={item} onClick={() => setTag(item)}>
            {item}<span>{count}</span>
          </button>
        ))}
      </div>
      <p className="result-line">{posts.length} post{posts.length === 1 ? '' : 's'} {tag ? `tagged ${tag}` : 'in the archive'}</p>
      <div className="post-list">
        {posts.length > 0 ? posts.map((post) => (
          <article className="post-row" key={post.slug}>
            <div className="post-date">{formatDate(post.date)}</div>
            <div>
              <button className="text-link post-title-link" onClick={() => navigate(`/blog/${post.slug}`)}>{post.title}</button>
              <p>{postExcerpt(post)}</p>
              <div className="tags">
                {post.tags.map((item) => <span key={item}>{item}</span>)}
              </div>
            </div>
          </article>
        )) : (
          <EmptyState title="没有匹配的文章" body="换一个标签，或者回到完整文章列表。" actionLabel="查看全部" onAction={() => setTag('')} />
        )}
      </div>
    </section>
  );
}

function BlogDetail({ slug, navigate }: { slug: string; navigate: (path: string) => void }) {
  const post = data.posts.find((item) => item.slug === slug);
  if (!post) {
    return (
      <section className="page">
        <EmptyState title="Post not found" body="这篇文章不在当前公开归档中。" actionLabel="返回文章列表" onAction={() => navigate('/blog')} />
      </section>
    );
  }

  return (
    <article className="article page">
      <button className="back-link" onClick={() => navigate('/blog')}>返回文章列表</button>
      <header className="article-header">
        <p className="eyebrow">{formatDate(post.date)}</p>
        <h1>{post.title}</h1>
        {post.summary && <p className="article-summary">{post.summary}</p>}
        <div className="tags">{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      </header>
      <div className="article-body" dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
  );
}

function Photos() {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoEntry | undefined>();
  const grouped = data.photos.reduce<Record<string, PhotoEntry[]>>((groups, photo) => {
    groups[photo.date] = [...(groups[photo.date] ?? []), photo];
    return groups;
  }, {});
  const groups = Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a));

  useEffect(() => {
    if (!selectedPhoto) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedPhoto(undefined);
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [selectedPhoto]);

  return (
    <section className="page">
      <PageHeader eyebrow="Photography" title="摄影" description="按拍摄日期整理照片，保留地点和当时的片段。" />
      {groups.length > 0 ? groups.map(([date, photos]) => (
        <section className="photo-group" key={date}>
          <div className="date-marker">
            <span>{formatDate(date)}</span>
            <small>{photos.length} photo{photos.length === 1 ? '' : 's'}</small>
          </div>
          <div className="photo-grid">
            {photos.map((photo) => (
              <figure className="photo-card" key={photo.id}>
                <button className="photo-card-button" type="button" onClick={() => setSelectedPhoto(photo)} aria-label={`Open ${photo.title}`}>
                  <img src={photo.thumbnailUrl ?? photo.imageUrl} alt={photo.title} />
                  <span className="photo-card-caption">
                    <strong>{photo.title}</strong>
                    <span>{photo.location || 'Unknown location'}</span>
                  </span>
                </button>
              </figure>
            ))}
          </div>
        </section>
      )) : (
        <EmptyState title="摄影栏目已就绪" body="上传并发布照片后，这里会按日期展示照片和地点。" />
      )}
      {selectedPhoto && (
        <div className="photo-modal" role="dialog" aria-modal="true" aria-label={selectedPhoto.title} onClick={() => setSelectedPhoto(undefined)}>
          <div className="photo-modal-body" onClick={(event) => event.stopPropagation()}>
            <button className="photo-modal-close" type="button" onClick={() => setSelectedPhoto(undefined)} aria-label="Close photo">Close</button>
            <img src={selectedPhoto.imageUrl} alt={selectedPhoto.title} />
            <div className="photo-modal-caption">
              <strong>{selectedPhoto.title}</strong>
              <span>{selectedPhoto.location || 'Unknown location'} / {formatDate(selectedPhoto.date)}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Lab() {
  const tools = enabledTools(data.labTools);

  return (
    <section className="page">
      <PageHeader eyebrow="Lab" title="杂物间" description="小工具、外部项目和临时实验的入口。" />
      {tools.length > 0 ? (
        <div className="tool-grid">
          {tools.map((tool) => (
            <a className="tool-card" key={tool.id} href={tool.kind === 'external' ? tool.url : tool.route}>
              <img src={tool.imageUrl} alt="" />
              <span>{tool.kind === 'external' ? 'External' : 'Internal'}</span>
              <strong>{tool.name}</strong>
              <small>{tool.kind === 'external' ? tool.url : tool.route}</small>
            </a>
          ))}
        </div>
      ) : (
        <EmptyState title="杂物间还在整理" body="这里会放外部链接、内部工具和一些轻量实验。" />
      )}
    </section>
  );
}

type AdminTab = 'posts' | 'photos' | 'about' | 'lab' | 'publish';
type ToastMessage = { id: number; text: string };
type PreviewState = 'idle' | 'loading' | 'error';

const adminTabs: { id: AdminTab; label: string }[] = [
  { id: 'posts', label: '文章' },
  { id: 'photos', label: '摄影' },
  { id: 'about', label: '关于我' },
  { id: 'lab', label: '杂物间' },
  { id: 'publish', label: '发布' },
];

function publishStateLabel(state: string): string {
  const labels: Record<string, string> = {
    idle: '空闲',
    pending: '构建中',
    succeeded: '成功',
    failed: '失败',
  };
  return labels[state] ?? state;
}

function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [photos, setPhotos] = useState<PhotoEntry[]>([]);
  const [tools, setTools] = useState<LabTool[]>([]);
  const [about, setAbout] = useState<AboutContent>(data.about);
  const [draft, setDraft] = useState<BlogPost>(emptyPost());
  const [preview, setPreview] = useState('');
  const [previewState, setPreviewState] = useState<PreviewState>('idle');
  const [status, setStatus] = useState('idle');
  const [activeTab, setActiveTab] = useState<AdminTab>('posts');
  const [postLibraryVisible, setPostLibraryVisible] = useState(true);
  const [toast, setToast] = useState<ToastMessage | undefined>();
  const previewRequest = useRef(0);

  useEffect(() => {
    void api.session().then((session) => setAuthenticated(session.authenticated)).catch(() => setAuthenticated(false));
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    void Promise.all([api.posts(), api.photos(), api.lab(), api.about(), api.publishStatus()]).then(([nextPosts, nextPhotos, nextTools, nextAbout, job]) => {
      setPosts(nextPosts);
      setPhotos(nextPhotos);
      setTools(nextTools);
      setAbout(nextAbout);
      setStatus(job.state);
    });
  }, [authenticated]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(undefined), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    if (!authenticated) return;
    const markdown = draft.body;
    const requestId = previewRequest.current + 1;
    previewRequest.current = requestId;

    if (!markdown.trim()) {
      setPreview('');
      setPreviewState('idle');
      return;
    }

    setPreviewState('loading');
    const timeout = window.setTimeout(() => {
      void api.preview(markdown).then((result) => {
        if (previewRequest.current !== requestId) return;
        setPreview(result.html);
        setPreviewState('idle');
      }).catch(() => {
        if (previewRequest.current !== requestId) return;
        setPreviewState('error');
      });
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [authenticated, draft.body]);

  function showToast(text: string) {
    setToast({ id: Date.now(), text });
  }

  if (!authenticated) {
    return (
      <section className="admin-login">
        <div className="login-card">
          <p className="eyebrow">内容后台</p>
          <h1>内容后台</h1>
          <p>登录后可以编辑文章、摄影、关于我、杂物间入口，并发布静态站点。</p>
          <form onSubmit={(event) => {
            event.preventDefault();
            setLoginError('');
            void api.login(password).then(() => {
              setAuthenticated(true);
              setPassword('');
            }).catch(() => {
              setLoginError('密码错误，请重新输入。');
            });
          }}>
            <label>
              <span>管理密码</span>
              <input
                aria-describedby={loginError ? 'admin-login-error' : undefined}
                aria-invalid={loginError ? 'true' : undefined}
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (loginError) setLoginError('');
                }}
                placeholder="请输入管理密码"
              />
            </label>
            {loginError && <p className="form-error" id="admin-login-error">{loginError}</p>}
            <button className="primary-action">登录</button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-workspace">
      {toast && (
        <div className="admin-toast" role="status" aria-live="polite" key={toast.id}>
          {toast.text}
        </div>
      )}
      <header className="admin-header">
        <div>
          <p className="eyebrow">内容后台</p>
          <h1>内容管理</h1>
          <p>管理公开站点的内容、媒体和发布状态。</p>
        </div>
        <div className="admin-header-actions">
          <button type="button" onClick={() => { window.location.href = '/'; }}>回到博客主页</button>
          <div className={`status-pill status-${status}`}>发布状态：{publishStateLabel(status)}</div>
        </div>
      </header>

      <nav className="admin-tabs" aria-label="后台模块">
        {adminTabs.map((tab) => (
          <button
            aria-selected={activeTab === tab.id}
            className={activeTab === tab.id ? 'active' : ''}
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === 'posts' && (
        <div className={`admin-tab-panel post-workspace ${postLibraryVisible ? '' : 'library-hidden'}`} role="tabpanel">
          <section className="admin-panel post-editor">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Markdown 编辑</p>
                <h2>文章编辑</h2>
              </div>
              <div className="panel-actions">
                <span>{draft.frontmatter.published ? '已发布' : '草稿'}</span>
                <button type="button" onClick={() => setPostLibraryVisible((visible) => !visible)}>
                  {postLibraryVisible ? '隐藏文章库' : `显示文章库 (${posts.length})`}
                </button>
              </div>
            </div>
            <div className="field-grid">
              <label>
                <span>标题</span>
                <input value={draft.frontmatter.title} onChange={(event) => setDraft(withMeta(draft, { title: event.target.value }))} placeholder="文章标题" />
              </label>
              <label>
                <span>标识</span>
                <input value={draft.frontmatter.slug} onChange={(event) => setDraft(withMeta(draft, { slug: event.target.value }))} placeholder="url-slug" />
              </label>
              <label>
                <span>日期</span>
                <input value={draft.frontmatter.date} onChange={(event) => setDraft(withMeta(draft, { date: event.target.value }))} placeholder="YYYY-MM-DD" />
              </label>
              <label>
                <span>标签</span>
                <input value={draft.frontmatter.tags.join(', ')} onChange={(event) => setDraft(withMeta(draft, { tags: event.target.value.split(',').map((item) => item.trim()).filter(Boolean) }))} placeholder="安全, 生活" />
              </label>
            </div>
            <label>
              <span>正文 Markdown</span>
              <textarea className="markdown-input" value={draft.body} onChange={(event) => setDraft({ ...draft, body: event.target.value })} />
            </label>
            <div className="action-bar">
              <button type="button" onClick={() => void api.savePost(withMeta(draft, { published: false })).then((post) => {
                setPosts([post, ...posts.filter((item) => item.frontmatter.slug !== post.frontmatter.slug)]);
                showToast('草稿已保存');
              })}>保存草稿</button>
              <button className="primary-action" type="button" onClick={() => void api.savePost(withMeta(draft, { published: true })).then((post) => {
                setPosts([post, ...posts.filter((item) => item.frontmatter.slug !== post.frontmatter.slug)]);
                showToast('文章已保存并发布');
              })}>发布文章</button>
            </div>
          </section>

          <section className="admin-panel preview-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">渲染预览</p>
                <h2>预览</h2>
              </div>
              <span>{previewState === 'loading' ? '更新中' : previewState === 'error' ? '预览失败' : '实时预览'}</span>
            </div>
            {previewState === 'error' && <p className="preview-error">预览生成失败，正文仍可继续编辑。</p>}
            <div className="preview article-body" dangerouslySetInnerHTML={{ __html: preview || '<p>输入 Markdown 后，这里会自动显示当前草稿的渲染效果。</p>' }} />
          </section>

          {postLibraryVisible && <aside className="admin-panel post-list-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">文章库</p>
                <h2>文章库</h2>
              </div>
              <div className="panel-actions">
                <span>{posts.length}</span>
                <button type="button" onClick={() => setPostLibraryVisible(false)}>隐藏</button>
              </div>
            </div>
            <div className="admin-list">
              {posts.length > 0 ? posts.map((post) => (
                <div className="admin-list-item" key={post.frontmatter.slug}>
                  <button className="load-post" type="button" onClick={() => setDraft(post)}>
                    <strong>{post.frontmatter.title || post.frontmatter.slug}</strong>
                  </button>
                  <button className="danger-action" type="button" onClick={() => void api.deletePost(post.frontmatter.slug).then(() => setPosts(posts.filter((item) => item.frontmatter.slug !== post.frontmatter.slug)))}>删除</button>
                </div>
              )) : <p className="muted">暂无文章。</p>}
            </div>
          </aside>}
        </div>
      )}

      {activeTab === 'photos' && (
        <div className="admin-tab-panel" role="tabpanel">
          <PhotoManager photos={photos} setPhotos={setPhotos} onSuccess={showToast} />
        </div>
      )}

      {activeTab === 'about' && (
        <div className="admin-tab-panel" role="tabpanel">
          <JsonManager title="关于我内容" value={about} onSave={(value) => api.saveAbout(value).then(setAbout)} onSuccess={() => showToast('关于我内容已保存')} />
        </div>
      )}

      {activeTab === 'lab' && (
        <div className="admin-tab-panel" role="tabpanel">
          <LabManager tools={tools} setTools={setTools} onSuccess={showToast} />
        </div>
      )}

      {activeTab === 'publish' && (
        <div className="admin-tab-panel" role="tabpanel">
          <section className="admin-panel publish-panel">
            <div>
              <p className="eyebrow">发布流程</p>
              <h2>静态发布</h2>
              <p>当前状态：<strong>{publishStateLabel(status)}</strong></p>
            </div>
            <button className="primary-action" type="button" onClick={() => void api.publish().then((job) => {
              setStatus(job.state);
              showToast('发布任务已启动');
            })}>开始构建公开站点</button>
          </section>
        </div>
      )}
    </section>
  );
}

function PhotoManager({ photos, setPhotos, onSuccess }: { photos: PhotoEntry[]; setPhotos: (photos: PhotoEntry[]) => void; onSuccess: (message: string) => void }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [location, setLocation] = useState('');
  const [file, setFile] = useState<File | undefined>();

  async function addPhoto() {
    if (!file) return;
    const uploaded = await api.uploadPhoto(file);
    const next = [
      {
        id: uploaded.id,
        title,
        date,
        location,
        imageUrl: uploaded.url,
        thumbnailUrl: uploaded.thumbnailUrl,
        tags: [],
        published: true,
      },
      ...photos,
    ];
    setPhotos(await api.savePhotos(next));
    onSuccess('照片已上传并保存');
    setTitle('');
    setLocation('');
    setFile(undefined);
  }

  async function deletePhoto(id: string) {
    setPhotos(await api.savePhotos(photos.filter((photo) => photo.id !== id)));
    onSuccess('照片元数据已更新');
  }

  return (
    <section className="admin-panel media-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">媒体内容</p>
          <h2>摄影管理</h2>
        </div>
        <span>{photos.length}</span>
      </div>
      <div className="media-split">
        <div className="upload-fields">
          <label><span>照片标题</span><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="照片标题" /></label>
          <label><span>拍摄日期</span><input value={date} onChange={(event) => setDate(event.target.value)} placeholder="YYYY-MM-DD" /></label>
          <label><span>地点</span><input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="拍摄地点" /></label>
          <label><span>图片文件</span><input type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0])} /></label>
          <button type="button" onClick={() => void addPhoto()}>上传照片</button>
        </div>
        <StructuredListPanel
          title="照片元数据"
          eyebrow="结构化数据"
          count={photos.length}
          emptyText="暂无照片。上传照片后会显示在这里。"
        >
          {photos.map((photo) => (
            <MetadataRow
              imageUrl={photo.thumbnailUrl ?? photo.imageUrl}
              key={photo.id}
              title={photo.title || photo.id}
              meta={`${formatDate(photo.date)} / ${photo.location || 'Unknown location'}`}
              detail={photo.published ? '已发布' : '草稿'}
              onDelete={() => void deletePhoto(photo.id)}
            />
          ))}
        </StructuredListPanel>
      </div>
    </section>
  );
}

function LabManager({ tools, setTools, onSuccess }: { tools: LabTool[]; setTools: (tools: LabTool[]) => void; onSuccess: (message: string) => void }) {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [kind, setKind] = useState<LabTool['kind']>('external');
  const [target, setTarget] = useState('');
  const [enabled, setEnabled] = useState(true);

  async function save(nextTools: LabTool[], message: string) {
    setTools(await api.saveLab(nextTools));
    onSuccess(message);
  }

  async function addTool() {
    const cleanName = name.trim();
    const cleanImageUrl = imageUrl.trim();
    const cleanTarget = target.trim();
    if (!cleanName || !cleanImageUrl || !cleanTarget) return;
    const id = slugifyId(cleanName) || `tool-${Date.now()}`;
    const tool: LabTool = kind === 'external'
      ? { id, name: cleanName, imageUrl: cleanImageUrl, kind: 'external', url: cleanTarget, enabled }
      : { id, name: cleanName, imageUrl: cleanImageUrl, kind: 'internal', route: cleanTarget, enabled };

    await save([tool, ...tools.filter((item) => item.id !== tool.id)], '杂物间入口已新增');
    setName('');
    setImageUrl('');
    setTarget('');
    setKind('external');
    setEnabled(true);
  }

  return (
    <section className="admin-panel lab-manager">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">结构化数据</p>
          <h2>杂物间入口</h2>
        </div>
        <span>{tools.length}</span>
      </div>
      <div className="metadata-workspace">
        <div className="upload-fields lab-form">
          <label><span>名称</span><input value={name} onChange={(event) => setName(event.target.value)} placeholder="工具名称" /></label>
          <label><span>图片 URL</span><input value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} placeholder="/images/tool.jpg" /></label>
          <label>
            <span>类型</span>
            <select value={kind} onChange={(event) => setKind(event.target.value as LabTool['kind'])}>
              <option value="external">外部链接</option>
              <option value="internal">内部路由</option>
            </select>
          </label>
          <label><span>{kind === 'external' ? '外部 URL' : '内部路由'}</span><input value={target} onChange={(event) => setTarget(event.target.value)} placeholder={kind === 'external' ? 'https://example.com' : '/tools/demo'} /></label>
          <label className="check-field">
            <input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} />
            <span>公开显示</span>
          </label>
          <button type="button" onClick={() => void addTool()}>新增入口</button>
        </div>
        <StructuredListPanel
          title="入口列表"
          eyebrow="杂物间"
          count={tools.length}
          emptyText="暂无杂物间入口。"
        >
          {tools.map((tool) => (
            <MetadataRow
              imageUrl={tool.imageUrl}
              key={tool.id}
              title={tool.name}
              meta={tool.kind === 'external' ? tool.url : tool.route}
              detail={`${tool.kind === 'external' ? '外部链接' : '内部路由'} / ${tool.enabled ? '已启用' : '已隐藏'}`}
              onDelete={() => void save(tools.filter((item) => item.id !== tool.id), '杂物间入口已删除')}
            />
          ))}
        </StructuredListPanel>
      </div>
    </section>
  );
}

function StructuredListPanel({
  title,
  eyebrow,
  count,
  emptyText,
  children,
}: {
  title: string;
  eyebrow: string;
  count: number;
  emptyText: string;
  children: React.ReactNode;
}) {
  return (
    <div className="structured-list-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        <span>{count}</span>
      </div>
      <div className="metadata-list">
        {count > 0 ? children : <p className="muted">{emptyText}</p>}
      </div>
    </div>
  );
}

function MetadataRow({
  imageUrl,
  title,
  meta,
  detail,
  onDelete,
}: {
  imageUrl: string;
  title: string;
  meta: string;
  detail: string;
  onDelete: () => void;
}) {
  return (
    <div className="metadata-row">
      <img src={imageUrl} alt="" />
      <div>
        <strong>{title}</strong>
        <span>{meta}</span>
        <small>{detail}</small>
      </div>
      <button className="danger-action" type="button" onClick={onDelete}>删除</button>
    </div>
  );
}

function JsonManager<T>({
  title,
  value,
  onSave,
  onSuccess,
  compact = false,
}: {
  title: string;
  value: T;
  onSave: (value: T) => Promise<unknown>;
  onSuccess?: () => void;
  compact?: boolean;
}) {
  const [text, setText] = useState(JSON.stringify(value, null, 2));
  const [error, setError] = useState('');

  useEffect(() => {
    setText(JSON.stringify(value, null, 2));
    setError('');
  }, [value]);

  function parseText(): T | undefined {
    try {
      setError('');
      return JSON.parse(text) as T;
    } catch (parseError) {
      setError(parseError instanceof Error ? `JSON 格式有误：${parseError.message}` : 'JSON 格式有误');
      return undefined;
    }
  }

  function formatJson() {
    const parsed = parseText();
    if (parsed === undefined) return;
    setText(JSON.stringify(parsed, null, 2));
  }

  async function saveJson() {
    const parsed = parseText();
    if (parsed === undefined) return;
    try {
      await onSave(parsed);
      onSuccess?.();
    } catch (saveError) {
      setError(saveError instanceof Error ? `保存失败：${saveError.message}` : '保存失败');
    }
  }

  const content = (
    <>
      <div className="panel-heading">
        <div>
          <p className="eyebrow">结构化数据</p>
          <h2>{title}</h2>
        </div>
      </div>
      <textarea className="json-input" value={text} onChange={(event) => {
        setText(event.target.value);
        if (error) setError('');
      }} aria-invalid={Boolean(error)} />
      {error && <p className="json-error" role="alert">{error}</p>}
      <div className="json-actions">
        <button type="button" onClick={formatJson}>格式化 JSON</button>
        <button type="button" onClick={() => void saveJson()}>保存</button>
      </div>
    </>
  );

  if (compact) {
    return <div className="json-compact">{content}</div>;
  }

  return <section className="admin-panel json-panel">{content}</section>;
}

function PageHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <header className="page-header">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  );
}

function EmptyState({ title, body, actionLabel, onAction }: { title: string; body: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <div className="empty-state">
      <span>+</span>
      <h2>{title}</h2>
      <p>{body}</p>
      {actionLabel && onAction && <button onClick={onAction}>{actionLabel}</button>}
    </div>
  );
}

function getTagCounts(posts: PublicBlogPost[]): Record<string, number> {
  return posts.reduce<Record<string, number>>((counts, post) => {
    for (const tag of post.tags) {
      counts[tag] = (counts[tag] ?? 0) + 1;
    }
    return counts;
  }, {});
}

function enabledTools(tools: LabTool[]): LabTool[] {
  return tools.filter((tool) => tool.enabled);
}

function isActivePath(current: string, target: string): boolean {
  if (target === '/') return current === '/';
  return current.startsWith(target);
}

function postExcerpt(post: PublicBlogPost): string {
  if (post.summary) return post.summary;
  const text = post.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length > 150 ? `${text.slice(0, 150)}...` : text || 'No excerpt available.';
}

function formatDate(value: string): string {
  const match = value.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (!match) return value;
  const [, year, month, day] = match;
  return `${year}.${month.padStart(2, '0')}.${day.padStart(2, '0')}`;
}

function slugifyId(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function emptyPost(): BlogPost {
  return {
    path: '',
    frontmatter: {
      title: '',
      slug: '',
      date: new Date().toISOString().slice(0, 10),
      tags: [],
      published: false,
    },
    body: '',
  };
}

function withMeta(post: BlogPost, frontmatter: Partial<BlogPost['frontmatter']>): BlogPost {
  return { ...post, frontmatter: { ...post.frontmatter, ...frontmatter } };
}
