import React, { ReactNode, useEffect, useRef } from 'react'
import * as Pixel8 from '../renderer'

type Props = {
  fps?: number
  width?: number
  height?: number
  scale?: number
  background?: string
  children?: ReactNode
  onTick?(): void
}

export default function Stage(props: Props) {
  const {
    background = 'transparent',
    fps = 30,
    width = 128,
    height = 128,
    scale = 1,
    children,
    onTick,
  } = props
  // const self = useRed({})
  const canvasEl = useRef<HTMLCanvasElement>(null)
  const styles: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    outline: 'none',
    imageRendering: 'pixelated',
    transformOrigin: '0 0',
    transform: `scale(${scale})`,
    background,
    width,
    height,
  }
  const canvas = (
    <canvas ref={canvasEl} style={styles} width={width} height={height} />
  )
  useEffect(() => {
    if (!canvasEl.current) return
    const { current: c } = canvasEl
    const context = c.getContext('webgl', { antialias: false })
    const rootElem = React.createElement('root', {
      width,
      height,
      fps,
      context,
      children,
      onTick,
    })
    Pixel8.render(rootElem, c)
  }, [canvasEl.current, width, height, fps, scale, children, onTick])
  useEffect(() => () => Pixel8.unmountComponentAtNode(canvasEl.current), [])
  // console.log(ctx.current)
  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        verticalAlign: 'top',
        width: `${width * scale}px`,
        height: `${height * scale}px`,
      }}
    >
      {canvas}
    </div>
  )
}

import { Props as CircProps } from '../elements/Circ'
import { Props as PixelProps } from '../elements/Pixel'
// import { Props as RectProps } from '../elements/Rect'
declare global {
  namespace JSX {
    interface IntrinsicElements {
      circ: CircProps & { key?: string; children?: ReactNode }
      pixel: PixelProps & { key?: string }
      // rect: RectProps & { children?: ReactNode }
    }
  }
}
