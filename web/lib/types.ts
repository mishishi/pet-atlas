// 宠物品种元数据类型定义
// 对照 /Users/zhurenbao/Jason/codex-workspace/pet-receiver/content/pets/README.md
// 所有字段标记 optional(?)= 模板/分类可能不填,见 README「模板对照」表。

/** 分类:dog / cat / small-mammal / bird / reptile */
export type PetCategory =
  | "dog"
  | "cat"
  | "small-mammal"
  | "bird"
  | "reptile";

/** 状态 */
export type PetStatus = "published" | "draft" | "archived";

/** 体型分组 */
export type SizeGroup = "toy" | "small" | "medium" | "large" | "giant";

/** 性格 6 维评分(1-10) */
export interface PersonalityScores {
  affection: number;     // 亲人度
  activity: number;      // 活跃度
  obedience: number;     // 服从度
  independence: number;  // 独立性
  vocalization: number;  // 吠叫度
  intelligence: number;  // 智商值
  summary?: string;      // 综合副标题
  tags?: string[];       // 性格标签 4-6 个
}

export interface Name {
  zh: string;
  en: string;
  alias?: {
    zh?: string[];
  };
}

export interface Origin {
  country?: string;
  region?: string;
  /** [lat, lng] 用于地图可视化 */
  coordinates?: [number, number];
}

export interface Physical {
  sizeGroup?: SizeGroup;
  heightCm?: string;        // 范围如 "54-62"
  weightKg?: string;        // 范围如 "25-32"
  lifespanYears?: string;   // 范围如 "10-12"
  coat?: string;            // 被毛描述
  coatColors?: string[];
  eyeColors?: string[];
}

export interface HistoryNode {
  year: string;
  event: string;
}

export interface History {
  timeline?: HistoryNode[];
}

export interface Care {
  diet?: string;
  exercise?: string;
  health?: string;
  training?: string;
}

/** 运营元信息 */
export interface PetMeta {
  views?: number;
  favorites?: number;
  completeness?: number; // 0-100
}

/** 完整 Pet schema */
export interface Pet {
  slug: string;
  name: Name;
  category: PetCategory;
  /** "1" / "2" / "3" / "4",对应 4 套图谱模板 */
  template: "1" | "2" | "3" | "4";
  status: PetStatus;
  publishedAt: string; // ISO date

  origin?: Origin;
  physical?: Physical;
  personality?: PersonalityScores;
  history?: History;
  care?: Care;

  /** 4 个趣闻/影视/历史梗 */
  famous?: string[];

  /** 主题聚合标签 */
  tags?: string[];

  /** 封面图相对路径,如 "art/atlas-01-cover.png" */
  coverImage: string;
  /** 6 张图谱文件名(顺序固定) */
  gallery: string[];

  meta?: PetMeta;
}

/** 图谱条目(用于详情页/翻页页) */
export interface BreedAtlas {
  name: { zh: string; en: string };
  /** 6 张图谱 URL,按顺序 */
  gallery: string[];
  /** 6 张图对应的语义标签(供 UI 展示),如 "封面 / 形态 / 性格 / 历史 / 养护 / 名场面" */
  slots: AtlasSlot[];
}

export interface AtlasSlot {
  index: number;       // 1-6
  label: string;       // 中文标签
  filename: string;    // /atlas/xxx.png
}
