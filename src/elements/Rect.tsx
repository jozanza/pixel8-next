import Element from './Element'
import { WebGLRenderer } from './gl'
import { colorToUint32, createImageDataRectangle } from './utils'

export type Type = 'rect'

export type Props = {
  fill: string | number
  x: number
  y: number
  width: number
  height: number
}

export default class Rect extends Element<Type, Props> {
  private color: number
  private alpha: number
  private source: TexImageSource
  private cache: Map<string, TexImageSource>
  constructor(props: Props) {
    super('rect', props)
    this.cache = new Map()
    this.updateColor()
    this.updateSource()
  }
  private updateColor() {
    const { fill } = this.props
    this.color = Number.isFinite(fill as number)
      ? (fill as number)
      : colorToUint32(fill as string)
    this.alpha = (this.color >> 24) & 0xff
  }
  private updateSource() {
    const { width, height } = this.props
    const key = `${this.color},${width},${height}`
    if (!this.cache.has(key)) {
      const source = createImageDataRectangle(
        width || 1,
        height || 1,
        this.color,
      )
      this.cache.set(key, source)
    }
    this.source = this.cache.get(key)
  }
  applyProps(nextProps: Props) {
    const didFillChange = this.props.fill !== nextProps.fill
    const didChangeSize =
      this.props.width !== nextProps.width ||
      this.props.height !== nextProps.height
    this.props = nextProps
    if (didFillChange) {
      this.updateColor()
    }
    if (didFillChange || didChangeSize) {
      this.updateSource()
    }
  }
  draw(gl: WebGLRenderer) {
    const { width, height } = this.props
    const shouldDraw = this.alpha > 0 && width > 0 && height > 0
    if (shouldDraw) {
      gl.draw(this.source, this.x, this.y)
    }
    for (const child of this.children) {
      child.draw(gl)
    }
  }
}
