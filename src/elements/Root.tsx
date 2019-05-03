import Element from './Element'
import { requestInterval, cancelInterval } from './utils'
import { WebGLRenderer } from './gl'

export type Type = 'root'

export type Props = {
  width: number
  height: number
  scale: number
  fps: number
  context: WebGLRenderingContext
  onTick?(): void
  onTouchStart?(e: TouchEvent): void
  onTouchMove?(e: TouchEvent): void
  onTouchEnd?(e: TouchEvent): void
  onMouseDown?(e: MouseEvent): void
  onMouseMove?(e: MouseEvent): void
  onMouseUp?(e: MouseEvent): void
  onClick?(e: MouseEvent): void
}

export default class Root extends Element<Type, Props> {
  private renderer: WebGLRenderer
  private timer!: ReturnType<typeof requestInterval>
  touchstartables: Set<Element>
  touchmoveables: Set<Element>
  touchendables: Set<Element>
  mousedownables: Set<Element>
  mousemoveables: Set<Element>
  mouseupables: Set<Element>
  clickables: Set<Element>

  constructor(props: Props) {
    super('root', props)
    this.root = this
    this.renderer = new WebGLRenderer(props.context)
    this.x = 0
    this.y = 0
    this.touchstartables = new Set()
    this.touchmoveables = new Set()
    this.touchendables = new Set()
    this.mousedownables = new Set()
    this.mousemoveables = new Set()
    this.mouseupables = new Set()
    this.clickables = new Set()
    this.start()
    const { canvas } = this.props.context
    const options = { passive: true }
    canvas.addEventListener('touchstart', this.handleTouchStart, options)
    canvas.addEventListener('touchmove', this.handleTouchMove, options)
    canvas.addEventListener('touchend', this.handleTouchEnd, options)
    canvas.addEventListener('mousedown', this.handleMouseDown)
    canvas.addEventListener('mousemove', this.handleMouseMove)
    canvas.addEventListener('mouseup', this.handleMouseUp)
    canvas.addEventListener('click', this.handleClick)
  }

  handleTouchStart = (e: TouchEvent) => {
    if (this.touchstartables.size && e.touches.length) {
      const { scale, width, height } = this.props
      const { x: x0, y: y0 } = touchEventToPixelCoords(e, scale, width, height)
      for (const clickable of this.touchstartables) {
        const { x: x1, y: y1, width: w, height: h } = clickable
        const isInBoundsX = x0 >= x1 && x0 < x1 + w
        const isInBoundsY = y0 >= y1 && y0 < y1 + h
        if (isInBoundsX && isInBoundsY) {
          return clickable.props.onTouchStart(e)
        }
      }
    }
    if (this.props.onTouchStart) {
      this.props.onTouchStart(e)
    }
  }

  handleTouchMove = (e: TouchEvent) => {
    if (this.touchmoveables.size && e.touches.length) {
      const { scale, width, height } = this.props
      const { x: x0, y: y0 } = touchEventToPixelCoords(e, scale, width, height)
      for (const clickable of this.touchmoveables) {
        const { x: x1, y: y1, width: w, height: h } = clickable
        const isInBoundsX = x0 >= x1 && x0 < x1 + w
        const isInBoundsY = y0 >= y1 && y0 < y1 + h
        if (isInBoundsX && isInBoundsY) {
          return clickable.props.onTouchMove(e)
        }
      }
    }
    if (this.props.onTouchMove) {
      this.props.onTouchMove(e)
    }
  }

  handleTouchEnd = (e: TouchEvent) => {
    if (this.touchendables.size && e.changedTouches.length) {
      const { scale, width, height } = this.props
      const { x: x0, y: y0 } = touchEventToPixelCoords(e, scale, width, height)
      for (const clickable of this.touchendables) {
        const { x: x1, y: y1, width: w, height: h } = clickable
        const isInBoundsX = x0 >= x1 && x0 < x1 + w
        const isInBoundsY = y0 >= y1 && y0 < y1 + h
        if (isInBoundsX && isInBoundsY) {
          return clickable.props.onTouchEnd(e)
        }
      }
    }
    if (this.props.onTouchEnd) {
      this.props.onTouchEnd(e)
    }
  }

  handleMouseDown = (e: MouseEvent) => {
    if (this.mousedownables.size) {
      const { scale, width, height } = this.props
      const { x: x0, y: y0 } = mouseEventToPixelCoords(e, scale, width, height)
      for (const clickable of this.mousedownables) {
        const { x: x1, y: y1, width: w, height: h } = clickable
        const isInBoundsX = x0 >= x1 && x0 < x1 + w
        const isInBoundsY = y0 >= y1 && y0 < y1 + h
        if (isInBoundsX && isInBoundsY) {
          return clickable.props.onMouseDown(e)
        }
      }
    }
    if (this.props.onMouseDown) {
      this.props.onMouseDown(e)
    }
  }

  handleMouseMove = (e: MouseEvent) => {
    if (this.mousemoveables.size) {
      const { scale, width, height } = this.props
      const { x: x0, y: y0 } = mouseEventToPixelCoords(e, scale, width, height)
      for (const clickable of this.mousemoveables) {
        const { x: x1, y: y1, width: w, height: h } = clickable
        const isInBoundsX = x0 >= x1 && x0 < x1 + w
        const isInBoundsY = y0 >= y1 && y0 < y1 + h
        if (isInBoundsX && isInBoundsY) {
          return clickable.props.onMouseMove(e)
        }
      }
    }
    if (this.props.onMouseMove) {
      this.props.onMouseMove(e)
    }
  }

  handleMouseUp = (e: MouseEvent) => {
    if (this.mouseupables.size) {
      const { scale, width, height } = this.props
      const { x: x0, y: y0 } = mouseEventToPixelCoords(e, scale, width, height)
      for (const clickable of this.mouseupables) {
        const { x: x1, y: y1, width: w, height: h } = clickable
        const isInBoundsX = x0 >= x1 && x0 < x1 + w
        const isInBoundsY = y0 >= y1 && y0 < y1 + h
        if (isInBoundsX && isInBoundsY) {
          return clickable.props.onMouseUp(e)
        }
      }
    }
    if (this.props.onMouseUp) {
      this.props.onMouseUp(e)
    }
  }

  handleClick = (e: MouseEvent) => {
    if (this.clickables.size) {
      const { scale, width, height } = this.props
      const { x: x0, y: y0 } = mouseEventToPixelCoords(e, scale, width, height)
      for (const clickable of this.clickables) {
        const { x: x1, y: y1, width: w, height: h } = clickable
        const isInBoundsX = x0 >= x1 && x0 < x1 + w
        const isInBoundsY = y0 >= y1 && y0 < y1 + h
        if (isInBoundsX && isInBoundsY) {
          return clickable.props.onClick(e)
        }
      }
    }
    if (this.props.onClick) {
      this.props.onClick(e)
    }
  }

  /** Starts the render loop */
  private start() {
    this.stop()
    this.timer = requestInterval(() => {
      this.update()
      if (this.props.onTick) {
        this.props.onTick()
      }
      this.draw()
    }, 1000 / this.props.fps)
  }

  /** Stops the render loop */
  private stop() {
    if (!this.timer) return
    cancelInterval(this.timer)
  }

  /** Performs any necessary cleanup before instance is unmounted */
  destroy() {
    this.stop()
    const { canvas } = this.props.context
    canvas.removeEventListener('touchstart', this.handleTouchStart)
    canvas.removeEventListener('touchmove', this.handleTouchMove)
    canvas.removeEventListener('touchend', this.handleTouchEnd)
    canvas.removeEventListener('mousedown', this.handleMouseDown)
    canvas.removeEventListener('mousemove', this.handleMouseMove)
    canvas.removeEventListener('mouseup', this.handleMouseUp)
    canvas.removeEventListener('click', this.handleClick)
  }

  /** Replaces props and maybe resizes */
  applyProps(nextProps: Props) {
    const didFPSChange = this.props.fps !== nextProps.fps
    this.props = nextProps
    if (didFPSChange) {
      this.start()
    }
  }

  /** Draws screen ImageData onto canvas 2d context  */
  draw() {
    const { renderer } = this
    renderer.clear()
    for (const child of this.children) {
      child.draw(renderer)
    }
  }
}

function mouseEventToPixelCoords(
  e: MouseEvent,
  scale: number,
  width: number,
  height: number,
) {
  const rect = (e.target as HTMLCanvasElement).getBoundingClientRect!()
  const scaleX = scale * (rect.width / (scale * width))
  const scaleY = scale * (rect.height / (scale * height))
  const x = Math.floor((e.clientX - rect.left) / scaleX)
  const y = Math.floor((e.clientY - rect.top) / scaleY)
  return { x, y }
}

function touchEventToPixelCoords(
  e: TouchEvent,
  scale: number,
  width: number,
  height: number,
) {
  const rect = (e.target as HTMLCanvasElement).getBoundingClientRect!()
  const scaleX = scale * (rect.width / (scale * width))
  const scaleY = scale * (rect.height / (scale * height))
  const touch = e[e.type === 'touchend' ? 'changedTouches' : 'touches'][0]
  const x = Math.floor((touch.clientX - rect.left) / scaleX)
  const y = Math.floor((touch.clientY - rect.top) / scaleY)
  return { x, y }
}
