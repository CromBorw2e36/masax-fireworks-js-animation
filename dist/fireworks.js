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
function absFloor(t) { return Math.abs(Math.floor(t)) }
function randomFloat(t, e) { return Math.random() * (e - t) + t }
function randomInt(t, e) { return Math.floor(randomFloat(t, e + 1)) }
function calculateDistance(t, e, i, s) { let n = Math.pow; return Math.sqrt(n(t - i, 2) + n(e - s, 2)) }
function hsla(t, e, i = 1) {
    if (t > 360 || t < 0) throw Error(`Expected hue 0-360 range, got \`${t}\``);
    if (e > 100 || e < 0) throw Error(`Expected lightness 0-100 range, got \`${e}\``);
    if (i > 1 || i < 0) throw Error(`Expected alpha 0-1 range, got \`${i}\``);
    return `hsla(${t}, 100%, ${e}%, ${i})`
}
let isObject = t => {
    if ("object" == typeof t && null !== t) {
        if ("function" == typeof Object.getPrototypeOf) {
            let e = Object.getPrototypeOf(t);
            return e === Object.prototype || null === e
        }
        return "[object Object]" === Object.prototype.toString.call(t)
    }
    return !1
}
let protectedKeys = ["__proto__", "constructor", "prototype"];
let deepMerge = (...t) => t.reduce((t, e) => (Object.keys(e).forEach(i => {
    protectedKeys.includes(i) || (Array.isArray(t[i]) && Array.isArray(e[i]) ? t[i] = e[i] : isObject(t[i]) && isObject(e[i]) ? t[i] = deepMerge(t[i], e[i]) : t[i] = e[i])
}), t), {});

// Classes
class Explosion {
    constructor({ x: t, y: e, ctx: i, hue: s, decay: n, gravity: a, friction: h, brightness: c, flickering: u, lineWidth: l, explosionLength: p }) {
        for (this.x = t, this.y = e, this.ctx = i, this.hue = s, this.gravity = a, this.friction = h, this.flickering = u, this.lineWidth = l, this.explosionLength = p, this.angle = randomFloat(0, 2 * Math.PI), this.speed = randomInt(1, 10), this.brightness = randomInt(c.min, c.max), this.decay = randomFloat(n.min, n.max); this.explosionLength--;) this.coordinates.push([t, e])
    }
    x; y; ctx; hue; friction; gravity; flickering; lineWidth; explosionLength; angle; speed; brightness; coordinates = []; decay; alpha = 1;
    update(t) {
        this.coordinates.pop(), this.coordinates.unshift([this.x, this.y]), this.speed *= this.friction, this.x += Math.cos(this.angle) * this.speed, this.y += Math.sin(this.angle) * this.speed + this.gravity, this.alpha -= this.decay, this.alpha <= this.decay && t()
    }
    draw() {
        let t = this.coordinates.length - 1;
        this.ctx.beginPath(), this.ctx.lineWidth = this.lineWidth, this.ctx.fillStyle = hsla(this.hue, this.brightness, this.alpha), this.ctx.moveTo(this.coordinates[t][0], this.coordinates[t][1]), this.ctx.lineTo(this.x, this.y), this.ctx.strokeStyle = hsla(this.hue, this.flickering ? randomFloat(0, this.brightness) : this.brightness, this.alpha), this.ctx.stroke()
    }
}

class Mouse {
    constructor(t, e) {
        this.options = t, this.canvas = e, this.pointerDown = this.pointerDown.bind(this), this.pointerUp = this.pointerUp.bind(this), this.pointerMove = this.pointerMove.bind(this)
    }
    active = !1; x; y;
    get mouseOptions() { return this.options.mouse }
    mount() {
        this.canvas.addEventListener("pointerdown", this.pointerDown), this.canvas.addEventListener("pointerup", this.pointerUp), this.canvas.addEventListener("pointermove", this.pointerMove)
    }
    unmount() {
        this.canvas.removeEventListener("pointerdown", this.pointerDown), this.canvas.removeEventListener("pointerup", this.pointerUp), this.canvas.removeEventListener("pointermove", this.pointerMove)
    }
    usePointer(t, e) {
        let { click: i, move: s } = this.mouseOptions;
        (i || s) && (this.x = t.pageX - this.canvas.offsetLeft, this.y = t.pageY - this.canvas.offsetTop, this.active = e)
    }
    pointerDown(t) { this.usePointer(t, this.mouseOptions.click) }
    pointerUp(t) { this.usePointer(t, !1) }
    pointerMove(t) { this.usePointer(t, this.active) }
}

class Options {
    constructor() {
        this.autoresize = !0, this.lineStyle = "round", this.flickering = 50, this.traceLength = 3, this.traceSpeed = 10, this.intensity = 30, this.explosion = 5, this.gravity = 1.5, this.opacity = .5, this.particles = 50, this.friction = .95, this.acceleration = 1.05, this.hue = { min: 0, max: 360 }, this.rocketsPoint = { min: 50, max: 50 }, this.lineWidth = { explosion: { min: 1, max: 3 }, trace: { min: 1, max: 2 } }, this.mouse = { click: !1, move: !1, max: 1 }, this.delay = { min: 30, max: 60 }, this.brightness = { min: 50, max: 80 }, this.decay = { min: .015, max: .03 }, this.sound = { enabled: !1, files: ["explosion0.mp3", "explosion1.mp3", "explosion2.mp3"], volume: { min: 4, max: 8 } }, this.boundaries = { debug: !1, height: 0, width: 0, x: 50, y: 50 }
    }
    hue; rocketsPoint; opacity; acceleration; friction; gravity; particles; explosion; mouse; boundaries; sound; delay; brightness; decay; flickering; intensity; traceLength; traceSpeed; lineWidth; lineStyle; autoresize;
    update(t) { Object.assign(this, deepMerge(this, t)) }
}

class Raf {
    constructor(t, e) { this.options = t, this.render = e }
    tick = 0; rafId = 0; fps = 60; tolerance = .1; now;
    mount() {
        this.now = performance.now();
        let t = 1e3 / this.fps,
            e = i => {
                this.rafId = requestAnimationFrame(e);
                let s = i - this.now;
                s >= t - this.tolerance && (this.render(), this.now = i - s % t, this.tick += s * (this.options.intensity * Math.PI) / 1e3)
            };
        this.rafId = requestAnimationFrame(e)
    }
    unmount() { cancelAnimationFrame(this.rafId) }
}

class Resize {
    constructor(t, e, i) { this.options = t, this.updateSize = e, this.container = i }
    resizer;
    mount() {
        if (!this.resizer) {
            var t;
            let e, i = (t = () => this.updateSize(), (...i) => { e && clearTimeout(e), e = setTimeout(() => t(...i), 100) });
            this.resizer = new ResizeObserver(i)
        }
        this.options.autoresize && this.resizer.observe(this.container)
    }
    unmount() { this.resizer && this.resizer.unobserve(this.container) }
}

class Sound {
    constructor(t) { this.options = t, this.init() }
    buffers = []; audioContext; onInit = !1;
    get isEnabled() { return this.options.sound.enabled }
    get soundOptions() { return this.options.sound }
    init() { !this.onInit && this.isEnabled && (this.onInit = !0, this.audioContext = new(window.AudioContext || window.webkitAudioContext), this.loadSounds()) }
    async loadSounds() {
        for (let t of this.soundOptions.files) {
            let e = await (await fetch(t)).arrayBuffer();
            this.audioContext.decodeAudioData(e).then(t => { this.buffers.push(t) }).catch(t => { throw t })
        }
    }
    play() {
        if (this.isEnabled && this.buffers.length) {
            let t = this.audioContext.createBufferSource(),
                e = this.buffers[randomInt(0, this.buffers.length - 1)],
                i = this.audioContext.createGain();
            t.buffer = e, i.gain.value = randomFloat(this.soundOptions.volume.min / 100, this.soundOptions.volume.max / 100), i.connect(this.audioContext.destination), t.connect(i), t.start(0)
        } else this.init()
    }
}

class Trace {
    constructor({ x: t, y: e, dx: i, dy: s, ctx: n, hue: r, speed: h, traceLength: c, acceleration: u }) {
        for (this.x = t, this.y = e, this.sx = t, this.sy = e, this.dx = i, this.dy = s, this.ctx = n, this.hue = r, this.speed = h, this.traceLength = c, this.acceleration = u, this.totalDistance = calculateDistance(t, e, i, s), this.angle = Math.atan2(s - e, i - t), this.brightness = randomInt(50, 70); this.traceLength--;) this.coordinates.push([t, e])
    }
    x; y; sx; sy; dx; dy; ctx; hue; speed; acceleration; traceLength; totalDistance; angle; brightness; coordinates = []; currentDistance = 0;
    update(t) {
        this.coordinates.pop(), this.coordinates.unshift([this.x, this.y]), this.speed *= this.acceleration;
        let e = Math.cos(this.angle) * this.speed,
            i = Math.sin(this.angle) * this.speed;
        this.currentDistance = calculateDistance(this.sx, this.sy, this.x + e, this.y + i), this.currentDistance >= this.totalDistance ? t(this.dx, this.dy, this.hue) : (this.x += e, this.y += i)
    }
    draw() {
        let t = this.coordinates.length - 1;
        this.ctx.beginPath(), this.ctx.moveTo(this.coordinates[t][0], this.coordinates[t][1]), this.ctx.lineTo(this.x, this.y), this.ctx.strokeStyle = hsla(this.hue, this.brightness), this.ctx.stroke()
    }
}

class Fireworks {
    constructor(t, e = {}) {
        this.target = t, this.container = t, this.opts = new Options, this.createCanvas(this.target), this.updateOptions(e), this.sound = new Sound(this.opts), this.resize = new Resize(this.opts, this.updateSize.bind(this), this.container), this.mouse = new Mouse(this.opts, this.canvas), this.raf = new Raf(this.opts, this.render.bind(this))
    }
    target; container; canvas; ctx; width; height; traces = []; explosions = []; waitStopRaf; running = !1; opts; sound; resize; mouse; raf;
    get isRunning() { return this.running }
    get version() { return "2.10.8" }
    get currentOptions() { return this.opts }
    start() { this.running || (this.canvas.isConnected || this.createCanvas(this.target), this.running = !0, this.resize.mount(), this.mouse.mount(), this.raf.mount()) }
    stop(t = !1) { this.running && (this.running = !1, this.resize.unmount(), this.mouse.unmount(), this.raf.unmount(), this.clear(), t && this.canvas.remove()) }
    async waitStop(t) {
        if (this.running) return new Promise(e => {
            this.waitStopRaf = () => { this.waitStopRaf && (requestAnimationFrame(this.waitStopRaf), this.traces.length || this.explosions.length || (this.waitStopRaf = null, this.stop(t), e())) }, this.waitStopRaf()
        })
    }
    pause() { this.running = !this.running, this.running ? this.raf.mount() : this.raf.unmount() }
    clear() { this.ctx && (this.traces = [], this.explosions = [], this.ctx.clearRect(0, 0, this.width, this.height)) }
    launch(t = 1) {
        for (let e = 0; e < t; e++) this.createTrace();
        this.waitStopRaf || (this.start(), this.waitStop())
    }
    updateOptions(t) { this.opts.update(t) }
    updateSize({ width: t = this.container.clientWidth, height: e = this.container.clientHeight } = {}) { this.width = t, this.height = e, this.canvas.width = t, this.canvas.height = e, this.updateBoundaries({ ...this.opts.boundaries, width: t, height: e }) }
    updateBoundaries(t) { this.updateOptions({ boundaries: t }) }
    createCanvas(t) { t instanceof HTMLCanvasElement ? (t.isConnected || document.body.append(t), this.canvas = t) : (this.canvas = document.createElement("canvas"), this.container.append(this.canvas)), this.ctx = this.canvas.getContext("2d"), this.updateSize() }
    render() {
        if (!this.ctx || !this.running) return;
        let { opacity: t, lineStyle: e, lineWidth: i } = this.opts;
        this.ctx.globalCompositeOperation = "destination-out", this.ctx.fillStyle = `rgba(0, 0, 0, ${t})`, this.ctx.fillRect(0, 0, this.width, this.height), this.ctx.globalCompositeOperation = "lighter", this.ctx.lineCap = e, this.ctx.lineJoin = "round", this.ctx.lineWidth = randomFloat(i.trace.min, i.trace.max), this.initTrace(), this.drawTrace(), this.drawExplosion()
    }
    createTrace() {
        let { hue: t, rocketsPoint: e, boundaries: i, traceLength: s, traceSpeed: r, acceleration: a, mouse: h } = this.opts;
        this.traces.push(new Trace({ x: this.width * randomInt(e.min, e.max) / 100, y: this.height, dx: this.mouse.x && h.move || this.mouse.active ? this.mouse.x : randomInt(i.x, i.width - 2 * i.x), dy: this.mouse.y && h.move || this.mouse.active ? this.mouse.y : randomInt(i.y, .5 * i.height), ctx: this.ctx, hue: randomInt(t.min, t.max), speed: r, acceleration: a, traceLength: absFloor(s) }))
    }
    initTrace() {
        if (this.waitStopRaf) return;
        let { delay: t, mouse: e } = this.opts;
        (this.raf.tick > randomInt(t.min, t.max) || this.mouse.active && e.max > this.traces.length) && (this.createTrace(), this.raf.tick = 0)
    }
    drawTrace() {
        let t = this.traces.length;
        for (; t--;) this.traces[t].draw(), this.traces[t].update((e, i, s) => { this.initExplosion(e, i, s), this.sound.play(), this.traces.splice(t, 1) })
    }
    initExplosion(t, e, i) {
        let { particles: s, flickering: a, lineWidth: h, explosion: c, brightness: u, friction: l, gravity: d, decay: f } = this.opts, m = absFloor(s);
        for (; m--;) this.explosions.push(new Explosion({ x: t, y: e, ctx: this.ctx, hue: i, friction: l, gravity: d, flickering: randomInt(0, 100) <= a, lineWidth: randomFloat(h.explosion.min, h.explosion.max), explosionLength: absFloor(c), brightness: u, decay: f }))
    }
    drawExplosion() {
        let t = this.explosions.length;
        for (; t--;) this.explosions[t].draw(), this.explosions[t].update(() => { this.explosions.splice(t, 1) })
    }
}

    return Fireworks;
}));
