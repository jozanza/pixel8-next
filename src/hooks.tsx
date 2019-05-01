import { useState } from 'react'
import { colorToUint32 } from './elements/utils'

enum AnimationDirection {
  Backwards = -1,
  Forwards = 1,
}

// TODO:
// - [ ] iterationCount
// - [ ] fill-forwards
// - [ ] onUpdate on any element
export function useAnimation({
  from: _from,
  to: _to,
  duration,
  delay = 0,
  alternate,
  ease = 'linear',
}: {
  from: number | string
  to: number | string
  duration: number
  delay?: number
  alternate: boolean
  ease?: keyof typeof EASING_FUNCTIONS
}) {
  // TODO: clean this up / simplify logic
  const isFromAColor = typeof _from === 'string'
  let from = isFromAColor ? colorToUint32(_from as string) : (_from as number)
  const fromAlpha = isFromAColor ? (from >> 24) & 0xff : 255
  from = isFromAColor ? (from & 0x00ffffff) | (255 << 24) : from
  const isToAColor = typeof _to === 'string'
  let to = isToAColor ? colorToUint32(_to as string) : (_to as number)
  const toAlpha = isToAColor ? (to >> 24) & 0xff : 255
  to = isToAColor ? (to & 0x00ffffff) | (255 << 24) : to
  const alphaSteps = Math.abs(fromAlpha - toAlpha)
  const alphaStep = (alphaSteps / duration) * (fromAlpha < toAlpha ? 1 : -1)

  // The animation values
  const [{ value, frame, direction, wait }, setValue] = useState({
    value: isFromAColor ? (from & 0x00ffffff) | (fromAlpha << 24) : from,
    frame: 0,
    direction: AnimationDirection.Forwards,
    wait: delay,
  })

  // The update updater function that runs each frame
  const update = () => {
    if (wait > 0) {
      setValue({ value, frame, direction, wait: wait - 1 })
      return
    }
    const steps = Math.abs(from - to)
    const step = (steps / duration) * (from < to ? 1 : -1)
    const nextFrame = (frame + direction) % duration
    const linearProgress = frame / (duration - 1)
    const easedProgress = EASING_FUNCTIONS[ease](linearProgress)
    const easedFrame = easedProgress * duration
    const nextAlpha = fromAlpha + Math.round(alphaStep * easedFrame)
    const nextValue =
      alphaStep > 0
        ? ((from + step * easedFrame) & 0x00ffffff) | (nextAlpha << 24)
        : from + step * easedFrame
    // animation loop ended
    if (nextFrame === 0) {
      if (!alternate) {
        // Reset
        setValue({
          value: from,
          frame: nextFrame,
          direction,
          wait: delay,
        })
      } else {
        // Go backwards
        if (direction === AnimationDirection.Forwards) {
          setValue({
            value: nextValue,
            frame: frame - 1,
            direction: AnimationDirection.Backwards,
            wait: delay,
          })
        }
        // Go forwards
        else {
          setValue({
            value: nextValue,
            frame: 0,
            direction: AnimationDirection.Forwards,
            wait: delay,
          })
        }
      }
    }
    // next animation frame
    else {
      setValue({ value: nextValue, frame: nextFrame, direction, wait })
    }
  }

  // Return the value and updater
  return [value, update] as [typeof value, typeof update]
}

/** Some functions for easing animations / transitions */
const EASING_FUNCTIONS = {
  linear: t => t,
  easeInQuad: t => t * t,
  easeOutQuad: t => t * (2 - t),
  easeInOutQuad: t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: t => t * t * t,
  easeOutCubic: t => --t * t * t + 1,
  easeInOutCubic: t =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInQuart: t => t * t * t * t,
  easeOutQuart: t => 1 - --t * t * t * t,
  easeInOutQuart: t => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t),
  easeInQuint: t => t * t * t * t * t,
  easeOutQuint: t => 1 + --t * t * t * t * t,
  easeInOutQuint: t =>
    t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t,
}
