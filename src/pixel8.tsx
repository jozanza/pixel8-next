import { ReactNode } from 'react'
import { Props as CircProps } from './elements/Circ'
import { Props as PixelProps } from './elements/Pixel'
import { Props as RectProps } from './elements/Rect'
import { Props as RootProps } from './elements/Root'

declare global {
  namespace Pixel8 {
    type Type = string
    type Props = CircProps | PixelProps | RectProps | RootProps
    type HostContext = {}
    type Container = HTMLCanvasElement
    type UpdatePayload = {}

    type ReactElement<T extends {}> = {
      key?: string
      children?: ReactNode
    } & T
  }
  namespace JSX {
    interface IntrinsicElements {
      circ: Pixel8.ReactElement<CircProps>
      pixel: Pixel8.ReactElement<PixelProps>
      rectangle: Pixel8.ReactElement<RectProps>
      root: Pixel8.ReactElement<RootProps>
    }
  }
}

export { Stage } from './components'
export { useAnimation } from './hooks'
