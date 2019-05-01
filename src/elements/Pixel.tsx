import Element from './Element'
import { WebGLRenderer } from './gl'
import { colorToUint32, createImageDataRectangle } from './utils'

export type Type = 'pixel'

export type Props = {
  fill: string
  x: number
  y: number
}

export default class Pixel extends Element<Type, Props> {
  private color: number
  private alpha: number
  private source: TexImageSource
  private cache: Map<string, TexImageSource>
  constructor(props: Props) {
    super('pixel', props)
    this.cache = new Map()
    this.updateColor()
    this.updateSource()
  }
  private updateColor() {
    this.color = colorToUint32(this.props.fill)
    this.alpha = (this.color >> 24) & 0xff
  }
  private updateSource() {
    const key = `${this.color}`
    if (!this.cache.has(key)) {
      this.cache.set(key, createImageDataRectangle(1, 1, this.color))
    }
    this.source = this.cache.get(key)
  }
  applyProps(nextProps: Props) {
    const didFillChange = this.props.fill !== nextProps.fill
    this.props = nextProps
    if (didFillChange) {
      this.updateColor()
      this.updateSource()
    }
  }
  draw(gl: WebGLRenderer) {
    const shouldDraw = this.alpha > 0
    if (shouldDraw) {
      gl.draw(this.source, this.x, this.y)
    }
    for (const child of this.children) {
      child.draw(gl)
    }
  }
}
