# Fireworks JS Animation

[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)](https://www.typescriptlang.org/)
[![npm version](https://img.shields.io/npm/v/masax-fireworks-js-animation.svg?style=flat-square)](https://www.npmjs.com/package/masax-fireworks-js-animation)
[![npm downloads](https://img.shields.io/npm/dt/masax-fireworks-js-animation.svg?style=flat-square)](https://www.npmjs.com/package/masax-fireworks-js-animation)
[![jsDelivr hits](https://img.shields.io/jsdelivr/npm/hm/masax-fireworks-js-animation?style=flat-square)](https://www.jsdelivr.com/package/npm/masax-fireworks-js-animation)
[![minzip size](https://img.shields.io/bundlephobia/minzip/masax-fireworks-js-animation?style=flat-square)](https://bundlephobia.com/package/masax-fireworks-js-animation)
[![install size](https://packagephobia.com/badge?p=masax-fireworks-js-animation&style=flat-square)](https://packagephobia.com/result?p=masax-fireworks-js-animation)
[![GitHub stars](https://img.shields.io/github/stars/CromBorw2e36/masax-fireworks-js-animation?style=flat-square)](https://github.com/CromBorw2e36/masax-fireworks-js-animation/stargazers)

Một thư viện hiệu ứng pháo hoa nhẹ, không phụ thuộc, và dễ dàng tùy biến. Hoạt động mượt mà trên **Vanilla JS**, **React**, **Vue**, **Angular**, v.v.

A lightweight, zero-dependency, and highly customizable fireworks animation library. Works seamlessly with **Vanilla JS**, **React**, **Vue**, **Angular**, and more.

轻量级、零依赖且高度可定制的烟花动画库。完美支持 **Vanilla JS**、**React**、**Vue**、**Angular** 等。

![Screenshot](./media/demo.png)

### [👉 Live Demo / Xem Demo / 在线演示](https://cromborw2e36.github.io/masax-fireworks-js-animation/)

---

## 🌍 Ngôn ngữ / Languages / 语言

- [Tiếng Việt](#tiếng-việt)
- [English](#english)
- [中文 (Chinese)](#中文-chinese)

---

## <a id="tiếng-việt"></a>Tiếng Việt

### Cài đặt

```bash
npm install masax-fireworks-js-animation
```

### Hướng dẫn sử dụng

#### 1. Vanilla JS (HTML thuần)

Dùng thẻ script để nhúng thư viện:

```html
<canvas id="fireworks-canvas"></canvas>
<!-- Ưu tiên dùng phiên bản đã nén cho môi trường production -->
<script src="./dist/fireworks.min.js"></script>

<script>
  const canvas = document.getElementById("fireworks-canvas");
  // Đặt kích thước cho canvas
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Khởi tạo pháo hoa
  const fireworks = new Fireworks(canvas, {
    hue: { min: 0, max: 360 }, // Màu sắc
    particles: 50, // Số lượng hạt nổ
    // ... các tùy chọn khác
  });

  // Bắt đầu bắn
  fireworks.start();
</script>
```

#### 2. React

Sử dụng `useEffect` và `useRef` để khởi tạo pháo hoa khi component được mount.

```jsx
import React, { useEffect, useRef } from "react";
import { Fireworks } from "masax-fireworks-js-animation";

const FireworksComponent = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const fireworks = new Fireworks(canvasRef.current, {
        /* options */
      });
      fireworks.start();
      return () => fireworks.stop(); // Dọn dẹp khi component unmount
    }
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100vh" }} />;
};
export default FireworksComponent;
```

#### 3. Vue 3

```vue
<template>
  <canvas ref="canvasRef" style="width: 100%; height: 100vh;"></canvas>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { Fireworks } from "masax-fireworks-js-animation";

const canvasRef = ref(null);
let fireworks = null;

onMounted(() => {
  if (canvasRef.value) {
    fireworks = new Fireworks(canvasRef.value, {
      /* options */
    });
    fireworks.start();
  }
});

onUnmounted(() => {
  if (fireworks) fireworks.stop();
});
</script>
```

#### 4. TypeScript

```typescript
import { Fireworks } from "masax-fireworks-js-animation";

const container = document.getElementById("fireworks-canvas") as HTMLElement;
const fireworks = new Fireworks(container, {
  particles: 50,
  traceSpeed: 2,
});

fireworks.start();
```

---

## <a id="english"></a>English

### Installation

```bash
npm install masax-fireworks-js-animation
```

### Usage

#### 1. Vanilla JS (HTML)

```html
<canvas id="fireworks-canvas"></canvas>
<!-- Use minified version for production -->
<script src="path/to/dist/fireworks.min.js"></script>

<script>
  const canvas = document.getElementById("fireworks-canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const fireworks = new Fireworks(canvas, {
    /* options */
  });
  fireworks.start();
</script>
```

#### 2. React

```jsx
import React, { useEffect, useRef } from "react";
import { Fireworks } from "masax-fireworks-js-animation";

const FireworksComponent = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const fireworks = new Fireworks(canvasRef.current, {
        hue: { min: 0, max: 360 },
        particles: 50,
        // ... other options
      });
      fireworks.start();

      return () => fireworks.stop(); // Cleanup
    }
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100vh" }} />;
};

export default FireworksComponent;
```

#### 3. Vue 3

```vue
<template>
  <canvas ref="canvasRef" style="width: 100%; height: 100vh;"></canvas>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { Fireworks } from "masax-fireworks-js-animation";

const canvasRef = ref(null);
let fireworks = null;

onMounted(() => {
  if (canvasRef.value) {
    fireworks = new Fireworks(canvasRef.value, {
      /* options */
    });
    fireworks.start();
  }
});

onUnmounted(() => {
  if (fireworks) fireworks.stop();
});
</script>
```

#### 4. TypeScript

```typescript
import { Fireworks } from "masax-fireworks-js-animation";

const container = document.getElementById("fireworks-canvas") as HTMLElement;
const fireworks = new Fireworks(container, {
  particles: 50,
  traceSpeed: 2,
});

fireworks.start();
```

---

## <a id="中文-chinese"></a>中文 (Chinese)

### 安装

```bash
npm install masax-fireworks-js-animation
```

### 使用方法

#### 1. 原生 JS (Vanilla JS)

```html
<canvas id="fireworks-canvas"></canvas>
<script src="./dist/fireworks.min.js"></script>

<script>
  const canvas = document.getElementById("fireworks-canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const fireworks = new Fireworks(canvas, {
    /* 配置项 */
  });
  fireworks.start();
</script>
```

#### 2. React

```jsx
import React, { useEffect, useRef } from "react";
import { Fireworks } from "masax-fireworks-js-animation";

const FireworksComponent = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const fireworks = new Fireworks(canvasRef.current, {
        /* 配置项 */
      });
      fireworks.start();
      return () => fireworks.stop(); // 清理
    }
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100vh" }} />;
};
export default FireworksComponent;
```

#### 3. Vue 3 Setup

```vue
<template>
  <canvas ref="canvasRef" style="width: 100%; height: 100vh;"></canvas>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { Fireworks } from "masax-fireworks-js-animation";

const canvasRef = ref(null);
let fireworks = null;

onMounted(() => {
  if (canvasRef.value) {
    fireworks = new Fireworks(canvasRef.value, {
      /* 配置项 */
    });
    fireworks.start();
  }
});

onUnmounted(() => {
  if (fireworks) fireworks.stop();
});
</script>
```

#### 4. TypeScript

```typescript
import { Fireworks } from "masax-fireworks-js-animation";

const container = document.getElementById("fireworks-canvas") as HTMLElement;
const fireworks = new Fireworks(container, {
  particles: 50,
  traceSpeed: 2,
});

fireworks.start();
```

---

## Thứ tự hiển thị & Tương tác / Z-Index & Interaction / 层级与交互

Để đảm bảo các nút bấm và thành phần giao diện có thể click được, chúng phải có `z-index` cao hơn canvas.

To ensure buttons and other UI elements are clickable, they must have a higher `z-index` than the canvas.

为了确保按钮和其他 UI 元素可点击，它们的 `z-index` 必须高于 canvas。

```css
/* CSS */
canvas#fireworks-canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000; /* Background layer */
}

.my-interface {
  position: relative;
  z-index: 2000; /* Floating above canvas */
}
```

---

## Tùy chọn / Options / 配置项

| Option         | Type    | Default              | Mô tả                   | Description                         | 描述             |
| :------------- | :------ | :------------------- | :---------------------- | :---------------------------------- | :--------------- |
| `hue`          | Object  | `{min: 0, max: 360}` | Dải màu sắc             | Color range                         | 颜色范围         |
| `particles`    | Number  | `50`                 | Số lượng hạt mỗi lần nổ | Number of particles per explosion   | 每次爆炸的粒子数 |
| `friction`     | Number  | `0.95`               | Độ ma sát (cản gió)     | Air resistance (slower = more drag) | 空气阻力         |
| `gravity`      | Number  | `1.5`                | Trọng lực               | Gravity effect                      | 重力效果         |
| `acceleration` | Number  | `1.05`               | Gia tốc tên lửa         | Rocket acceleration                 | 火箭加速度       |
| `mouse.click`  | Boolean | `false`              | Bắn khi click chuột     | Launch on click                     | 点击发射         |

## License

MIT
