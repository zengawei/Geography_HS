import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const OUTPUT_DIR = join(import.meta.dirname, '..', 'src', 'content', 'knowledge-points');
mkdirSync(OUTPUT_DIR, { recursive: true });

interface KP {
  id: string;
  name: string;
  category: 'natural' | 'human' | 'regional' | 'world_china' | 'tools';
  exam_frequency: 'high' | 'medium' | 'low';
  description: string;
  key_concepts: string[];
  textbook_refs: { textbook: string; chapter: number; section?: number }[];
  related_points: string[];
  common_mistakes?: string[];
}

// Helper to avoid repetition
const r1 = 'required-1', r2 = 'required-2', s1 = 'selective-1', s2 = 'selective-2', s3 = 'selective-3';

const knowledgePoints: KP[] = [
  // ═══════════════════════════════════════════
  // 一、自然地理（26 个）
  // ═══════════════════════════════════════════
  {
    id: 'earth-in-universe', name: '宇宙中的地球与地球演化', category: 'natural', exam_frequency: 'medium',
    description: '地球在宇宙中的位置、天体系统层次、地球演化历程与地质年代表。',
    key_concepts: ['天体系统层次', '地球存在生命的条件', '地质年代', '生物演化'],
    textbook_refs: [{ textbook: r1, chapter: 1 }],
    related_points: ['solar-radiation-activity', 'natural-disasters'],
    common_mistakes: ['混淆天体与天体系统的概念', '误认为地球存在生命的条件只有温度和大气'],
  },
  {
    id: 'solar-radiation-activity', name: '太阳辐射与太阳活动', category: 'natural', exam_frequency: 'medium',
    description: '太阳辐射的分布规律及影响因素，太阳活动类型（黑子、耀斑）及其对地球的影响。',
    key_concepts: ['太阳辐射分布', '影响太阳辐射的因素', '黑子与耀斑', '太阳活动周期'],
    textbook_refs: [{ textbook: r1, chapter: 1 }],
    related_points: ['earth-in-universe', 'atmosphere-heating'],
    common_mistakes: ['混淆太阳辐射与太阳能量的来源', '误认为太阳活动对气候没有影响'],
  },
  {
    id: 'earth-rotation', name: '地球自转', category: 'natural', exam_frequency: 'high',
    description: '地球自转的方向、周期、速度（角速度和线速度），及其地理意义。',
    key_concepts: ['自转方向与周期', '角速度与线速度', '自转的地理意义'],
    textbook_refs: [{ textbook: s1, chapter: 1 }],
    related_points: ['earth-revolution', 'time-and-date', 'solar-altitude-daylength'],
    common_mistakes: ['混淆角速度和线速度的分布规律', '忽略赤道处线速度最大'],
  },
  {
    id: 'earth-revolution', name: '地球公转', category: 'natural', exam_frequency: 'high',
    description: '地球公转的轨道、方向、周期、黄赤交角，及其地理意义。',
    key_concepts: ['公转轨道与速度变化', '黄赤交角', '回归线与极圈', '四季与五带'],
    textbook_refs: [{ textbook: s1, chapter: 1 }],
    related_points: ['earth-rotation', 'solar-altitude-daylength', 'time-and-date'],
    common_mistakes: ['混淆近日点与冬至日', '误认为黄赤交角不变'],
  },
  {
    id: 'time-and-date', name: '时间计算', category: 'natural', exam_frequency: 'high',
    description: '地方时、区时的计算，时区划分，日界线（自然日界线与国际日界线）。',
    key_concepts: ['地方时计算', '时区与区时', '国际日界线', '日期范围判断'],
    textbook_refs: [{ textbook: s1, chapter: 1 }],
    related_points: ['earth-rotation', 'earth-revolution', 'coordinate-grid'],
    common_mistakes: ['东加西减方向搞反', '混淆自然日界线（0时经线）与国际日界线（180°经线）'],
  },
  {
    id: 'solar-altitude-daylength', name: '正午太阳高度与昼夜长短', category: 'natural', exam_frequency: 'high',
    description: '正午太阳高度角的计算与分布规律，昼夜长短的时空变化规律。',
    key_concepts: ['正午太阳高度角公式', '正午太阳高度纬度分布', '昼夜长短变化', '极昼极夜'],
    textbook_refs: [{ textbook: s1, chapter: 1 }],
    related_points: ['earth-revolution', 'time-and-date', 'atmosphere-heating'],
    common_mistakes: ['正午太阳高度计算时纬度差判断错误', '混淆昼长与日照时数'],
  },
  {
    id: 'atmosphere-heating', name: '大气受热过程', category: 'natural', exam_frequency: 'high',
    description: '大气的受热过程（太阳暖大地、大地暖大气、大气还大地），逆温现象及其应用。',
    key_concepts: ['太阳辐射、地面辐射、大气逆辐射', '温室效应', '逆温层', '气温垂直分布'],
    textbook_refs: [{ textbook: r1, chapter: 2 }, { textbook: s1, chapter: 2 }],
    related_points: ['solar-radiation-activity', 'atmospheric-circulation', 'climate-types'],
    common_mistakes: ['混淆大气逆辐射与地面辐射', '误认为阴天昼夜温差大'],
  },
  {
    id: 'atmospheric-circulation', name: '大气环流', category: 'natural', exam_frequency: 'high',
    description: '三圈环流的形成与分布，气压带和风带的形成、分布及季节移动。',
    key_concepts: ['三圈环流', '气压带（7个）', '风带（6个）', '气压带风带季节移动'],
    textbook_refs: [{ textbook: r1, chapter: 2 }, { textbook: s1, chapter: 2 }],
    related_points: ['atmosphere-heating', 'pressure-monsoon', 'climate-types', 'weather-systems'],
    common_mistakes: ['混淆副热带高气压带与副极地低气压带的成因', '忽略气压带风带的季节移动'],
  },
  {
    id: 'pressure-monsoon', name: '气压中心与季风', category: 'natural', exam_frequency: 'high',
    description: '海陆分布对气压带的影响，北半球冬夏季气压中心，东亚季风与南亚季风的成因与特征。',
    key_concepts: ['海陆热力性质差异', '亚洲高压与夏威夷高压', '东亚季风', '南亚季风（气压带风带移动）'],
    textbook_refs: [{ textbook: s1, chapter: 2 }],
    related_points: ['atmospheric-circulation', 'climate-types', 'weather-systems'],
    common_mistakes: ['南亚季风夏季成因是气压带风带北移，非海陆热力差异', '混淆季风风向'],
  },
  {
    id: 'weather-systems', name: '天气系统', category: 'natural', exam_frequency: 'high',
    description: '锋面系统（冷锋、暖锋、准静止锋）、低压（气旋）与高压（反气旋）系统。',
    key_concepts: ['冷锋与暖锋', '准静止锋（梅雨、伏旱）', '气旋与反气旋', '锋面气旋'],
    textbook_refs: [{ textbook: r1, chapter: 2 }, { textbook: s1, chapter: 2 }],
    related_points: ['atmospheric-circulation', 'pressure-monsoon', 'climate-types'],
    common_mistakes: ['混淆冷锋过境前后的天气变化', '锋面气旋中冷暖锋位置判断错误'],
  },
  {
    id: 'climate-types', name: '世界主要气候类型', category: 'natural', exam_frequency: 'high',
    description: '世界主要气候类型的成因、分布规律和特征（气温曲线与降水量柱状图判读）。',
    key_concepts: ['热带4种气候', '亚热带2种', '温带3种', '寒带气候', '气候类型判读方法'],
    textbook_refs: [{ textbook: r1, chapter: 2 }],
    related_points: ['atmospheric-circulation', 'pressure-monsoon', 'weather-systems', 'world-climate'],
    common_mistakes: ['地中海气候与亚热带季风气候的降水季节分配混淆', '热带草原与热带季风气候的降水量区分'],
  },
  {
    id: 'climate-change', name: '气候变化', category: 'natural', exam_frequency: 'medium',
    description: '地质时期和近现代气候变化的特征、原因及影响。',
    key_concepts: ['地质时期冰期与间冰期', '近现代全球变暖', '温室气体', '气候变化的影响'],
    textbook_refs: [{ textbook: r1, chapter: 2 }],
    related_points: ['atmosphere-heating', 'carbon-emission'],
  },
  {
    id: 'water-cycle', name: '水循环', category: 'natural', exam_frequency: 'high',
    description: '水循环的类型、环节、水量平衡原理，人类活动对水循环的影响。',
    key_concepts: ['海陆间循环、陆地内循环、海上内循环', '蒸发、水汽输送、降水、径流', '水量平衡', '人类活动影响'],
    textbook_refs: [{ textbook: r1, chapter: 3 }],
    related_points: ['river-lake-hydrology', 'ocean-properties', 'groundwater'],
    common_mistakes: ['混淆水循环各环节的能量来源', '误认为人类主要影响蒸发环节'],
  },
  {
    id: 'ocean-properties', name: '海水性质', category: 'natural', exam_frequency: 'medium',
    description: '海水温度、盐度、密度的分布规律及影响因素。',
    key_concepts: ['海水温度垂直分布', '盐度分布规律', '密度与温度盐度关系', '海水性质对人类活动影响'],
    textbook_refs: [{ textbook: r1, chapter: 3 }],
    related_points: ['ocean-currents', 'water-cycle'],
    common_mistakes: ['混淆盐度与密度的水平分布规律', '忽略红海盐度最高的原因'],
  },
  {
    id: 'ocean-currents', name: '洋流', category: 'natural', exam_frequency: 'high',
    description: '世界洋流的分布规律，洋流对气候、渔场、航运、海洋污染的影响。',
    key_concepts: ['风海流、密度流、补偿流', '世界洋流分布模式', '洋流对气候的影响', '四大渔场'],
    textbook_refs: [{ textbook: r1, chapter: 3 }, { textbook: s1, chapter: 3 }],
    related_points: ['water-cycle', 'ocean-properties', 'climate-types'],
    common_mistakes: ['混淆寒暖流对沿岸气候的影响方向', '南半球没有完整的副极地环流圈'],
  },
  {
    id: 'river-lake-hydrology', name: '河流与湖泊水文特征', category: 'natural', exam_frequency: 'high',
    description: '河流的水文特征（流量、水位、含沙量、冰期）和水系特征，湖泊的分类与功能。',
    key_concepts: ['河流水文特征要素', '水系特征（流域、河道、支流）', '河流补给类型', '湖泊分类'],
    textbook_refs: [{ textbook: r1, chapter: 3 }],
    related_points: ['water-cycle', 'china-rivers', 'geomorphic-profile'],
    common_mistakes: ['混淆水文特征与水系特征', '忽略地下水补给对河流的作用'],
  },
  {
    id: 'plate-tectonics', name: '板块构造与内力作用', category: 'natural', exam_frequency: 'high',
    description: '板块构造学说，内力作用的表现形式（地壳运动、岩浆活动、变质作用），褶皱与断层。',
    key_concepts: ['六大板块', '板块边界类型', '褶皱（背斜、向斜）', '断层（地垒、地堑）'],
    textbook_refs: [{ textbook: r1, chapter: 4 }, { textbook: s1, chapter: 4 }],
    related_points: ['exogenic-landform', 'geomorphic-profile', 'natural-disasters'],
    common_mistakes: ['背斜成谷、向斜成山的逆地形判断', '混淆生长边界与消亡边界的地貌表现'],
  },
  {
    id: 'exogenic-landform', name: '外力作用与常见地貌', category: 'natural', exam_frequency: 'high',
    description: '风化、侵蚀、搬运、堆积作用及其形成的常见地貌类型。',
    key_concepts: ['风化作用', '流水侵蚀与堆积地貌', '风力侵蚀与堆积地貌', '冰川地貌'],
    textbook_refs: [{ textbook: r1, chapter: 4 }],
    related_points: ['plate-tectonics', 'karst-coastal-landform', 'geomorphic-profile'],
    common_mistakes: ['混淆流水侵蚀与风力侵蚀地貌', '冲积扇与三角洲的位置差异'],
  },
  {
    id: 'karst-coastal-landform', name: '喀斯特地貌与海岸地貌', category: 'natural', exam_frequency: 'medium',
    description: '喀斯特地貌的类型（地表与地下）、形成条件；海岸地貌的类型与分布。',
    key_concepts: ['喀斯特地貌（溶洞、峰林、天坑）', '海岸侵蚀地貌（海蚀崖、海蚀柱）', '海岸堆积地貌（沙滩）'],
    textbook_refs: [{ textbook: r1, chapter: 4 }],
    related_points: ['exogenic-landform', 'plate-tectonics'],
  },
  {
    id: 'geomorphic-profile', name: '地质剖面图判读', category: 'natural', exam_frequency: 'high',
    description: '地质剖面图的阅读方法，判断地质构造、岩层新老关系、地质事件顺序。',
    key_concepts: ['岩层新老关系', '不整合面', '侵入关系', '地质事件排序'],
    textbook_refs: [{ textbook: r1, chapter: 4 }],
    related_points: ['plate-tectonics', 'exogenic-landform', 'contour'],
    common_mistakes: ['侵入岩晚于被侵入的岩层', '忽略不整合面代表的时间缺失'],
  },
  {
    id: 'vegetation', name: '植被类型与分布规律', category: 'natural', exam_frequency: 'medium',
    description: '主要植被类型（森林、草原、荒漠）的特征、分布规律及影响因素。',
    key_concepts: ['森林植被（热带雨林、亚热带常绿阔叶林等）', '草原与荒漠', '植被的垂直分布', '植被与环境关系'],
    textbook_refs: [{ textbook: r1, chapter: 5 }],
    related_points: ['soil', 'natural-zones', 'natural-differentiation'],
  },
  {
    id: 'soil', name: '土壤形成与类型', category: 'natural', exam_frequency: 'medium',
    description: '土壤的组成、形成因素（成土母质、气候、生物、地形、时间）、主要土壤类型。',
    key_concepts: ['土壤剖面', '五大成土因素', '黑土、红壤、紫色土', '土壤与人类活动'],
    textbook_refs: [{ textbook: r1, chapter: 5 }],
    related_points: ['vegetation', 'natural-integrity', 'food-security'],
  },
  {
    id: 'natural-integrity', name: '自然环境的整体性', category: 'natural', exam_frequency: 'high',
    description: '自然环境各要素（气候、水文、地貌、土壤、植被）的相互联系与整体性特征。',
    key_concepts: ['五大要素相互作用', '牵一发而动全身', '自然环境的统一演化', '整体性的地理意义'],
    textbook_refs: [{ textbook: s1, chapter: 5 }],
    related_points: ['natural-differentiation', 'eco-environment-region', 'soil', 'vegetation'],
    common_mistakes: ['只分析单一要素而忽略要素间的相互作用', '整体性≠各要素简单相加'],
  },
  {
    id: 'natural-differentiation', name: '地域分异规律', category: 'natural', exam_frequency: 'high',
    description: '纬度地带性（由赤道到两极）、经度地带性（从沿海到内陆）、垂直地带性分异规律。',
    key_concepts: ['纬度地带性（热量为基础）', '经度地带性（水分为基础）', '垂直地带性', '非地带性现象'],
    textbook_refs: [{ textbook: s1, chapter: 5 }],
    related_points: ['natural-integrity', 'natural-zones', 'climate-types'],
    common_mistakes: ['垂直带谱基带与当地纬度地带性一致', '混淆雪线高度的影响因素'],
  },
  {
    id: 'natural-zones', name: '陆地自然带', category: 'natural', exam_frequency: 'medium',
    description: '世界陆地自然带的类型、分布及其与气候的对应关系。',
    key_concepts: ['自然带与气候类型对应', '各自然带特征', '自然带分布模式'],
    textbook_refs: [{ textbook: s1, chapter: 5 }],
    related_points: ['natural-differentiation', 'vegetation', 'soil', 'climate-types'],
  },
  {
    id: 'natural-disasters', name: '自然灾害', category: 'natural', exam_frequency: 'medium',
    description: '主要自然灾害类型（气象灾害、地质灾害、生物灾害）的成因、分布及防御措施。',
    key_concepts: ['气象灾害（台风、暴雨、干旱、寒潮）', '地质灾害（地震、滑坡、泥石流）', '防灾减灾'],
    textbook_refs: [{ textbook: r1, chapter: 5 }],
    related_points: ['plate-tectonics', 'weather-systems', 'climate-change'],
  },

  // ═══════════════════════════════════════════
  // 二、人文地理（14 个）
  // ═══════════════════════════════════════════
  {
    id: 'population-distribution', name: '人口分布', category: 'human', exam_frequency: 'medium',
    description: '世界和中国人口分布特征及影响因素。',
    key_concepts: ['人口密度', '影响人口分布的因素', '中国人口地理分界线（胡焕庸线）'],
    textbook_refs: [{ textbook: r2, chapter: 1 }],
    related_points: ['population-migration', 'population-capacity', 'urbanization'],
  },
  {
    id: 'population-migration', name: '人口迁移', category: 'human', exam_frequency: 'medium',
    description: '人口迁移的类型、影响因素（推拉理论），中国人口迁移的特征。',
    key_concepts: ['推拉理论', '经济因素（主要因素）', '中国民工潮', '人口迁移的影响'],
    textbook_refs: [{ textbook: r2, chapter: 1 }],
    related_points: ['population-distribution', 'urbanization'],
  },
  {
    id: 'population-capacity', name: '人口容量与环境承载力', category: 'human', exam_frequency: 'medium',
    description: '环境承载力、人口合理容量的概念与区别，影响因素。',
    key_concepts: ['环境承载力', '人口合理容量', '资源（首要因素）', '科技发展水平'],
    textbook_refs: [{ textbook: r2, chapter: 1 }],
    related_points: ['population-distribution', 'resource-security'],
    common_mistakes: ['混淆环境承载力与人口合理容量', '误认为消费水平与人口容量正相关'],
  },
  {
    id: 'urbanization', name: '城镇化', category: 'human', exam_frequency: 'high',
    description: '城镇化的标志、进程（S形曲线）、问题与对策，中国城镇化特征。',
    key_concepts: ['城镇化标志', '城镇化进程（初期、中期、后期）', '城镇化问题', '逆城镇化'],
    textbook_refs: [{ textbook: r2, chapter: 2 }],
    related_points: ['urban-spatial-structure', 'urban-hierarchy', 'population-migration'],
    common_mistakes: ['混淆城镇化水平与城镇化速度', '发达国家逆城镇化≠城市衰落'],
  },
  {
    id: 'urban-spatial-structure', name: '城市空间结构与功能分区', category: 'human', exam_frequency: 'high',
    description: '城市内部空间结构，主要功能区（商业区、住宅区、工业区）的分布与特征。',
    key_concepts: ['功能分区', 'CBD特征', '住宅区分化', '工业区布局原则', '地租理论'],
    textbook_refs: [{ textbook: r2, chapter: 2 }],
    related_points: ['urbanization', 'urban-hierarchy', 'service'],
    common_mistakes: ['商业区不一定在城市几何中心', '工业区向市区外缘移动的原因'],
  },
  {
    id: 'urban-hierarchy', name: '城市等级体系', category: 'human', exam_frequency: 'medium',
    description: '城市等级划分、不同等级城市的服务功能差异，城市等级体系的应用。',
    key_concepts: ['城市等级与服务范围', '城市数目与服务等级关系', '长三角城市体系案例'],
    textbook_refs: [{ textbook: r2, chapter: 2 }],
    related_points: ['urbanization', 'urban-spatial-structure', 'service'],
  },
  {
    id: 'agriculture-location', name: '农业区位因素与变化', category: 'human', exam_frequency: 'high',
    description: '农业区位因素（自然+社会经济）分析，农业区位因素的变化。',
    key_concepts: ['自然因素（气候、地形、土壤、水源）', '社会经济因素（市场、交通、政策、科技）', '区位因素变化'],
    textbook_refs: [{ textbook: r2, chapter: 3 }],
    related_points: ['agriculture-regions', 'china-agriculture'],
    common_mistakes: ['自然因素≠不变，社会经济因素≠唯一变化', '温室大棚改变的是热量条件'],
  },
  {
    id: 'agriculture-regions', name: '主要农业地域类型', category: 'human', exam_frequency: 'high',
    description: '世界主要农业地域类型（水稻种植业、商品谷物农业、混合农业、大牧场放牧业等）的特征与分布。',
    key_concepts: ['季风水田农业', '商品谷物农业', '混合农业', '大牧场放牧业', '乳畜业'],
    textbook_refs: [{ textbook: r2, chapter: 3 }],
    related_points: ['agriculture-location', 'china-agriculture'],
  },
  {
    id: 'industry-location', name: '工业区位因素与变化', category: 'human', exam_frequency: 'high',
    description: '工业区位因素分析，工业区位因素的变化趋势。',
    key_concepts: ['原料、燃料、劳动力、市场、交通', '区位因素变化（科技、信息、环保）', '工业导向类型'],
    textbook_refs: [{ textbook: r2, chapter: 4 }],
    related_points: ['industry-regions', 'china-industry'],
    common_mistakes: ['混淆原料导向型与市场导向型', '忽略环保因素对工业布局的影响'],
  },
  {
    id: 'industry-regions', name: '主要工业地域类型', category: 'human', exam_frequency: 'high',
    description: '世界主要工业地域类型（传统工业区、新兴工业区）的特征与案例。',
    key_concepts: ['德国鲁尔区', '意大利新兴工业', '美国硅谷', '中国辽中南'],
    textbook_refs: [{ textbook: r2, chapter: 4 }],
    related_points: ['industry-location', 'china-industry', 'industrial-transfer'],
  },
  {
    id: 'transportation', name: '交通运输布局与影响', category: 'human', exam_frequency: 'high',
    description: '交通运输方式的选择，交通运输布局的区位因素，交通运输对区域发展的影响。',
    key_concepts: ['五种运输方式特点', '交通布局区位因素', '交通对聚落形态影响', '交通对商业网点影响'],
    textbook_refs: [{ textbook: r2, chapter: 5 }],
    related_points: ['china-transportation', 'urbanization', 'industry-location'],
  },
  {
    id: 'service', name: '服务业区位选择', category: 'human', exam_frequency: 'medium',
    description: '服务业的区位选择因素，生产性服务业与生活性服务业的布局差异。',
    key_concepts: ['市场因素（人口规模与消费能力）', '交通通达度', '集聚效应', '生产性vs生活性服务业'],
    textbook_refs: [{ textbook: r2, chapter: 6 }],
    related_points: ['urban-spatial-structure', 'urban-hierarchy'],
  },
  {
    id: 'cultural-geography', name: '文化景观与地域差异', category: 'human', exam_frequency: 'low',
    description: '文化景观的概念、特征，世界文化地域差异。',
    key_concepts: ['文化景观', '文化扩散', '地域文化差异'],
    textbook_refs: [{ textbook: r2, chapter: 1 }],
    related_points: ['ethnicity-religion', 'world-regions'],
  },
  {
    id: 'ethnicity-religion', name: '民族与宗教地理', category: 'human', exam_frequency: 'low',
    description: '世界主要民族和宗教的分布特征。',
    key_concepts: ['世界主要宗教分布', '民族分布', '宗教对文化景观影响'],
    textbook_refs: [{ textbook: r2, chapter: 1 }],
    related_points: ['cultural-geography', 'world-regions'],
  },

  // ═══════════════════════════════════════════
  // 三、区域发展与资源环境（14 个）
  // ═══════════════════════════════════════════
  {
    id: 'region-characteristics', name: '区域特征与区域比较', category: 'regional', exam_frequency: 'high',
    description: '区域的概念、特征（整体性、差异性、开放性），区域比较方法。',
    key_concepts: ['区域的概念与特征', '区域比较方法', '区域发展条件评价'],
    textbook_refs: [{ textbook: s2, chapter: 1 }],
    related_points: ['regional-coordination', 'world-regions', 'china-regions'],
  },
  {
    id: 'eco-environment-region', name: '生态环境问题与区域治理', category: 'regional', exam_frequency: 'high',
    description: '区域生态环境问题的成因、危害与治理措施（荒漠化、水土流失、湿地退化等）。',
    key_concepts: ['荒漠化成因与治理', '水土流失', '湿地保护', '生物多样性'],
    textbook_refs: [{ textbook: s2, chapter: 2 }, { textbook: s3, chapter: 3 }],
    related_points: ['natural-integrity', 'china-ecological', 'carbon-emission'],
    common_mistakes: ['只分析自然原因忽略人为因素', '治理措施要因地制宜而非照搬'],
  },
  {
    id: 'resource-exploitation', name: '资源开发与区域可持续发展', category: 'regional', exam_frequency: 'high',
    description: '区域资源（矿产、水能等）开发条件评价，资源开发与区域可持续发展。',
    key_concepts: ['资源开发条件评价', '资源枯竭型城市转型', '可持续发展策略'],
    textbook_refs: [{ textbook: s2, chapter: 2 }, { textbook: s3, chapter: 1 }],
    related_points: ['resource-security', 'energy-security', 'industrial-transfer'],
  },
  {
    id: 'industrial-transfer', name: '产业转移', category: 'regional', exam_frequency: 'high',
    description: '产业转移的规律、影响因素，对转出区和转入区的影响。',
    key_concepts: ['产业转移规律（劳动密集型→资本→技术）', '影响因素', '对转出区影响', '对转入区影响'],
    textbook_refs: [{ textbook: s2, chapter: 4 }],
    related_points: ['industry-location', 'industry-regions', 'regional-coordination'],
    common_mistakes: ['产业转移不等于产业消失', '转入区不一定只有好处'],
  },
  {
    id: 'resource-allocation', name: '资源跨区域调配', category: 'regional', exam_frequency: 'high',
    description: '资源跨区域调配的原因、主要工程（南水北调、西气东输、西电东送）及其影响。',
    key_concepts: ['调配原因（供需矛盾）', '南水北调', '西气东输', '西电东送', '对调入区和调出区影响'],
    textbook_refs: [{ textbook: s2, chapter: 4 }],
    related_points: ['resource-security', 'water-cycle', 'energy-security'],
  },
  {
    id: 'urban-radiation', name: '城市辐射功能与城市群', category: 'regional', exam_frequency: 'high',
    description: '城市的辐射功能，城市群的形成与发展。',
    key_concepts: ['城市辐射功能', '城市腹地', '城市群（长三角、珠三角、京津冀）'],
    textbook_refs: [{ textbook: s2, chapter: 3 }],
    related_points: ['urban-hierarchy', 'regional-coordination', 'urbanization'],
  },
  {
    id: 'regional-coordination', name: '区域协调发展战略', category: 'regional', exam_frequency: 'high',
    description: '国家重大区域发展战略（京津冀协同、长三角一体化、粤港澳大湾区、西部大开发等）。',
    key_concepts: ['京津冀协同发展', '长江经济带', '粤港澳大湾区', '西部大开发', '东北振兴'],
    textbook_refs: [{ textbook: s2, chapter: 3 }],
    related_points: ['urban-radiation', 'industrial-transfer', 'china-regions'],
  },
  {
    id: 'sustainable-development', name: '可持续发展', category: 'regional', exam_frequency: 'high',
    description: '可持续发展的概念、内涵（三大支柱）、基本途径。',
    key_concepts: ['可持续发展概念', '三大支柱（经济、社会、生态）', '循环经济', '清洁生产'],
    textbook_refs: [{ textbook: s3, chapter: 4 }],
    related_points: ['green-economy', 'carbon-emission', 'eco-environment-region'],
  },
  {
    id: 'resource-security', name: '自然资源安全', category: 'regional', exam_frequency: 'high',
    description: '自然资源安全的内涵，主要资源安全问题及对策。',
    key_concepts: ['资源安全概念', '供需矛盾', '资源安全战略', '节约与替代'],
    textbook_refs: [{ textbook: s3, chapter: 1 }],
    related_points: ['food-security', 'energy-security', 'population-capacity'],
  },
  {
    id: 'food-security', name: '粮食安全与耕地保护', category: 'regional', exam_frequency: 'high',
    description: '粮食安全的内涵、影响因素，耕地保护政策与措施。',
    key_concepts: ['粮食安全内涵', '影响粮食产量因素', '耕地红线', '科技兴农'],
    textbook_refs: [{ textbook: s3, chapter: 2 }],
    related_points: ['agriculture-location', 'resource-security', 'soil'],
  },
  {
    id: 'energy-security', name: '能源安全与战略储备', category: 'regional', exam_frequency: 'high',
    description: '能源安全的内涵，中国能源安全面临的问题与对策。',
    key_concepts: ['能源安全概念', '中国能源结构', '新能源发展', '战略储备', '能源多元化'],
    textbook_refs: [{ textbook: s3, chapter: 3 }],
    related_points: ['resource-security', 'resource-allocation', 'carbon-emission'],
  },
  {
    id: 'carbon-emission', name: '碳排放与环境保护', category: 'regional', exam_frequency: 'high',
    description: '碳排放的来源与影响，全球气候变化应对，环境保护国际合作。',
    key_concepts: ['碳排放来源', '碳循环', '碳达峰碳中和', '国际合作', '碳交易'],
    textbook_refs: [{ textbook: s3, chapter: 4 }],
    related_points: ['climate-change', 'sustainable-development', 'energy-security', 'green-economy'],
  },
  {
    id: 'green-economy', name: '绿色发展与生态文明', category: 'regional', exam_frequency: 'medium',
    description: '绿色发展理念，生态文明建设的途径与实践。',
    key_concepts: ['绿色发展', '生态文明', '生态补偿', '绿水青山就是金山银山'],
    textbook_refs: [{ textbook: s3, chapter: 4 }],
    related_points: ['sustainable-development', 'carbon-emission', 'eco-environment-region'],
  },
  {
    id: 'marine-development', name: '海洋开发与海洋权益', category: 'regional', exam_frequency: 'medium',
    description: '海洋资源开发类型，海洋权益与我国南海问题。',
    key_concepts: ['海洋资源类型', '海洋空间利用', '领海与专属经济区', '南海诸岛'],
    textbook_refs: [{ textbook: s3, chapter: 2 }],
    related_points: ['resource-security', 'world-overview'],
  },

  // ═══════════════════════════════════════════
  // 四、世界地理与中国地理（12 个）
  // ═══════════════════════════════════════════
  {
    id: 'world-overview', name: '世界地理概况', category: 'world_china', exam_frequency: 'high',
    description: '世界海陆分布、气候分布、自然资源分布的总体特征。',
    key_concepts: ['七大洲四大洋', '世界气候分布', '世界自然资源', '世界人口与城市'],
    textbook_refs: [],
    related_points: ['world-regions', 'world-countries', 'climate-types'],
  },
  {
    id: 'world-regions', name: '世界主要区域', category: 'world_china', exam_frequency: 'high',
    description: '世界主要区域（东亚、东南亚、南亚、中亚、西亚、欧洲西部、北美、撒哈拉以南非洲、极地）的地理特征。',
    key_concepts: ['区域定位', '自然地理特征', '人文地理特征', '区域发展问题'],
    textbook_refs: [],
    related_points: ['world-overview', 'world-countries', 'region-characteristics'],
  },
  {
    id: 'world-countries', name: '主要国家地理特征', category: 'world_china', exam_frequency: 'medium',
    description: '主要国家（美国、日本、俄罗斯、澳大利亚、印度、巴西等）的地理特征。',
    key_concepts: ['国家定位', '自然条件', '经济特征', '区域差异'],
    textbook_refs: [],
    related_points: ['world-regions', 'world-overview'],
  },
  {
    id: 'china-terrain', name: '中国地形', category: 'world_china', exam_frequency: 'high',
    description: '中国地形特征（地势三级阶梯、地形类型多样）、主要山脉和地形区。',
    key_concepts: ['三级阶梯', '主要山脉', '四大高原', '四大盆地', '三大平原'],
    textbook_refs: [],
    related_points: ['china-climate', 'china-rivers', 'plate-tectonics'],
    common_mistakes: ['混淆地势特征与地形特征', '山脉走向判断错误'],
  },
  {
    id: 'china-climate', name: '中国气候', category: 'world_china', exam_frequency: 'high',
    description: '中国气候特征（季风气候显著、大陆性强），气温和降水的时空分布。',
    key_concepts: ['冬夏季气温分布', '温度带', '降水时空分布', '季风区与非季风区', '气候灾害'],
    textbook_refs: [],
    related_points: ['china-terrain', 'china-rivers', 'climate-types', 'weather-systems'],
  },
  {
    id: 'china-rivers', name: '中国河流', category: 'world_china', exam_frequency: 'high',
    description: '长江、黄河的概况、开发治理，中国主要河流的水文特征。',
    key_concepts: ['长江水系与开发', '黄河水系与治理', '内外流河', '河流与区域发展'],
    textbook_refs: [],
    related_points: ['china-terrain', 'china-climate', 'river-lake-hydrology', 'resource-allocation'],
  },
  {
    id: 'china-agriculture', name: '中国农业', category: 'world_china', exam_frequency: 'high',
    description: '中国农业分布格局，主要农作物分布，农业发展方向。',
    key_concepts: ['东部种植业vs西部畜牧业', '主要粮食作物分布', '经济作物', '农业现代化'],
    textbook_refs: [],
    related_points: ['agriculture-location', 'agriculture-regions', 'china-climate', 'food-security'],
  },
  {
    id: 'china-industry', name: '中国工业', category: 'world_china', exam_frequency: 'medium',
    description: '中国工业基地的分布与变化，高新技术产业发展。',
    key_concepts: ['四大工业基地', '工业布局变化', '高新技术产业', '产业升级'],
    textbook_refs: [],
    related_points: ['industry-location', 'industry-regions', 'industrial-transfer'],
  },
  {
    id: 'china-transportation', name: '中国交通运输', category: 'world_china', exam_frequency: 'medium',
    description: '中国主要铁路干线、公路、水运和航空运输网络。',
    key_concepts: ['铁路干线（五纵三横）', '交通枢纽', '交通运输网密度', '高铁影响'],
    textbook_refs: [],
    related_points: ['transportation', 'china-regions'],
  },
  {
    id: 'china-regions', name: '中国区域发展', category: 'world_china', exam_frequency: 'high',
    description: '中国四大地区（东部、中部、西部、东北）的发展差异与协调发展战略。',
    key_concepts: ['四大地区划分', '区域发展差异', '西部大开发', '东北振兴', '中部崛起'],
    textbook_refs: [],
    related_points: ['regional-coordination', 'china-terrain', 'china-agriculture', 'china-industry'],
  },
  {
    id: 'china-ecological', name: '中国生态环境问题', category: 'world_china', exam_frequency: 'high',
    description: '中国主要生态环境问题（荒漠化、水土流失、盐碱化、酸雨等）的分布与治理。',
    key_concepts: ['西北荒漠化', '黄土高原水土流失', '华北盐碱化', '南方酸雨'],
    textbook_refs: [],
    related_points: ['eco-environment-region', 'china-terrain', 'china-climate', 'natural-integrity'],
  },
  {
    id: 'china-resources', name: '中国自然资源', category: 'world_china', exam_frequency: 'medium',
    description: '中国主要自然资源的分布特征与利用问题。',
    key_concepts: ['水资源时空分布', '土地资源', '矿产资源', '资源利用问题'],
    textbook_refs: [],
    related_points: ['resource-security', 'resource-allocation', 'water-cycle'],
  },

  // ═══════════════════════════════════════════
  // 五、地理工具与方法（8 个）
  // ═══════════════════════════════════════════
  {
    id: 'map-elements', name: '地图三要素', category: 'tools', exam_frequency: 'high',
    description: '地图的比例尺、方向、图例和注记。',
    key_concepts: ['比例尺大小与范围精度', '方向判断（经纬网、指向标、一般方法）', '图例判读'],
    textbook_refs: [{ textbook: r1, chapter: 1 }],
    related_points: ['contour', 'coordinate-grid', 'statistical-charts'],
    common_mistakes: ['比例尺大小与表示范围的关系搞反', '经纬网定方向时跨越180°经线'],
  },
  {
    id: 'contour', name: '等高线判读', category: 'tools', exam_frequency: 'high',
    description: '等高线地形图的判读方法，地形部位识别，坡度判断，地形剖面图绘制。',
    key_concepts: ['等高线特征', '地形部位（山顶、鞍部、山谷、山脊、陡崖）', '坡度判断', '通视问题'],
    textbook_refs: [{ textbook: r1, chapter: 4 }],
    related_points: ['map-elements', 'geomorphic-profile', 'coordinate-grid'],
    common_mistakes: ['山谷等高线向高处凸出，山脊向低处凸出', '陡崖相对高度计算'],
  },
  {
    id: 'coordinate-grid', name: '经纬网与地理定位', category: 'tools', exam_frequency: 'high',
    description: '经纬线的特征，经纬度判读，利用经纬网确定位置和计算距离。',
    key_concepts: ['经纬线特征', '经纬度判读', '经纬网定方向', '球面距离估算'],
    textbook_refs: [{ textbook: r1, chapter: 1 }, { textbook: s1, chapter: 1 }],
    related_points: ['map-elements', 'time-and-date', 'earth-rotation'],
    common_mistakes: ['东西半球划分（20°W和160°E）', '经纬网上两点间最短距离是大圆航线'],
  },
  {
    id: 'statistical-charts', name: '地理统计图表判读', category: 'tools', exam_frequency: 'high',
    description: '地理统计图表（折线图、柱状图、饼图、雷达图、三角坐标图等）的判读方法。',
    key_concepts: ['折线图趋势分析', '柱状图对比', '饼图比例', '三角坐标图', '人口金字塔'],
    textbook_refs: [],
    related_points: ['data-description', 'map-elements', 'population-distribution'],
    common_mistakes: ['三角坐标图读数方法', '人口金字塔的三种类型判断'],
  },
  {
    id: 'geo-it', name: '地理信息技术', category: 'tools', exam_frequency: 'medium',
    description: '遥感（RS）、全球导航卫星系统（GNSS/北斗）、地理信息系统（GIS）的概念与应用。',
    key_concepts: ['RS（获取信息）', 'GNSS/北斗（定位导航）', 'GIS（分析处理）', '3S技术综合应用'],
    textbook_refs: [{ textbook: s1, chapter: 5 }],
    related_points: ['spatial-analysis', 'data-description'],
    common_mistakes: ['RS是"看"，GIS是"分析"，GNSS是"定位"', '不能混淆三者的功能'],
  },
  {
    id: 'spatial-analysis', name: '空间分析与区域比较', category: 'tools', exam_frequency: 'medium',
    description: '空间分布特征描述方法，区域比较的思路与框架。',
    key_concepts: ['空间分布描述（位置、范围、形态）', '区域比较框架', '综合分析方法'],
    textbook_refs: [],
    related_points: ['region-characteristics', 'data-description', 'cause-effect'],
  },
  {
    id: 'data-description', name: '地理数据描述与趋势分析', category: 'tools', exam_frequency: 'high',
    description: '地理数据的描述方法（总量、变化趋势、差异比较），数据分析的基本思路。',
    key_concepts: ['数据描述模板', '变化趋势描述', '极值与差异', '相关性分析'],
    textbook_refs: [],
    related_points: ['statistical-charts', 'spatial-analysis', 'cause-effect'],
    common_mistakes: ['描述数据时缺少具体数值支撑', '混淆相关关系与因果关系'],
  },
  {
    id: 'cause-effect', name: '地理因果推理与综合思维', category: 'tools', exam_frequency: 'high',
    description: '地理问题的因果分析方法，综合思维在区域分析中的应用。',
    key_concepts: ['因果链分析', '多因素综合分析', '自然-人文综合', '尺度思想'],
    textbook_refs: [],
    related_points: ['natural-integrity', 'spatial-analysis', 'data-description'],
  },
];

// Generate YAML files
let count = 0;
for (const kp of knowledgePoints) {
  const lines: string[] = [];
  lines.push(`id: "${kp.id}"`);
  lines.push(`name: "${kp.name}"`);
  lines.push(`category: "${kp.category}"`);
  lines.push(`exam_frequency: "${kp.exam_frequency}"`);
  lines.push(`description: "${kp.description}"`);
  lines.push('key_concepts:');
  for (const c of kp.key_concepts) {
    lines.push(`  - "${c}"`);
  }
  lines.push('textbook_refs:');
  if (kp.textbook_refs.length === 0) {
    lines.push('  []');
  } else {
    for (const ref of kp.textbook_refs) {
      lines.push(`  - textbook: "${ref.textbook}"`);
      lines.push(`    chapter: ${ref.chapter}`);
      if (ref.section) {
        lines.push(`    section: ${ref.section}`);
      }
    }
  }
  lines.push('related_points:');
  for (const rp of kp.related_points) {
    lines.push(`  - "${rp}"`);
  }
  if (kp.common_mistakes && kp.common_mistakes.length > 0) {
    lines.push('common_mistakes:');
    for (const m of kp.common_mistakes) {
      lines.push(`  - "${m}"`);
    }
  }

  const filePath = join(OUTPUT_DIR, `${kp.id}.yaml`);
  writeFileSync(filePath, lines.join('\n') + '\n', 'utf-8');
  count++;
}

console.log(`Generated ${count} knowledge point YAML files in ${OUTPUT_DIR}`);

// Verify count matches expected
if (count !== 84) {
  console.error(`ERROR: Expected 84 knowledge points, got ${count}`);
  process.exit(1);
}
console.log('✅ Count verification passed: 84/84');
