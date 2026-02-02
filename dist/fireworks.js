/**
 * Fireworks.js - A lightweight, high-performance 2D fireworks animation library for the web.
 * 
 * Features:
 * - Canvas-based 2D fireworks effects
 * - Multiple explosion types with customizable parameters
 * - Mouse interaction for triggering fireworks
 * - Sound effects for explosions
 * - Automatic canvas resizing and performance optimization
 * - ES6 class-based architecture with modular design
 * 
 * @author Masax
 * @version 1.1.4
 * @license MIT
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.Fireworks = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    "use strict";

    // Utils
    function absFloor(num) {
        return Math.abs(Math.floor(num));
    }

    function randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    function randomInt(min, max) {
        return Math.floor(randomFloat(min, max + 1));
    }

    function calculateDistance(x1, y1, x2, y2) {
        let pow = Math.pow;
        return Math.sqrt(pow(x1 - x2, 2) + pow(y1 - y2, 2));
    }

    function hsla(hue, lightness, alpha = 1) {
        if (hue > 360 || hue < 0) throw Error(`Expected hue 0-360 range, got \`${hue}\``);
        if (lightness > 100 || lightness < 0) throw Error(`Expected lightness 0-100 range, got \`${lightness}\``);
        if (alpha > 1 || alpha < 0) throw Error(`Expected alpha 0-1 range, got \`${alpha}\``);
        return `hsla(${hue}, 100%, ${lightness}%, ${alpha})`;
    }

    let isObject = (item) => {
        if ("object" == typeof item && null !== item) {
            if ("function" == typeof Object.getPrototypeOf) {
                let proto = Object.getPrototypeOf(item);
                return proto === Object.prototype || null === proto;
            }
            return "[object Object]" === Object.prototype.toString.call(item);
        }
        return false;
    };

    let protectedKeys = ["__proto__", "constructor", "prototype"];
    let deepMerge = (...objects) => objects.reduce((acc, obj) => (Object.keys(obj).forEach(key => {
        protectedKeys.includes(key) || (Array.isArray(acc[key]) && Array.isArray(obj[key]) ? acc[key] = obj[key] : isObject(acc[key]) && isObject(obj[key]) ? acc[key] = deepMerge(acc[key], obj[key]) : acc[key] = obj[key])
    }), acc), {});

    // Classes
    class Explosion {
        constructor({ x, y, ctx, hue, decay, gravity, friction, brightness, flickering, lineWidth, explosionLength }) {
            this.x = x;
            this.y = y;
            this.ctx = ctx;
            this.hue = hue;
            this.gravity = gravity;
            this.friction = friction;
            this.flickering = flickering;
            this.lineWidth = lineWidth;
            this.explosionLength = explosionLength;
            this.angle = randomFloat(0, 2 * Math.PI);
            this.speed = randomInt(1, 10);
            this.brightness = randomInt(brightness.min, brightness.max);
            this.decay = randomFloat(decay.min, decay.max);
            this.coordinates = [];
            this.alpha = 1;
            while (this.explosionLength--) {
                this.coordinates.push([x, y]);
            }
        }
        
        update(callback) {
            this.coordinates.pop();
            this.coordinates.unshift([this.x, this.y]);
            this.speed *= this.friction;
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed + this.gravity;
            this.alpha -= this.decay;
            if (this.alpha <= this.decay) {
                callback();
            }
        }

        draw() {
            let lastIndex = this.coordinates.length - 1;
            this.ctx.beginPath();
            this.ctx.lineWidth = this.lineWidth;
            this.ctx.fillStyle = hsla(this.hue, this.brightness, this.alpha);
            this.ctx.moveTo(this.coordinates[lastIndex][0], this.coordinates[lastIndex][1]);
            this.ctx.lineTo(this.x, this.y);
            this.ctx.strokeStyle = hsla(this.hue, this.flickering ? randomFloat(0, this.brightness) : this.brightness, this.alpha);
            this.ctx.stroke();
        }
    }

    class Mouse {
        constructor(options, canvas) {
            this.options = options;
            this.canvas = canvas;
            this.pointerDown = this.pointerDown.bind(this);
            this.pointerUp = this.pointerUp.bind(this);
            this.pointerMove = this.pointerMove.bind(this);
        }
        active = false;
        x;
        y;
        get mouseOptions() {
            return this.options.mouse;
        }
        mount() {
            this.canvas.addEventListener("pointerdown", this.pointerDown);
            this.canvas.addEventListener("pointerup", this.pointerUp);
            this.canvas.addEventListener("pointermove", this.pointerMove);
        }
        unmount() {
            this.canvas.removeEventListener("pointerdown", this.pointerDown);
            this.canvas.removeEventListener("pointerup", this.pointerUp);
            this.canvas.removeEventListener("pointermove", this.pointerMove);
        }
        usePointer(event, active) {
            let { click, move } = this.mouseOptions;
            if (click || move) {
                this.x = event.pageX - this.canvas.offsetLeft;
                this.y = event.pageY - this.canvas.offsetTop;
                this.active = active;
            }
        }
        pointerDown(event) {
            this.usePointer(event, this.mouseOptions.click);
        }
        pointerUp(event) {
            this.usePointer(event, false);
        }
        pointerMove(event) {
            this.usePointer(event, this.active);
        }
    }

    class Options {
        constructor() {
            this.autoresize = true;
            this.lineStyle = "round";
            this.flickering = 50;
            this.traceLength = 3;
            this.traceSpeed = 10;
            this.intensity = 30;
            this.explosion = 5;
            this.gravity = 1.5;
            this.opacity = 0.5;
            this.particles = 50;
            this.friction = 0.95;
            this.acceleration = 1.05;
            this.hue = { min: 0, max: 360 };
            this.rocketsPoint = { min: 50, max: 50 };
            this.lineWidth = { explosion: { min: 1, max: 3 }, trace: { min: 1, max: 2 } };
            this.mouse = { click: false, move: false, max: 1 };
            this.delay = { min: 30, max: 60 };
            this.brightness = { min: 50, max: 80 };
            this.decay = { min: 0.015, max: 0.03 };
            this.sound = { enabled: false, files: ["explosion0.mp3", "explosion1.mp3", "explosion2.mp3"], volume: { min: 4, max: 8 } };
            this.boundaries = { debug: false, height: 0, width: 0, x: 50, y: 50 };
        }
        
        update(options) {
            Object.assign(this, deepMerge(this, options));
        }
    }

    class Raf {
        constructor(options, renderCallback) {
            this.options = options;
            this.render = renderCallback;
        }
        tick = 0;
        rafId = 0;
        fps = 60;
        tolerance = 0.1;
        now;
        
        mount() {
            this.now = performance.now();
            let interval = 1000 / this.fps;
            let loop = (timestamp) => {
                this.rafId = requestAnimationFrame(loop);
                let delta = timestamp - this.now;
                if (delta >= interval - this.tolerance) {
                    this.render();
                    this.now = timestamp - delta % interval;
                    this.tick += delta * (this.options.intensity * Math.PI) / 1000;
                }
            };
            this.rafId = requestAnimationFrame(loop);
        }
        
        unmount() {
            cancelAnimationFrame(this.rafId);
        }
    }

    class Resize {
        constructor(options, updateSizeCallback, container) {
            this.options = options;
            this.updateSize = updateSizeCallback;
            this.container = container;
        }
        resizer;
        
        mount() {
            if (!this.resizer) {
                let timer;
                const debouncedResize = (...args) => {
                    timer && clearTimeout(timer);
                    timer = setTimeout(() => this.updateSize(...args), 100);
                };
                this.resizer = new ResizeObserver(debouncedResize);
            }
            if (this.options.autoresize) {
                this.resizer.observe(this.container);
            }
        }
        
        unmount() {
            if (this.resizer) {
                this.resizer.unobserve(this.container);
            }
        }
    }

    class Sound {
        constructor(options) {
            this.options = options;
            this.init();
        }
        buffers = [];
        audioContext;
        onInit = false;
        
        get isEnabled() {
            return this.options.sound.enabled;
        }
        get soundOptions() {
            return this.options.sound;
        }
        
        init() {
            if (!this.onInit && this.isEnabled) {
                this.onInit = true;
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.loadSounds();
            }
        }
        
        async loadSounds() {
            for (let file of this.soundOptions.files) {
                try {
                    let response = await fetch(file);
                    let arrayBuffer = await response.arrayBuffer();
                    let decodedBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
                    this.buffers.push(decodedBuffer);
                } catch (error) {
                    console.error("Failed to load sound:", file, error);
                }
            }
        }
        
        play() {
            if (this.isEnabled && this.buffers.length) {
                let source = this.audioContext.createBufferSource();
                let buffer = this.buffers[randomInt(0, this.buffers.length - 1)];
                let gainNode = this.audioContext.createGain();
                
                source.buffer = buffer;
                gainNode.gain.value = randomFloat(this.soundOptions.volume.min / 100, this.soundOptions.volume.max / 100);
                
                gainNode.connect(this.audioContext.destination);
                source.connect(gainNode);
                source.start(0);
            } else {
                this.init();
            }
        }
    }

    class Trace {
        constructor({ x, y, dx, dy, ctx, hue, speed, traceLength, acceleration }) {
            this.x = x;
            this.y = y;
            this.sx = x;
            this.sy = y;
            this.dx = dx;
            this.dy = dy;
            this.ctx = ctx;
            this.hue = hue;
            this.speed = speed;
            this.traceLength = traceLength;
            this.acceleration = acceleration;
            this.totalDistance = calculateDistance(x, y, dx, dy);
            this.angle = Math.atan2(dy - y, dx - x);
            this.brightness = randomInt(50, 70);
            this.coordinates = [];
            this.currentDistance = 0;
            while (this.traceLength--) {
                this.coordinates.push([x, y]);
            }
        }
        
        update(callback) {
            this.coordinates.pop();
            this.coordinates.unshift([this.x, this.y]);
            this.speed *= this.acceleration;
            let vx = Math.cos(this.angle) * this.speed;
            let vy = Math.sin(this.angle) * this.speed;
            
            this.currentDistance = calculateDistance(this.sx, this.sy, this.x + vx, this.y + vy);
            
            if (this.currentDistance >= this.totalDistance) {
                callback(this.dx, this.dy, this.hue);
            } else {
                this.x += vx;
                this.y += vy;
            }
        }
        
        draw() {
            let lastIndex = this.coordinates.length - 1;
            this.ctx.beginPath();
            this.ctx.moveTo(this.coordinates[lastIndex][0], this.coordinates[lastIndex][1]);
            this.ctx.lineTo(this.x, this.y);
            this.ctx.strokeStyle = hsla(this.hue, this.brightness);
            this.ctx.stroke();
        }
    }

    class Fireworks {
        constructor(target, options = {}) {
            this.target = target;
            this.container = target;
            this.opts = new Options();
            this.createCanvas(this.target);
            this.updateOptions(options);
            this.sound = new Sound(this.opts);
            this.resize = new Resize(this.opts, this.updateSize.bind(this), this.container);
            this.mouse = new Mouse(this.opts, this.canvas);
            this.raf = new Raf(this.opts, this.render.bind(this));
        }
        
        traces = [];
        explosions = [];
        waitStopRaf;
        running = false;
        
        get isRunning() {
            return this.running;
        }
        
        get version() {
            return "1.1.4";
        }
        
        get currentOptions() {
            return this.opts;
        }
        
        start() {
            if (!this.running) {
                if (!this.canvas.isConnected) {
                    this.createCanvas(this.target);
                }
                this.running = true;
                this.resize.mount();
                this.mouse.mount();
                this.raf.mount();
            }
        }
        
        stop(removeCanvas = false) {
            if (this.running) {
                this.running = false;
                this.resize.unmount();
                this.mouse.unmount();
                this.raf.unmount();
                this.clear();
                if (removeCanvas) {
                    this.canvas.remove();
                }
            }
        }
        
        async waitStop(removeCanvas) {
            if (this.running) {
                return new Promise(resolve => {
                    this.waitStopRaf = () => {
                        if (this.waitStopRaf) {
                            requestAnimationFrame(this.waitStopRaf);
                            if (!this.traces.length && !this.explosions.length) {
                                this.waitStopRaf = null;
                                this.stop(removeCanvas);
                                resolve();
                            }
                        }
                    };
                    this.waitStopRaf();
                });
            }
        }
        
        pause() {
            this.running = !this.running;
            if (this.running) {
                this.raf.mount();
            } else {
                this.raf.unmount();
            }
        }
        
        clear() {
            if (this.ctx) {
                this.traces = [];
                this.explosions = [];
                this.ctx.clearRect(0, 0, this.width, this.height);
            }
        }
        
        launch(count = 1) {
            for (let i = 0; i < count; i++) {
                this.createTrace();
            }
            if (!this.waitStopRaf) {
                this.start();
                this.waitStop();
            }
        }
        
        updateOptions(options) {
            this.opts.update(options);
        }
        
        updateSize({ width = this.container.clientWidth, height = this.container.clientHeight } = {}) {
            this.width = width;
            this.height = height;
            this.canvas.width = width;
            this.canvas.height = height;
            this.updateBoundaries({ ...this.opts.boundaries, width, height });
        }
        
        updateBoundaries(boundaryOptions) {
            this.updateOptions({ boundaries: boundaryOptions });
        }
        
        createCanvas(el) {
            if (el instanceof HTMLCanvasElement) {
                if (!el.isConnected) {
                    document.body.append(el);
                }
                this.canvas = el;
            } else {
                this.canvas = document.createElement("canvas");
                this.container.append(this.canvas);
            }
            this.ctx = this.canvas.getContext("2d");
            this.updateSize();
        }
        
        render() {
            if (!this.ctx || !this.running) return;
            
            let { opacity, lineStyle, lineWidth } = this.opts;
            
            this.ctx.globalCompositeOperation = "destination-out";
            this.ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
            this.ctx.fillRect(0, 0, this.width, this.height);
            
            this.ctx.globalCompositeOperation = "lighter";
            this.ctx.lineCap = lineStyle;
            this.ctx.lineJoin = "round";
            this.ctx.lineWidth = randomFloat(lineWidth.trace.min, lineWidth.trace.max);
            
            this.initTrace();
            this.drawTrace();
            this.drawExplosion();
        }
        
        createTrace() {
            let { hue, rocketsPoint, boundaries, traceLength, traceSpeed, acceleration, mouse } = this.opts;
            
            this.traces.push(new Trace({
                x: this.width * randomInt(rocketsPoint.min, rocketsPoint.max) / 100,
                y: this.height,
                dx: (this.mouse.x && mouse.move) || this.mouse.active ? this.mouse.x : randomInt(boundaries.x, boundaries.width - 2 * boundaries.x),
                dy: (this.mouse.y && mouse.move) || this.mouse.active ? this.mouse.y : randomInt(boundaries.y, 0.5 * boundaries.height),
                ctx: this.ctx,
                hue: randomInt(hue.min, hue.max),
                speed: traceSpeed,
                acceleration: acceleration,
                traceLength: absFloor(traceLength)
            }));
        }
        
        initTrace() {
            if (this.waitStopRaf) return;
            
            let { delay, mouse } = this.opts;
            
            if (this.raf.tick > randomInt(delay.min, delay.max) || (this.mouse.active && mouse.max > this.traces.length)) {
                this.createTrace();
                this.raf.tick = 0;
            }
        }
        
        drawTrace() {
            let i = this.traces.length;
            while (i--) {
                this.traces[i].draw();
                this.traces[i].update((x, y, hue) => {
                    this.initExplosion(x, y, hue);
                    this.sound.play();
                    this.traces.splice(i, 1);
                });
            }
        }
        
        initExplosion(x, y, hue) {
            let { particles, flickering, lineWidth, explosion, brightness, friction, gravity, decay } = this.opts;
            let count = absFloor(particles);
            
            while (count--) {
                this.explosions.push(new Explosion({
                    x,
                    y,
                    ctx: this.ctx,
                    hue,
                    friction,
                    gravity,
                    flickering: randomInt(0, 100) <= flickering,
                    lineWidth: randomFloat(lineWidth.explosion.min, lineWidth.explosion.max),
                    explosionLength: absFloor(explosion),
                    brightness,
                    decay
                }));
            }
        }
        
        drawExplosion() {
            let i = this.explosions.length;
            while (i--) {
                this.explosions[i].draw();
                this.explosions[i].update(() => {
                    this.explosions.splice(i, 1);
                });
            }
        }
    }

    return Fireworks;
}));
