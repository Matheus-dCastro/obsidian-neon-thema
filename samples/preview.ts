/**
 * =============================================================================
 * Obsidian Neon (Dracula Syntax) - TypeScript Showcase
 * =============================================================================
 * Demonstrates:
 *   - Advanced Type System: Generics, Mapped & Conditional Types, Utility Types
 *   - Interfaces, Enums, Type Guards, Discriminated Unions
 *   - Decorators, Abstract Classes, Namespaces & Asynchronous Pipelines
 *   - Template Literal Types & Semantic Token Colorization
 */

export namespace ObsidianNeon {
  export type HexColor = `#${string}`;
  export type EventTrigger<TName extends string> = `on${Capitalize<TName>}`;

  export type DeepReadonly<T> = {
    readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
  };

  export type Result<TData, TError extends Error = Error> =
    | { readonly success: true; readonly data: TData }
    | { readonly success: false; readonly error: TError };
}

// --- Enums & Const Assertions ---
export enum SyntaxCategory {
  Keyword = 'KEYWORD_ITALIC_PINK',
  Function = 'FUNCTION_BOLD_GREEN',
  ClassType = 'TYPE_CYAN',
  Constant = 'CONST_PURPLE',
  Parameter = 'PARAM_ORANGE',
  StringLiteral = 'STRING_YELLOW',
}

export const THEME_CONFIG = {
  id: 'obsidian-neon-dracula-syntax' as const,
  version: '1.2.31' as const,
  contrastRatio: 14.8,
  supportsSemanticTokens: true,
} as const;

// --- Interfaces & Discriminated Unions ---
export interface IHighlightToken<TKind extends SyntaxCategory = SyntaxCategory> {
  readonly id: string;
  readonly category: TKind;
  readonly scope: string[];
  readonly foreground: ObsidianNeon.HexColor;
  readonly fontStyle?: 'italic' | 'bold' | 'underline';
}

export type CodeElement =
  | { kind: 'variable'; identifier: string; isConst: boolean; typeAnnotation: string }
  | { kind: 'function'; name: string; parameters: Array<{ name: string; type: string }>; returns: string }
  | { kind: 'class'; className: string; implementsList: string[]; isAbstract?: boolean };

// --- Decorator Implementation ---
function sealed<T extends new (...args: any[]) => any>(constructor: T): void {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

function loggedMethod<T, A extends any[], R>(
  _target: unknown,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<(...args: A) => R>
): TypedPropertyDescriptor<(...args: A) => R> {
  const originalMethod = descriptor.value;
  if (originalMethod) {
    descriptor.value = function (this: T, ...args: A): R {
      console.debug(`[Invoke] ${propertyKey} with:`, args);
      return originalMethod.apply(this, args);
    };
  }
  return descriptor;
}

// --- Generic Theme Manager Class ---
@sealed
export class NeonThemeEngine<TContext extends Record<string, unknown>> {
  private readonly _tokens: Map<string, IHighlightToken> = new Map();
  private _state: TContext;

  public constructor(initialContext: TContext) {
    this._state = { ...initialContext };
    this.registerDefaultTokens();
  }

  public get context(): ObsidianNeon.DeepReadonly<TContext> {
    return this._state as ObsidianNeon.DeepReadonly<TContext>;
  }

  private registerDefaultTokens(): void {
    const defaultTokens: IHighlightToken[] = [
      {
        id: 'tok_001',
        category: SyntaxCategory.Keyword,
        scope: ['keyword.control', 'storage.type'],
        foreground: '#FF79C6',
        fontStyle: 'italic',
      },
      {
        id: 'tok_002',
        category: SyntaxCategory.Function,
        scope: ['entity.name.function', 'support.function'],
        foreground: '#50FA7B',
        fontStyle: 'bold',
      },
      {
        id: 'tok_003',
        category: SyntaxCategory.ClassType,
        scope: ['entity.name.type.class', 'support.type'],
        foreground: '#8BE9FD',
      },
    ];

    defaultTokens.forEach((token) => this._tokens.set(token.id, token));
  }

  /**
   * Type guard to check if an unknown payload is a valid highlight token.
   */
  public static isHighlightToken(item: unknown): item is IHighlightToken {
    return (
      typeof item === 'object' &&
      item !== null &&
      'id' in item &&
      'category' in item &&
      'foreground' in item
    );
  }

  @loggedMethod
  public async compileAsync(element: CodeElement): Promise<ObsidianNeon.Result<string>> {
    try {
      let output: string;

      switch (element.kind) {
        case 'variable':
          output = `${element.isConst ? 'const' : 'let'} ${element.identifier}: ${element.typeAnnotation};`;
          break;
        case 'function': {
          const params = element.parameters.map((p) => `${p.name}: ${p.type}`).join(', ');
          output = `function ${element.name}(${params}): ${element.returns} { /* Neon Glow */ }`;
          break;
        }
        case 'class':
          output = `class ${element.className} implements ${element.implementsList.join(', ')} {}`;
          break;
        default: {
          const _exhaustiveCheck: never = element;
          throw new Error(`Unhandled element kind: ${_exhaustiveCheck}`);
        }
      }

      return { success: true, data: output };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err : new Error(String(err)),
      };
    }
  }
}

// --- Pipeline Sample Usage ---
export async function runShowcaseDemo(): Promise<void> {
  const engine = new NeonThemeEngine<{ activeVariant: string }>({
    activeVariant: 'Dracula Syntax',
  });

  const sampleFn: CodeElement = {
    kind: 'function',
    name: 'renderGlowBuffer',
    parameters: [
      { name: 'canvasId', type: 'string' },
      { name: 'opacity', type: 'number' },
    ],
    returns: 'Promise<boolean>',
  };

  const compilation = await engine.compileAsync(sampleFn);
  if (compilation.success) {
    console.info(`Compiled AST Output: ${compilation.data}`);
  } else {
    console.error(`Compilation Failed: ${compilation.error.message}`);
  }
}
