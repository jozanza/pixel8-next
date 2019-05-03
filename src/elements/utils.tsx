/** Runs a requestAnimationFrame callback after a set delay */
export function requestInterval(f: () => void, delay: number) {
  let start = performance.now()
  const timer = {
    value: requestAnimationFrame(function loop() {
      const current = performance.now()
      const delta = current - start
      if (delta >= delay) {
        f()
        start = performance.now()
      }
      timer.value = requestAnimationFrame(loop)
    }),
  }
  return timer
}

/** Cancels the requestInterval */
export function cancelInterval({ value }: ReturnType<typeof requestInterval>) {
  cancelAnimationFrame(value)
}

/** Creates an ImageData rectangle */
export function createImageDataRectangle(
  width: number,
  height: number,
  fill: number,
) {
  const dat = new ImageData(width, height)
  const pix = new Uint32Array(dat.data.buffer)
  pix.fill(fill)
  return dat
}

/** Creates an ImageData circle */
export function createImageDataCircle(radius: number, fill: number) {
  const size = radius * 2
  const dat = new ImageData(size, size)
  const pix = new Uint32Array(dat.data.buffer)
  let xoff = 0
  let yoff = radius
  let balance = -radius
  while (xoff <= yoff) {
    const p0 = radius - xoff
    const p1 = radius - yoff
    const w0 = xoff * 2
    const w1 = yoff * 2
    for (let i = 0; i < w0; i++) {
      const x = p0 + i
      const y0 = size * (radius + yoff - 1)
      const y1 = size * (radius - yoff)
      pix[x + y0] = fill
      pix[x + y1] = fill
    }
    for (let i = 0; i < w1; i++) {
      const x = p1 + i
      const y0 = size * (radius + xoff - 1)
      const y1 = size * (radius - xoff)
      pix[x + y0] = fill
      pix[x + y1] = fill
    }
    //
    if ((balance += xoff++ + xoff) >= 0) {
      balance -= --yoff + yoff
    }
  }
  return dat
}

/** Converts a color string to an ABGR uint32 */
export function colorToUint32(color: string) {
  return '#' === color[0] ? hexToUint32(color) : rgbaToUint32(color)
}

/** Converts a hex string to a Uint32 */
export function hexToUint32(hex: string) {
  const len = Math.min(hex.length - 1, 6)
  let str = ''
  if (len === 3) {
    for (const x of hex.substr(1)) {
      str = x.repeat(2) + str
    }
  } else {
    for (let i = len - 1; i > 0; i -= 2) {
      str += hex[i] + hex[i + 1]
    }
  }
  return parseInt('ff' + str, 16)
}

/** Converts an RGB/A string to ABGR uint32 */
export function rgbaToUint32(rgba: string) {
  const matches = rgba.match(/([0-9]*[.])?[0-9]+/g)
  if (!matches) throw new Error(`Invalid RGB or RGBA color string: "${rgba}"`)
  const [red, green, blue, alpha = 1] = matches.map(Number)
  const a = (alpha * 255) & 0xff
  const b = blue & 0xff
  const g = green & 0xff
  const r = red & 0xff
  return (a << 24) | (b << 16) | (g << 8) | r
}

/** Converts an ABGR uint32 into an RGBA tuple */
export function explodeRGBA(uint32: number) {
  return [
    (uint32 >> 0) & 0xff,
    (uint32 >> 8) & 0xff,
    (uint32 >> 16) & 0xff,
    (uint32 >> 24) & 0xff,
  ]
}
