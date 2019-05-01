import Element from './Element'
import { requestInterval, cancelInterval } from './utils'
import { WebGLRenderer } from './gl'

export type Type = 'root'

export type Props = {
  width: number
  height: number
  fps: number
  context: WebGLRenderingContext
  onTick?(): void
}

export default class Root extends Element<Type, Props> {
  private renderer: WebGLRenderer
  private timer: ReturnType<typeof requestInterval>
  constructor(props: Props) {
    super('root', props)
    this.renderer = new WebGLRenderer(props.context)
    this.x = 0
    this.y = 0
    this.start()
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
