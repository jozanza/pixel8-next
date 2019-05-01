import Root from './Root'
import Rect from './Rect'
import Pixel from './Pixel'
import Circ from './Circ'

export { default as Element } from './Element'

export function createElement(
  type: string,
  props: any,
  _root: HTMLCanvasElement,
) {
  // console.log('createElement', type, props, root)
  switch (type) {
    case 'circ': {
      return new Circ(props)
    }
    case 'pixel': {
      return new Pixel(props)
    }
    case 'rect': {
      return new Rect(props)
    }
    case 'root': {
      return new Root(props)
    }
    // Ignore all children without a `type` property (functions, nulls, etc)
    default:
      console.warn(`Pixel8: unsupported child of type '${type}'`)
      return
  }
}
