/**
 * =============================================================================
 * Obsidian Neon (Dracula Syntax) - JavaScript (ES2024) Showcase
 * =============================================================================
 * Demonstrates:
 *   - Cursive JSDoc and single/multi-line comments
 *   - Classes, Private fields (#), Static initialization blocks
 *   - Async/Await, Generators, Closures & Event Loop Promises
 *   - Destructuring, Optional Chaining (?.), Nullish Coalescing (??)
 *   - Regex literals, Template Strings, Symbols & Proxies
 */

import { EventEmitter } from 'node:events';

// --- Constants & Config ---
export const THEME_NAME = 'Obsidian Neon';
export const DRACULA_PALETTE = Object.freeze({
  background: '#191525',
  pink: '#FF79C6',
  purple: '#BD93F9',
  green: '#50FA7B',
  cyan: '#8BE9FD',
  yellow: '#F1FA8C',
  orange: '#FFB86C',
});

const EMAIL_VALIDATION_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,8}$/gi;
const BITWISE_FLAGS = (1 << 0) | (1 << 2) | (1 << 5); // 0b100101

/**
 * Creates a reactive proxy around state objects.
 * @template T
 * @param {T} target
 * @param {(prop: string, val: any) => void} onChange
 * @returns {T}
 */
export function createReactiveState(target, onChange) {
  return new Proxy(target, {
    set(obj, prop, value) {
      const oldValue = obj[prop];
      const result = Reflect.set(obj, prop, value);
      if (oldValue !== value && typeof onChange === 'function') {
        onChange(String(prop), value);
      }
      return result;
    },
  });
}

/**
 * Service managing telemetry glow effects and theme tokens.
 */
export class NeonGlowController extends EventEmitter {
  #internalCounter = 0;
  #isActive = false;
  #cache = new Map();

  static #MAX_INSTANCES = 50;
  static defaultRadius = 16.5;

  static {
    // Static initialization block
    console.debug(`[Init] NeonGlowController registered. Max instances: ${this.#MAX_INSTANCES}`);
  }

  /**
   * @param {string} [name='Dracula Syntax']
   * @param {number} [intensity=0.85]
   */
  constructor(name = 'Dracula Syntax', intensity = 0.85) {
    super();obsidian
    this.name = name;
    this.intensity = Number(intensity) || 1.0;
    this.#isActive = true;
  }

  get stateSummary() {
    return `[${this.name}] Active: ${this.#isActive} | Intensity: ${this.intensity.toFixed(2)}`;
  }

  /**
   * Async generator yielding interpolated neon pulses.
   * @param {number} totalSteps
   * @yields {{ step: number, color: string, timestamp: number }}
   */
  async *pulseGenerator(totalSteps = 5) {
    const colors = [DRACULA_PALETTE.pink, DRACULA_PALETTE.green, DRACULA_PALETTE.cyan];

    for (let step = 1; step <= totalSteps; step++) {
      this.#internalCounter++;
      const activeColor = colors[step % colors.length] ?? DRACULA_PALETTE.purple;

      await new Promise((resolve) => setTimeout(resolve, 50));

      yield {
        step,
        color: activeColor,
        timestamp: Date.now(),
        glowMetrics: {
          radius: NeonGlowController.defaultRadius * step,
          isValid: EMAIL_VALIDATION_REGEX.test('glow@obsidian-neon.dev'),
        },
      };
    }
  }

  /**
   * Dispatches events with optional chaining and nullish coalescing.
   * @param {object} [options]
   */
  triggerRender(options = {}) {
    const optionsTheme = options?.theme?.name ?? THEME_NAME;
    const isNeon = Boolean(options?.features?.glow ?? true);

    const telemetryPayload = {
      id: Symbol('neon.event.id'),
      timestamp: new Date().toISOString(),
      activeTheme: optionsTheme,
      flags: BITWISE_FLAGS,
      enabled: isNeon,
    };

    this.emit('rendered', telemetryPayload);
    return telemetryPayload;
  }
}

// --- Execution Demonstration ---
(async () => {
  const controller = new NeonGlowController('Obsidian Neon Engine', 0.95);

  controller.on('rendered', (data) => {
    console.log(`Render event dispatched: ${JSON.stringify(data, null, 2)}`);
  });

  const config = { theme: { name: 'Dracula Syntax' }, features: { glow: true } };
  controller.triggerRender(config);

  for await (const pulse of controller.pulseGenerator(3)) {
    console.log(`Pulse #${pulse.step} with color: ${pulse.color}`);
  }
})();
