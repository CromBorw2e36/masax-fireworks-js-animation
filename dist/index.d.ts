export class Fireworks {
    constructor(target: HTMLElement | HTMLCanvasElement, options?: FireworksOptions);
    
    get isRunning(): boolean;
    get version(): string;
    get currentOptions(): FireworksOptions;
    
    start(): void;
    stop(removeCanvas?: boolean): void;
    waitStop(removeCanvas?: boolean): Promise<void>;
    pause(): void;
    clear(): void;
    launch(count?: number): void;
    updateOptions(options: FireworksOptions): void;
    updateSize(size?: { width?: number; height?: number }): void;
    updateBoundaries(boundaries: BoundaryOptions): void;
}

export interface FireworksOptions {
    autoresize?: boolean;
    lineStyle?: "round" | "square" | "butt";
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
    hue?: { min: number; max: number };
    rocketsPoint?: { min: number; max: number };
    lineWidth?: { explosion: { min: number; max: number }; trace: { min: number; max: number } };
    mouse?: { click?: boolean; move?: boolean; max?: number };
    delay?: { min: number; max: number };
    brightness?: { min: number; max: number };
    decay?: { min: number; max: number };
    sound?: { enabled?: boolean; files?: string[]; volume?: { min: number; max: number } };
    boundaries?: BoundaryOptions;
}

export interface BoundaryOptions {
    debug?: boolean;
    height?: number;
    width?: number;
    x?: number;
    y?: number;
}
