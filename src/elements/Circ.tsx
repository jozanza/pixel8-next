import Element from './Element'
import { WebGLRenderer } from './gl'
import { colorToUint32, createImageDataCircle } from './utils'

export type Type = 'circ'

export type Props = {
  fill: string
  x: number
  y: number
  radius: number
}

export default class Circ extends Element<Type, Props> {
  private color: number
  private alpha: number
  private source: TexImageSource
  private cache: Map<string, TexImageSource>
  constructor(props: Props) {
    super('circ', props)
    this.cache = new Map()
    this.updateColor()
    this.updateSource()
  }
  private updateColor() {
    this.color = colorToUint32(this.props.fill)
    this.alpha = (this.color >> 24) & 0xff
  }
  private updateSource() {
    const { radius } = this.props
    const key = `${this.color},${radius}`
    if (!this.cache.has(key)) {
      const source = createImageDataCircle(radius || 1, this.color)
      this.cache.set(key, source)
    }
    this.source = this.cache.get(key)
  }
  applyProps(nextProps: Props) {
    const didFillChange = this.props.fill !== nextProps.fill
    const didChangeSize = this.props.radius !== nextProps.radius
    this.props = nextProps
    if (didFillChange) {
      this.updateColor()
    }
    if (didFillChange || didChangeSize) {
      this.updateSource()
    }
  }
  draw(gl: WebGLRenderer) {
    const { radius } = this.props
    const shouldDraw = this.alpha > 0 && radius > 0
    if (shouldDraw) {
      gl.draw(this.source, this.x, this.y)
    }
    for (const child of this.children) {
      child.draw(gl)
    }
  }
}
