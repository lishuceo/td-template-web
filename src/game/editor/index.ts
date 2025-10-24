/**
 * AI友好的关卡编辑器 API
 *
 * 这是一个专为AI设计的关卡创作工具，让AI能够通过简单的描述生成完整的塔防关卡。
 *
 * 核心特性：
 * 1. 自然语言式的配置 - 简单描述路径、策略即可
 * 2. 自动化生成 - 根据路径自动生成城墙和塔位
 * 3. 智能验证 - 自动检查配置的合法性
 * 4. 灵活导出 - 支持多种格式和预览
 *
 * @see 完整文档: docs/level-editor.md
 * @see 使用示例: src/game/editor/examples.ts
 *
 * @example
 * ```typescript
 * // 创建一个简单的关卡
 * const level = createLevel({
 *   id: 1,
 *   name: "测试关卡",
 *   description: "这是一个测试关卡",
 *   path: {
 *     points: [
 *       { x: 100, y: 100 },
 *       { x: 400, y: 100 },
 *       { x: 400, y: 300 },
 *       { x: 700, y: 300 }
 *     ]
 *   },
 *   towerSlots: {
 *     strategy: 'auto',
 *     count: 4
 *   },
 *   waves: [
 *     {
 *       batches: [
 *         { enemyType: 'normal', count: 5, delay: 0 }
 *       ]
 *     }
 *   ]
 * });
 * ```
 */

import type { LevelConfig } from '@/types/game';
import { LevelGenerator } from './LevelGenerator';
import { LevelValidator } from './LevelValidator';
import type {
  AILevelConfig,
  LevelGenerationOptions,
  ValidationResult,
  LevelPreview,
} from './types';

// 导出类型
export type {
  AILevelConfig,
  LevelGenerationOptions,
  ValidationResult,
  LevelPreview,
  SimplePathDescription,
  TowerSlotStrategy,
} from './types';

// 导出类
export { LevelGenerator } from './LevelGenerator';
export { LevelValidator } from './LevelValidator';

/**
 * 主API类 - 统一的关卡编辑器接口
 */
export class LevelEditor {
  private generator: LevelGenerator;
  private validator: LevelValidator;

  constructor(options?: LevelGenerationOptions) {
    this.generator = new LevelGenerator(options);
    this.validator = new LevelValidator();
  }

  /**
   * 创建关卡（验证 + 生成）
   */
  create(aiConfig: AILevelConfig): {
    level: LevelConfig | null;
    validation: ValidationResult;
  } {
    // 先验证
    const validation = this.validator.validateAIConfig(aiConfig);

    // 如果验证失败，返回null
    if (!validation.valid) {
      return { level: null, validation };
    }

    // 生成关卡
    const level = this.generator.generate(aiConfig);

    // 验证生成的关卡
    const levelValidation = this.validator.validateLevelConfig(level);

    return {
      level: levelValidation.valid ? level : null,
      validation: levelValidation,
    };
  }

  /**
   * 仅生成，不验证（快速模式）
   */
  generate(aiConfig: AILevelConfig): LevelConfig {
    return this.generator.generate(aiConfig);
  }

  /**
   * 仅验证，不生成
   */
  validate(aiConfig: AILevelConfig): ValidationResult {
    return this.validator.validateAIConfig(aiConfig);
  }

  /**
   * 预览关卡（用于可视化）
   */
  preview(aiConfig: AILevelConfig): LevelPreview {
    return this.generator.generatePreview(aiConfig);
  }

  /**
   * 导出为JSON字符串
   */
  exportJSON(aiConfig: AILevelConfig, pretty = true): string {
    const level = this.generator.generate(aiConfig);
    return JSON.stringify(level, null, pretty ? 2 : 0);
  }

  /**
   * 导出为TypeScript代码
   */
  exportTypeScript(aiConfig: AILevelConfig): string {
    const level = this.generator.generate(aiConfig);
    return this.generateTypeScriptCode(level);
  }

  /**
   * 生成TypeScript代码
   */
  private generateTypeScriptCode(level: LevelConfig): string {
    return `// 关卡配置: ${level.name}
import type { LevelConfig } from '@/types/game';

export const level${level.id}: LevelConfig = ${JSON.stringify(level, null, 2)};
`;
  }
}

// =============================================================================
// 便捷函数 API
// =============================================================================

/**
 * 创建关卡（一步到位）
 *
 * @example
 * ```typescript
 * const result = createLevel({
 *   id: 1,
 *   name: "新手关",
 *   description: "欢迎来到塔防世界",
 *   path: {
 *     points: [{ x: 100, y: 100 }, { x: 500, y: 100 }]
 *   },
 *   towerSlots: { strategy: 'auto' },
 *   waves: [{ batches: [{ enemyType: 'normal', count: 5, delay: 0 }] }]
 * });
 *
 * if (result.level) {
 *   console.log('关卡创建成功！', result.level);
 * } else {
 *   console.error('关卡创建失败：', result.validation.errors);
 * }
 * ```
 */
export function createLevel(
  aiConfig: AILevelConfig,
  options?: LevelGenerationOptions
): {
  level: LevelConfig | null;
  validation: ValidationResult;
} {
  const editor = new LevelEditor(options);
  return editor.create(aiConfig);
}

/**
 * 快速生成关卡（不验证）
 */
export function quickGenerateLevel(
  aiConfig: AILevelConfig,
  options?: LevelGenerationOptions
): LevelConfig {
  const editor = new LevelEditor(options);
  return editor.generate(aiConfig);
}

/**
 * 验证关卡配置
 */
export function validateLevelConfig(aiConfig: AILevelConfig): ValidationResult {
  const editor = new LevelEditor();
  return editor.validate(aiConfig);
}

/**
 * 预览关卡（获取城墙和塔位位置）
 */
export function previewLevelLayout(
  aiConfig: AILevelConfig,
  options?: LevelGenerationOptions
): LevelPreview {
  const editor = new LevelEditor(options);
  return editor.preview(aiConfig);
}

/**
 * 导出为JSON
 */
export function exportLevelAsJSON(
  aiConfig: AILevelConfig,
  options?: LevelGenerationOptions,
  pretty = true
): string {
  const editor = new LevelEditor(options);
  return editor.exportJSON(aiConfig, pretty);
}

/**
 * 导出为TypeScript代码
 */
export function exportLevelAsTypeScript(
  aiConfig: AILevelConfig,
  options?: LevelGenerationOptions
): string {
  const editor = new LevelEditor(options);
  return editor.exportTypeScript(aiConfig);
}

// =============================================================================
// 预设模板
// =============================================================================

/**
 * 快速创建模板
 */
export const templates = {
  /**
   * 简单直线关卡
   */
  simpleStraight: (id: number): AILevelConfig => ({
    id,
    name: `关卡${id} - 简单直线`,
    description: '一条简单的直线路径',
    path: {
      points: [
        { x: 100, y: 300 },
        { x: 1100, y: 300 },
      ],
    },
    towerSlots: {
      strategy: 'auto',
      count: 4,
    },
    waves: [
      {
        batches: [{ enemyType: 'normal', count: 5, delay: 0 }],
      },
    ],
  }),

  /**
   * L型路径
   */
  lShape: (id: number): AILevelConfig => ({
    id,
    name: `关卡${id} - L型路径`,
    description: 'L型转弯路径',
    path: {
      points: [
        { x: 100, y: 100 },
        { x: 600, y: 100 },
        { x: 600, y: 600 },
      ],
    },
    towerSlots: {
      strategy: 'auto',
      count: 5,
    },
    waves: [
      {
        batches: [
          { enemyType: 'normal', count: 8, delay: 0 },
          { enemyType: 'elite', count: 2, delay: 3 },
        ],
      },
    ],
  }),

  /**
   * S型曲线
   */
  sShape: (id: number): AILevelConfig => ({
    id,
    name: `关卡${id} - S型曲线`,
    description: 'S型曲线路径',
    path: {
      points: [
        { x: 100, y: 200 },
        { x: 400, y: 200 },
        { x: 400, y: 500 },
        { x: 800, y: 500 },
        { x: 800, y: 200 },
        { x: 1100, y: 200 },
      ],
    },
    towerSlots: {
      strategy: 'auto',
      count: 6,
    },
    waves: [
      {
        batches: [{ enemyType: 'normal', count: 10, delay: 0 }],
      },
      {
        batches: [
          { enemyType: 'normal', count: 15, delay: 0 },
          { enemyType: 'elite', count: 3, delay: 2 },
        ],
      },
    ],
  }),

  /**
   * 环形路径
   */
  circular: (id: number): AILevelConfig => ({
    id,
    name: `关卡${id} - 环形路径`,
    description: '环形防御路径',
    path: {
      points: [
        { x: 600, y: 100 },
        { x: 900, y: 300 },
        { x: 900, y: 500 },
        { x: 600, y: 600 },
        { x: 300, y: 500 },
        { x: 300, y: 300 },
        { x: 600, y: 100 },
        { x: 600, y: 350 },
        { x: 100, y: 350 },
      ],
    },
    towerSlots: {
      strategy: 'auto',
      count: 8,
    },
    waves: [
      {
        batches: [{ enemyType: 'normal', count: 15, delay: 0 }],
      },
      {
        batches: [
          { enemyType: 'elite', count: 5, delay: 0 },
          { enemyType: 'normal', count: 20, delay: 2 },
        ],
      },
      {
        batches: [{ enemyType: 'boss', count: 1, delay: 0 }],
      },
    ],
  }),
};

// =============================================================================
// 默认导出
// =============================================================================

export default LevelEditor;
