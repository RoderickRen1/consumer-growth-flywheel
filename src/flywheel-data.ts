export const lifecycle = [
  {
    title: '拉新',
    en: 'Acquisition',
    goal: '让有明确需求的消费者进入可持续触达的私域。',
    metrics: ['入域率', '新增用户数', '获客成本'],
  },
  {
    title: '转化',
    en: 'Conversion',
    goal: '完成首次购买，验证触达与服务是否能推动成交。',
    metrics: ['首购率', '成交率', '客单价'],
  },
  {
    title: '复购',
    en: 'Retention',
    goal: '匹配真实的补货和使用节奏，提高复购。',
    metrics: ['复购率', '购买频次', '复购周期'],
  },
  {
    title: '忠诚',
    en: 'Loyalty',
    goal: '通过持续服务和会员权益，发展部分用户的长期品牌关系。',
    metrics: ['会员活跃度', '用户留存率', '生命周期价值'],
  },
  {
    title: '推荐',
    en: 'Referral',
    goal: '让有意愿分享的用户通过口碑和转介绍带来新客。',
    metrics: ['分享率', '转介绍率', '推荐获客人数'],
  },
] as const;

export const modules = [
  {
    id: 'audience',
    title: '人群经营',
    phase: '前端',
    en: 'Audience Development',
    purpose: '解决人群问题',
    question: '我们服务哪些消费者？他们有哪些可以被品牌和内容共同激发的需求？',
    groups: [
      {
        title: '品牌',
        en: 'Brand',
        items: ['人群定位', '品牌认知', '心智占领', '价值传递', '品牌信任'],
      },
      {
        title: '内容电商',
        en: 'Content Commerce',
        items: [
          '精准人群触达',
          '内容种草',
          '场景构建',
          '需求激发',
          '购买意向形成',
        ],
      },
    ],
    metrics: ['目标人群触达', '品牌认知与信任', '购买意向'],
    result: '精准目标人群 × 有效消费需求',
    relation:
      '品牌与内容电商并列协同，共同将目标人群和消费需求传递给货架。人群、内容和商业资产分别反哺下一轮经营。',
  },
  {
    id: 'shelf',
    title: '货架经营',
    phase: '中端',
    en: 'Shelf Optimization',
    purpose: '解决转化效率问题',
    question: '针对不同目标人群，什么样的货架组合能够实现更高的购买转化效率？',
    groups: [
      { title: '商品组合', items: ['SKU', '规格', '产品搭配'] },
      { title: '视觉组合', items: ['UI', '主图', '色彩', '信息层级'] },
      {
        title: '内容组合',
        items: ['图文', '核心卖点', '消费场景', '信任背书'],
      },
      { title: '利益组合', items: ['价格', '促销', '赠品', '会员权益'] },
    ],
    mechanism: '目标人群匹配 × 组合测试 × 转化验证',
    methods: [
      'A/B Testing',
      '消费者行为分析',
      '转化漏斗分析',
      '不同人群的差异化验证',
    ],
    metrics: ['分人群购买转化率', '漏斗各环节转化率'],
    result: '最优货架组合 × 高效购买转化',
    relation:
      '将前端的目标人群与需求转化为成交，并衔接私域。利用回流的人群洞察，为不同人群寻找各自的最优货架组合。',
  },
  {
    id: 'crm',
    title: '私域经营',
    phase: '后端',
    en: 'Private Domain & CRM',
    purpose: '解决用户生命周期价值问题',
    question:
      '如何将一次性成交转化为长期用户关系，并持续提升用户生命周期价值？',
    groups: [],
    metrics: [],
    result: '长期用户关系 × 用户生命周期价值增长',
    relation:
      '货架成交后的用户进入私域运营。私域持续产生人群、内容及商业资产，商业资产也会回到私域支持忠诚用户经营。',
    note: '忠诚与推荐是潜在发展阶段，用户可在不同阶段停留或退出。',
  },
  {
    id: 'assets',
    title: '资产沉淀与再利用',
    phase: '资产端',
    en: 'Asset Accumulation & Reactivation',
    shortEn: 'Asset Reactivation',
    purpose: '解决持续增长动力问题',
    question: '怎样将私域经营积累的人群、内容与商业资源用于下一轮增长？',
    groups: [
      {
        title: '人群资产',
        en: 'Audience Assets',
        items: [
          '真实用户画像',
          '消费偏好',
          '购买行为',
          '真实消费需求',
          '高价值用户特征',
        ],
      },
      {
        title: '内容资产',
        en: 'Content Assets',
        items: [
          'UGC',
          '真实家庭故事',
          '消费痛点',
          '产品使用场景',
          '真实购买理由',
          '品牌口碑',
        ],
      },
      {
        title: '商业资产',
        en: 'Commercial Assets',
        items: ['会员用户', '复购用户', '忠诚用户', '品牌推荐者', '转介绍关系'],
      },
    ],
    metrics: ['用户画像覆盖', '授权 UGC 可复用量', '活跃会员与推荐关系'],
    result: '可复用的人群、内容与商业资产',
    relation:
      '三类资产分别支持人群与货架优化、品牌与内容电商、以及新客获取与忠诚用户经营。',
    note: '用户数据的利用与 UGC 传播以合法合规、用户授权及隐私保护为前提。',
  },
] as const;

export type ModuleId = (typeof modules)[number]['id'];

export const loops = [
  {
    id: 'insight',
    title: '人群洞察闭环',
    color: '#98d7f5',
    source: '人群资产',
    shortTarget: '人群 · 货架',
    junction: [480, 367],
    branchDelay: 0.94,
    target: '前端人群定位 · 中端货架优化',
    targets: ['audience', 'shelf'],
    journey: '人群经营 → 货架转化 → 私域经营 → 人群资产 → 人群定位与货架优化',
    value: '让人群越来越精准',
    actions: [
      '优化品牌目标人群',
      '提升内容电商触达精度',
      '识别高价值用户',
      '优化差异化货架组合',
    ],
    paths: [
      {
        d: 'M422 434 C450 434 480 402 480 367 C480 310 450 291 409 271 Q366 251 366 225',
        target: 'audience',
      },
      {
        d: 'M480 367 C480 313 502 260 523 224 C558 158 613 162 675 162 H858',
        target: 'shelf',
      },
    ],
  },
  {
    id: 'content',
    title: '内容生产闭环',
    color: '#c5aef5',
    source: '内容资产',
    shortTarget: '品牌 · 内容电商',
    target: '品牌营销 · 内容电商',
    targets: ['audience'],
    journey: '内容电商 → 货架转化 → 私域互动 → 内容资产 → 品牌与内容电商',
    value: '让内容越来越有效',
    actions: [
      'UGC 素材生产',
      '真实消费者故事传播',
      '品牌内容迭代',
      '产品卖点优化',
      '消费场景再开发',
    ],
    paths: [
      {
        d: 'M422 461 C472 461 463 375 446 336 C420 274 320 277 320 225',
        target: 'audience',
      },
    ],
  },
  {
    id: 'growth',
    title: '用户增长闭环',
    color: '#e6c38c',
    source: '商业资产',
    shortTarget: '获客 · 用户经营',
    junction: [515, 393],
    branchDelay: 1.18,
    target: '新一轮人群获取 · 忠诚用户经营',
    targets: ['audience', 'crm'],
    journey:
      '人群获取 → 货架转化 → 私域经营 → 商业资产 → 新客获取与忠诚用户经营',
    value: '让增长越来越可持续',
    actions: [
      '老客带新客',
      '品牌口碑传播',
      '用户推荐',
      '会员裂变',
      '忠诚用户经营',
    ],
    paths: [
      {
        d: 'M422 488 C465 488 498 437 515 393 C545 320 487 277 439 253 Q405 238 405 225',
        target: 'audience',
      },
      {
        d: 'M515 393 C554 442 648 451 730 433 Q802 416 858 421',
        target: 'crm',
      },
    ],
  },
] as const;

export type Loop = (typeof loops)[number];
export type LoopId = Loop['id'];

export const forwardPaths = [
  { d: 'M422 111 C530 16 750 16 858 111', from: 'audience', to: 'shelf' },
  { d: 'M1188 153 C1276 175 1276 376 1188 414', from: 'shelf', to: 'crm' },
  { d: 'M858 487 C748 555 523 561 400 515', from: 'crm', to: 'assets' },
] as const;

export const engine = [
  {
    title: '消费者洞察',
    en: 'Consumer Insight',
    roles: [
      '识别人群、需求及认知差异',
      '验证消费者决策机制与货架组合',
      '识别留存、复购及忠诚的驱动因素',
      '提取可复用的消费者洞察和增长资源',
    ],
  },
  { title: '数据智能', en: 'Data Intelligence' },
  { title: '持续优化', en: 'Continuous Optimization' },
] as const;

export const presentation = [
  {
    id: 'engine',
    title: '消费者价值引擎',
    text: '消费者洞察、数据智能和持续优化贯穿四个经营阶段。',
  },
  ...modules.map((module) => ({
    id: module.id,
    title: module.title,
    text: module.relation,
  })),
  ...loops.map((loop) => ({
    id: loop.id,
    title: loop.title,
    text: loop.journey + '。' + loop.value + '。',
  })),
  {
    id: 'all',
    title: '全域经营',
    text: '更精准的人群 · 更有效的内容 · 更高效的转化 · 更可持续的增长',
  },
] as const;
