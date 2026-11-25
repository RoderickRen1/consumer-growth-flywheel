'use client';

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Database,
  Layers,
  Maximize,
  Minimize,
  Orbit,
  Pause,
  Play,
  Presentation,
  RotateCcw,
  SkipForward,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import {
  engine,
  forwardPaths,
  lifecycle,
  loops,
  modules,
  presentation,
  type Loop,
  type LoopId,
  type ModuleId,
} from './flywheel-data';

type Module = (typeof modules)[number];
type Detail = { id: ModuleId | 'engine'; stage?: number };
type Filter = LoopId | 'all';

const icons = { audience: Users, shelf: Layers, crm: Orbit, assets: Database };
const introTimes = [650, 1720, 2850, 4000, 5050, 5480, 5900, 6500];
const summary = '更精准的人群 · 更有效的内容 · 更高效的转化 · 更可持续的增长';

function lightAtPointer(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== 'mouse') return;
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty(
    '--light-x',
    `${event.clientX - rect.left}px`,
  );
  event.currentTarget.style.setProperty(
    '--light-y',
    `${event.clientY - rect.top}px`,
  );
}

function PathRunner({ path, delay = 0 }: { path: string; delay?: number }) {
  const motion = useRef<SVGAnimateMotionElement>(null);
  useEffect(() => {
    motion.current?.beginElementAt(delay);
  }, [delay]);

  return (
    <circle className="gf-runner" r="3" style={{ animationDelay: `${delay}s` }}>
      <animateMotion
        ref={motion}
        path={path}
        begin="indefinite"
        dur="2.8s"
        repeatCount="indefinite"
      />
    </circle>
  );
}

function Diagram({
  phase,
  loop,
  focused,
  presenting,
  reduced,
  paused,
}: {
  phase: number | null;
  loop?: Loop;
  focused: ModuleId | null;
  presenting: boolean;
  reduced: boolean;
  paused: boolean;
}) {
  const diagram = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (paused) diagram.current?.pauseAnimations();
    else diagram.current?.unpauseAnimations();
  }, [paused]);

  return (
    <svg
      ref={diagram}
      className="gf-diagram"
      viewBox="0 0 1280 554"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="gf-rail" x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#dbe6ff" stopOpacity=".05" />
          <stop offset=".3" stopColor="#dbe6ff" stopOpacity=".24" />
          <stop offset=".65" stopColor="#dbe6ff" stopOpacity=".06" />
          <stop offset="1" stopColor="#ff607c" stopOpacity=".26" />
        </linearGradient>
        <marker
          id="gf-arrow-main"
          viewBox="0 0 9 10"
          refX="8.5"
          refY="5"
          markerWidth="7"
          markerHeight="8"
          orient="auto"
        >
          <path
            d="M1 1l7 4-7 4"
            fill="none"
            stroke="#ff7087"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </marker>
        {loops.map((item) => (
          <marker
            key={item.id}
            id={`gf-arrow-${item.id}`}
            viewBox="0 0 9 10"
            refX="8.5"
            refY="5"
            markerWidth="7"
            markerHeight="8"
            orient="auto"
          >
            <path
              d="M1 1l7 4-7 4"
              fill="none"
              stroke={item.color}
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </marker>
        ))}
      </defs>
      <ellipse className="gf-rail" cx="640" cy="282" rx="610" ry="255" />
      <ellipse
        className="gf-rail gf-rail-inner"
        cx="640"
        cy="287"
        rx="528"
        ry="211"
      />
      <circle className="gf-engine-orbit" cx="640" cy="287" r="115" />
      <circle
        className="gf-engine-orbit gf-engine-orbit-dashed"
        cx="640"
        cy="287"
        r="126"
      />
      {forwardPaths.map(({ d, from, to }, index) => {
        const visible = phase === null || phase >= index + 2;
        const related = focused === from || focused === to;
        return (
          <g
            key={from}
            className="gf-track gf-forward"
            data-visible={visible}
            data-active={related || Boolean(loop)}
            data-muted={Boolean(focused && !related)}
          >
            <path className="gf-track-halo" d={d} />
            <path
              className="gf-track-line"
              d={d}
              markerEnd="url(#gf-arrow-main)"
            />
            {visible &&
              !reduced &&
              (loop || phase !== null || (presenting && related)) && (
                <PathRunner path={d} delay={index * 0.42} />
              )}
          </g>
        );
      })}
      {loops.map((item, index) => {
        const related =
          focused === 'assets' ||
          (focused && (item.targets as readonly ModuleId[]).includes(focused));
        const visible = phase === null || phase >= index + 5;
        const active = loop ? loop.id === item.id : Boolean(related);
        return (
          <g
            key={item.id}
            className="gf-track gf-feedback"
            style={{ '--track': item.color } as CSSProperties}
            data-visible={visible}
            data-active={active}
            data-muted={loop ? !active : Boolean(focused && !related)}
          >
            {item.paths.map(({ d, target }, pathIndex) => (
              <g key={target}>
                <path className="gf-track-halo" d={d} />
                <path
                  className="gf-track-line"
                  d={d}
                  markerEnd={`url(#gf-arrow-${item.id})`}
                />
                {visible &&
                  !reduced &&
                  (loop?.id === item.id || phase !== null) && (
                    <PathRunner
                      key={loop?.id ?? 'intro'}
                      path={d}
                      delay={
                        pathIndex && 'branchDelay' in item
                          ? item.branchDelay
                          : 0
                      }
                    />
                  )}
              </g>
            ))}
            {'junction' in item && (
              <circle
                className="gf-junction"
                cx={item.junction[0]}
                cy={item.junction[1]}
                r="2.5"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

function ModuleCard({
  module,
  visible,
  muted,
  active,
  feedback,
  onHover,
  onDetail,
  onLoop,
}: {
  module: Module;
  visible: boolean;
  muted: boolean;
  active: boolean;
  feedback?: Loop;
  onHover: (module: ModuleId | null) => void;
  onDetail: (detail: Detail) => void;
  onLoop: (loop: LoopId) => void;
}) {
  const Icon = icons[module.id];

  return (
    <article
      className={`gf-card gf-glass gf-${module.id}`}
      aria-label={module.phase + ' · ' + module.title}
      data-visible={visible}
      data-muted={muted}
      data-active={active}
      data-feedback={!!feedback}
      style={
        feedback
          ? ({ '--feedback': feedback.color } as CSSProperties)
          : undefined
      }
      inert={!visible}
      onPointerMove={lightAtPointer}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') onHover(module.id);
      }}
      onPointerLeave={() => onHover(null)}
      onFocusCapture={() => onHover(module.id)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) onHover(null);
      }}
    >
      <div className="gf-card-head">
        <span className="gf-card-icon">
          <Icon size={19} strokeWidth={1.65} />
        </span>
        <div>
          <p className="gf-card-phase" title={module.en}>
            {module.phase} <i aria-hidden="true">/</i>{' '}
            <span className="gf-phase-full" lang="en">
              {module.en}
            </span>
            {'shortEn' in module && (
              <span className="gf-phase-short" lang="en" aria-hidden="true">
                {module.shortEn}
              </span>
            )}
          </p>
          <h2>
            <button
              className="gf-card-trigger"
              type="button"
              onClick={() => onDetail({ id: module.id })}
            >
              {module.title}
              <ChevronRight size={17} aria-hidden="true" />
            </button>
          </h2>
        </div>
      </div>
      {module.id === 'assets' ? (
        <div className="gf-asset-list">
          {loops.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className="gf-asset gf-reveal"
              data-selected={feedback?.id === item.id}
              style={
                {
                  '--track': item.color,
                  '--reveal-delay': `${index * 110}ms`,
                } as CSSProperties
              }
              aria-pressed={feedback?.id === item.id}
              aria-label={`追踪${item.source}：${item.title}`}
              onClick={() => onLoop(item.id)}
            >
              <i aria-hidden="true" />
              {item.source}
              <span>{item.shortTarget}</span>
              <ArrowRight size={12} aria-hidden="true" />
            </button>
          ))}
        </div>
      ) : (
        <>
          <p className="gf-purpose">{module.purpose}</p>
          <div className={`gf-node-list gf-nodes-${module.id}`}>
            {module.id === 'crm'
              ? lifecycle.map((stage, index) => (
                  <button
                    key={stage.title}
                    type="button"
                    className="gf-node gf-reveal"
                    data-optional={index >= 3}
                    style={
                      { '--reveal-delay': `${index * 95}ms` } as CSSProperties
                    }
                    aria-label={`${index + 1} ${stage.title} ${stage.en}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      onDetail({ id: 'crm', stage: index });
                    }}
                  >
                    {stage.title}
                  </button>
                ))
              : module.groups.map((group, index) => (
                  <span
                    className="gf-node gf-reveal"
                    key={group.title}
                    style={
                      { '--reveal-delay': `${index * 95}ms` } as CSSProperties
                    }
                  >
                    {group.title}
                  </span>
                ))}
          </div>
          <p
            className="gf-result gf-reveal"
            style={{ '--reveal-delay': '430ms' } as CSSProperties}
          >
            {module.result}
          </p>
        </>
      )}
    </article>
  );
}

function DetailPanel({
  detail,
  onClose,
}: {
  detail: Detail | null;
  onClose: () => void;
}) {
  const panel = useRef<HTMLDialogElement>(null);
  const selectedModule = modules.find(({ id }) => id === detail?.id);
  const stage =
    detail?.stage === undefined ? undefined : lifecycle[detail.stage];

  useEffect(() => {
    const dialog = panel.current;
    if (!dialog) return;
    if (detail && !dialog.open) dialog.showModal();
    if (!detail && dialog.open) dialog.close();
  }, [detail]);

  return (
    <dialog
      ref={panel}
      className="gf-dialog"
      aria-labelledby="gf-detail-title"
      onClose={onClose}
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {detail && (
        <div className="gf-detail gf-glass">
          <div className="gf-detail-top">
            <p>
              {selectedModule
                ? `${selectedModule.phase} / ${stage?.en ?? selectedModule.en}`
                : 'Consumer Value Engine'}
            </p>
            <button
              type="button"
              className="gf-icon-button"
              onClick={onClose}
              autoFocus
              aria-label="关闭详情"
            >
              <X size={19} />
            </button>
          </div>
          <h2 id="gf-detail-title">
            {stage?.title ?? selectedModule?.title ?? '消费者价值引擎'}
          </h2>
          {stage ? (
            <>
              <p className="gf-detail-lead">{stage.goal}</p>
              <h3>关键指标</h3>
              <ul className="gf-metrics">
                {stage.metrics.map((metric) => (
                  <li key={metric}>{metric}</li>
                ))}
              </ul>
              {(detail.stage ?? 0) >= 3 && (
                <p className="gf-note">{modules[2].note}</p>
              )}
            </>
          ) : selectedModule ? (
            <>
              <p className="gf-detail-lead">{selectedModule.question}</p>
              <h3>业务结构与关键动作</h3>
              <dl className="gf-detail-groups">
                {selectedModule.id === 'crm'
                  ? lifecycle.map((item, index) => (
                      <div key={item.title}>
                        <dt>
                          {String(index + 1).padStart(2, '0')} {item.title}
                          <span>{item.en}</span>
                        </dt>
                        <dd>
                          {item.goal}
                          <br />
                          {item.metrics.join(' · ')}
                        </dd>
                      </div>
                    ))
                  : selectedModule.groups.map((group) => (
                      <div key={group.title}>
                        <dt>
                          {group.title}
                          {'en' in group && <span>{group.en}</span>}
                        </dt>
                        <dd>{group.items.join(' · ')}</dd>
                      </div>
                    ))}
              </dl>
              {selectedModule.id === 'shelf' && (
                <>
                  <h3>组合优化机制</h3>
                  <p>{selectedModule.mechanism}</p>
                  <p>{selectedModule.methods.join(' · ')}</p>
                </>
              )}
              {selectedModule.metrics.length > 0 && (
                <>
                  <h3>关键指标</h3>
                  <ul className="gf-metrics">
                    {selectedModule.metrics.map((metric) => (
                      <li key={metric}>{metric}</li>
                    ))}
                  </ul>
                </>
              )}
              <h3>业务产出</h3>
              <p className="gf-detail-outcome">{selectedModule.result}</p>
              <h3>如何衔接全链路</h3>
              <p>{selectedModule.relation}</p>
              {'note' in selectedModule && (
                <p className="gf-note">{selectedModule.note}</p>
              )}
            </>
          ) : (
            <>
              <p className="gf-detail-lead">
                消费者洞察贯穿四个经营阶段，通过数据智能与持续优化驱动每轮增长。
              </p>
              <h3>消费者洞察如何驱动各阶段</h3>
              <dl className="gf-detail-groups">
                {engine[0].roles.map((role, index) => (
                  <div key={role}>
                    <dt>{modules[index].phase}</dt>
                    <dd>{role}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}
        </div>
      )}
    </dialog>
  );
}

export function GrowthFlywheel() {
  const [phase, setPhase] = useState<number | null>(null);
  const [introPlaying, setIntroPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');
  const [hovered, setHovered] = useState<ModuleId | null>(null);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [slide, setSlide] = useState<number | null>(null);
  const [auto, setAuto] = useState(false);
  const [full, setFull] = useState(false);
  const [fullscreenError, setFullscreenError] = useState(false);
  const elapsed = useRef(0);
  const root = useRef<HTMLElement>(null);
  const loopExplanation = useRef<HTMLElement>(null);
  const chapter = slide === null ? undefined : presentation[slide];
  const presenting = slide !== null;
  const selectedLoop = loops.find(({ id }) => id === (chapter?.id ?? filter));
  const chapterModule = modules.find(({ id }) => id === chapter?.id)?.id;
  const focused = selectedLoop
    ? null
    : (chapterModule ?? (presenting ? null : hovered));
  const paused = (phase !== null && !introPlaying) || !!detail;

  function stopIntro() {
    setPhase(null);
    setIntroPlaying(false);
  }

  function replayIntro() {
    setFilter('all');
    setHovered(null);
    elapsed.current = 0;
    setPhase(0);
    setIntroPlaying(true);
  }

  function selectFilter(next: Filter) {
    stopIntro();
    setHovered(null);
    const index = presentation.findIndex(({ id }) => id === next);
    if (presenting) {
      setAuto(false);
      setSlide(index);
    } else {
      setFilter(next);
    }
  }

  function togglePresentation() {
    stopIntro();
    setHovered(null);
    setAuto(false);
    setFullscreenError(false);
    if (presenting) {
      setSlide(null);
      if (document.fullscreenElement === root.current)
        void document.exitFullscreen().catch(() => {});
    } else {
      setSlide(0);
    }
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement === root.current)
        await document.exitFullscreen();
      else if (root.current?.requestFullscreen)
        await root.current.requestFullscreen();
      else setFullscreenError(true);
    } catch {
      setFullscreenError(true);
    }
  }

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      setReduced(preference.matches);
      if (preference.matches) stopIntro();
    };
    preference.addEventListener('change', update);
    const frame = requestAnimationFrame(() => {
      update();
      let firstVisit = true;
      try {
        firstVisit = sessionStorage.getItem('growth-flywheel-intro') === null;
        sessionStorage.setItem('growth-flywheel-intro', 'seen');
      } catch {
        // Playback remains available when session storage is disabled.
      }
      if (firstVisit && !preference.matches) {
        setPhase(0);
        setIntroPlaying(true);
      }
    });
    return () => {
      cancelAnimationFrame(frame);
      preference.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => {
    if (!introPlaying || phase === null) return;
    const started = performance.now();
    const end = introTimes[phase];
    const timer = window.setTimeout(
      () => {
        elapsed.current = end;
        if (phase === introTimes.length - 1) stopIntro();
        else setPhase(phase + 1);
      },
      Math.max(0, end - elapsed.current),
    );

    return () => {
      clearTimeout(timer);
      elapsed.current = Math.min(
        end,
        elapsed.current + performance.now() - started,
      );
    };
  }, [introPlaying, phase]);

  useEffect(() => {
    if (slide === null || !auto || detail) return;
    const timer = window.setTimeout(() => {
      if (slide < presentation.length - 1) setSlide(slide + 1);
      else setAuto(false);
    }, 6200);
    return () => clearTimeout(timer);
  }, [slide, auto, detail]);

  useEffect(() => {
    const handler = () => {
      setFull(document.fullscreenElement === root.current);
      setFullscreenError(false);
    };
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  useEffect(() => {
    if (!presenting || detail) return;
    const keydown = (event: KeyboardEvent) => {
      const direction =
        event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0;
      if (!direction || event.altKey || event.ctrlKey || event.metaKey) return;
      event.preventDefault();
      setAuto(false);
      setSlide((current) =>
        current === null
          ? null
          : Math.max(0, Math.min(presentation.length - 1, current + direction)),
      );
    };
    window.addEventListener('keydown', keydown);
    return () => window.removeEventListener('keydown', keydown);
  }, [presenting, detail]);

  return (
    <main
      ref={root}
      className="gf-page"
      data-presenting={presenting}
      data-paused={paused}
    >
      <div className="gf-shell">
        <header className="gf-header">
          <button
            type="button"
            className="gf-button gf-glass"
            onClick={togglePresentation}
          >
            {presenting ? <X size={16} /> : <Presentation size={17} />}
            {presenting ? '退出演示' : '演示模式'}
          </button>
        </header>

        <div className="gf-title">
          <p lang="en">CONSUMER GROWTH FLYWHEEL</p>
          <h1>全域消费者经营增长飞轮</h1>
          <p>每一次消费者经营，都是下一轮增长的起点。</p>
        </div>

        <section className="gf-workspace" aria-label="全域经营与资产反哺">
          <div className="gf-toolbar">
            <fieldset className="gf-filters gf-glass" aria-label="闭环追踪">
              <button
                type="button"
                aria-pressed={
                  !selectedLoop && (!chapter || chapter.id === 'all')
                }
                onClick={() => selectFilter('all')}
              >
                <Orbit size={15} aria-hidden="true" /> 全域经营
              </button>
              {loops.map((loop) => (
                <button
                  key={loop.id}
                  type="button"
                  style={{ '--track': loop.color } as CSSProperties}
                  aria-pressed={selectedLoop?.id === loop.id}
                  onClick={() => selectFilter(loop.id)}
                >
                  <i aria-hidden="true" />
                  {loop.title}
                </button>
              ))}
            </fieldset>
            {!presenting && (
              <fieldset className="gf-playback" aria-label="开场动画">
                {phase !== null ? (
                  <>
                    <button
                      type="button"
                      className="gf-icon-button gf-glass"
                      aria-label={introPlaying ? '暂停动画' : '继续动画'}
                      title={introPlaying ? '暂停动画' : '继续动画'}
                      onClick={() => setIntroPlaying(!introPlaying)}
                    >
                      {introPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button
                      type="button"
                      className="gf-icon-button gf-glass"
                      aria-label="跳过动画"
                      title="跳过动画"
                      onClick={stopIntro}
                    >
                      <SkipForward size={16} />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="gf-button gf-glass"
                    onClick={replayIntro}
                  >
                    <RotateCcw size={16} /> 重播动画
                  </button>
                )}
              </fieldset>
            )}
          </div>

          <div className="gf-visual">
            <div
              className="gf-board"
              aria-label="人群经营、货架经营、私域经营、资产沉淀与再利用"
            >
              <Diagram
                phase={phase}
                loop={selectedLoop}
                focused={focused}
                presenting={presenting}
                reduced={reduced}
                paused={paused}
              />

              <button
                type="button"
                className="gf-core gf-glass"
                data-active={chapter?.id === 'engine'}
                data-opening={phase === 0}
                onPointerMove={lightAtPointer}
                onClick={() => {
                  stopIntro();
                  setDetail({ id: 'engine' });
                }}
                aria-label="了解消费者价值引擎"
              >
                <span className="gf-core-icon">
                  <Sparkles size={21} strokeWidth={1.55} />
                </span>
                <strong>消费者价值引擎</strong>
                <span className="gf-core-en" lang="en">
                  Consumer Value Engine
                </span>
                <span className="gf-core-capabilities">
                  {engine.map(({ title }) => (
                    <span key={title}>{title}</span>
                  ))}
                </span>
              </button>

              {modules.map((module, index) => {
                const isTarget = (
                  selectedLoop?.targets as readonly ModuleId[] | undefined
                )?.includes(module.id);
                const feedback =
                  isTarget || module.id === 'assets' ? selectedLoop : undefined;
                const muted = selectedLoop
                  ? !feedback
                  : chapter?.id === 'engine' ||
                    Boolean(focused && focused !== module.id);
                return (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    visible={phase === null || phase > index}
                    active={Boolean(focused === module.id)}
                    muted={muted}
                    feedback={feedback}
                    onHover={setHovered}
                    onDetail={(next) => {
                      stopIntro();
                      setDetail(next);
                    }}
                    onLoop={(next) => {
                      selectFilter(next);
                      if (
                        !presenting &&
                        matchMedia('(max-width: 1020px)').matches
                      ) {
                        requestAnimationFrame(() =>
                          loopExplanation.current?.scrollIntoView({
                            block: 'start',
                            behavior: reduced ? 'instant' : 'smooth',
                          }),
                        );
                      }
                    }}
                  />
                );
              })}
              <span
                className="gf-rail-caption gf-caption-forward"
                aria-hidden="true"
              >
                顺时针经营链路
              </span>
              <span
                className="gf-rail-caption gf-caption-assets"
                aria-hidden="true"
              >
                沉淀可复用资产
              </span>
            </div>

            {selectedLoop && (
              <section
                className="gf-loop gf-glass"
                key={selectedLoop.id}
                ref={loopExplanation}
                aria-label={selectedLoop.title}
                style={{ '--track': selectedLoop.color } as CSSProperties}
              >
                <div className="gf-loop-top">
                  <p>
                    <i aria-hidden="true" />
                    {selectedLoop.title}
                  </p>
                  <strong>{selectedLoop.value}</strong>
                </div>
                <p className="gf-loop-route">
                  <span>{selectedLoop.source}</span>
                  <ArrowRight size={14} aria-hidden="true" />
                  <span>{selectedLoop.target}</span>
                </p>
                <p className="gf-loop-journey">{selectedLoop.journey}</p>
                <ul aria-label="反哺动作">
                  {selectedLoop.actions.map((action) => (
                    <li key={action}>{action}</li>
                  ))}
                </ul>
              </section>
            )}

            {!selectedLoop && (
              <div className="gf-legend" aria-label="链路图例">
                <span>
                  <i className="gf-legend-main" aria-hidden="true" />{' '}
                  正向经营链路
                </span>
                {loops.map((loop) => (
                  <span
                    key={loop.id}
                    style={{ '--track': loop.color } as CSSProperties}
                  >
                    <i aria-hidden="true" /> {loop.title}
                  </span>
                ))}
              </div>
            )}
          </div>

          {chapter && slide !== null && (
            <div className="gf-presentation gf-glass">
              <div className="gf-chapter" aria-live="polite">
                <p>
                  <span>
                    {String(slide + 1).padStart(2, '0')} /{' '}
                    {String(presentation.length).padStart(2, '0')}
                  </span>{' '}
                  {chapter.title}
                </p>
                <p>{chapter.text}</p>
              </div>
              <fieldset
                className="gf-presentation-controls"
                aria-label="演示控制"
              >
                <button
                  className="gf-icon-button"
                  type="button"
                  title="上一幕"
                  aria-label="上一幕"
                  disabled={slide === 0}
                  onClick={() => {
                    setAuto(false);
                    setSlide(slide - 1);
                  }}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  className="gf-icon-button"
                  type="button"
                  title={auto ? '暂停演示' : '播放演示'}
                  aria-label={auto ? '暂停演示' : '播放演示'}
                  onClick={() => {
                    if (!auto && slide === presentation.length - 1) setSlide(0);
                    setAuto(!auto);
                  }}
                >
                  {auto ? <Pause size={17} /> : <Play size={17} />}
                </button>
                <button
                  className="gf-icon-button"
                  type="button"
                  title="下一幕"
                  aria-label="下一幕"
                  disabled={slide === presentation.length - 1}
                  onClick={() => {
                    setAuto(false);
                    setSlide(slide + 1);
                  }}
                >
                  <ChevronRight size={20} />
                </button>
                <button
                  className="gf-icon-button"
                  type="button"
                  title="从头演示"
                  aria-label="从头演示"
                  onClick={() => {
                    setSlide(0);
                    setAuto(true);
                  }}
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  className="gf-icon-button"
                  type="button"
                  title={full ? '退出全屏' : '全屏'}
                  aria-label={full ? '退出全屏' : '全屏'}
                  onClick={toggleFullscreen}
                >
                  {full ? <Minimize size={17} /> : <Maximize size={17} />}
                </button>
              </fieldset>
              {fullscreenError && (
                <output className="gf-fullscreen-error">
                  当前浏览器未进入全屏，仍可使用演示控制。
                </output>
              )}
            </div>
          )}
        </section>

        <footer className="gf-footer">
          <p>{summary}</p>
          <p>
            <CircleHelp size={14} />{' '}
            资产再利用以合法合规、用户授权及隐私保护为前提。
          </p>
        </footer>
      </div>
      <DetailPanel detail={detail} onClose={() => setDetail(null)} />
    </main>
  );
}
