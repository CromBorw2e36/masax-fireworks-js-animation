declare module 'masax-fireworks-js-animation' {
  export interface MinMax {
    min: number;
    max: number;
  }

  export interface MouseOptions {
    click?: boolean;
    move?: boolean;
    max?: number;
  }

  export interface SoundOptions {
    enabled?: boolean;
    files?: string[];
    volume?: MinMax;
  }

  export interface LineWidthOptions {
    explosion?: MinMax;
    trace?: MinMax;
  }

  export interface BoundaryOptions {
    debug?: boolean;
    height?: number;
    width?: number;
    x?: number;
    y?: number;
  }

  export interface FireworksOptions {
    autoresize?: boolean;
    lineStyle?: 'round' | 'square';
    flickering?: number;
    traceLength?: number;
    traceSpeed?: number;
    intensity?: number;
    explosion?: number;
    gravity?: number;
    opacity?: number;
    particles?: number;
    friction?: number;
    acceleration?: number;
    hue?: MinMax;
    rocketsPoint?: MinMax;
    lineWidth?: LineWidthOptions;
    mouse?: MouseOptions;
    delay?: MinMax;
    brightness?: MinMax;
    decay?: MinMax;
    sound?: SoundOptions;
    boundaries?: BoundaryOptions;
  }

  export class Fireworks {
    constructor(target: Element | string, options?: FireworksOptions);
    
    readonly isRunning: boolean;
    readonly version: string;
    readonly currentOptions: FireworksOptions;

    start(): void;
    stop(remove?: boolean): void;
    waitStop(remove?: boolean): Promise<void>;
    pause(): void;
    clear(): void;
    launch(count?: number): void;
    updateOptions(options: FireworksOptions): void;
    updateSize(size?: { width?: number; height?: number }): void;
    updateBoundaries(boundaries: BoundaryOptions): void;
  }

  export default Fireworks;
}
