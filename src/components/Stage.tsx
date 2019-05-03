import React, {
  forwardRef,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react'
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

export default forwardRef(function Stage(props: Props, ref) {
  const {
    background = 'transparent',
    fps = 30,
    width = 128,
    height = 128,
    scale = 1,
    children,
    ...rest
  } = props
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useLayoutEffect(() => {
    if (typeof ref === 'function') {
      ref(canvasRef.current)
    } else if (ref) {
      ;(ref as any).current = canvasRef.current
    }
  }, [canvasRef, ref])
  const isCanvasReady = Boolean(canvasRef.current)
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
    <canvas ref={canvasRef} style={styles} width={width} height={height} />
  )
  useEffect(() => {
    if (!canvasRef.current) return
    const c = canvasRef.current
    const context = c.getContext('webgl', { antialias: false })
    const rootElem = React.createElement('root', {
      width,
      height,
      scale,
      fps,
      context,
      children,
      ...rest,
    })
    Pixel8.render(rootElem, c)
  }, [isCanvasReady, width, height, fps, scale, children])
  useEffect(
    () => () => {
      if (canvasRef.current) {
        Pixel8.unmountComponentAtNode(canvasRef.current)
      }
    },
    [],
  )
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
})
