/**
 * Compiles a WebGLShader
 * @param gl - the rendering context
 * @param type - gl.VERTEX_SHADER | gl.FRAGMENT_SHADER
 * @param source - the actual shader script as a string
 */
export function compileShader(
  gl: WebGLRenderingContext,
  /** WebGLRenderingContext.VERTEX_SHADER | WebGLRenderingContext.FRAGMENT_SHADER */
  type: GLenum,
  source: string,
) {
  const shader = gl.createShader(type)
  if (!shader) throw new Error('Could not create shader')
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  const didCompile = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (didCompile) return shader
  // Shader compilation failed
  const log = gl.getShaderInfoLog(shader)
  const err = new Error(`Could not compile WebGLShader: ${log}`)
  gl.deleteShader(shader)
  throw err
}

/**
 * Creates a WebGLProgram
 * @param gl - the rendering context
 * @param vertexShader - the program's vertex shader
 * @param fragmentShader - the program's fragment shader
 */
export function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
) {
  const program = gl.createProgram()
  if (!program) throw new Error('Could not create WebGLProgram')
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  const didLink = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (didLink) {
    gl.useProgram(program)
    return program
  }
  // Program creaton failed
  const log = gl.getProgramInfoLog(program)
  const err = new Error(`Could not create WebGLProgram: ${log}`)
  gl.deleteProgram(program)
  throw err
}

type WebGLAttributeOrUniform<T extends string, V> = [string, T, V]

type WebGLAttributeType =
  | WebGLAttributeOrUniform<'1f', number>
  | WebGLAttributeOrUniform<'1fv', Float32List>
  | WebGLAttributeOrUniform<'2f', [number, number]>
  | WebGLAttributeOrUniform<'2fv', Float32List>
  | WebGLAttributeOrUniform<'3f', [number, number, number]>
  | WebGLAttributeOrUniform<'3fv', Float32List>
  | WebGLAttributeOrUniform<'4f', [number, number, number, number]>
  | WebGLAttributeOrUniform<'4fv', Float32List>
export function setAttribute(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string,
  type: '1f',
  value: number,
): number
export function setAttribute(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string,
  type: '1fv',
  value: Float32List,
): number
export function setAttribute(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string,
  type: '2f',
  value: [number, number],
): number
export function setAttribute(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string,
  type: '2fv',
  value: Float32List,
): number
export function setAttribute(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string,
  type: '3f',
  value: [number, number, number],
): number
export function setAttribute(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string,
  type: '3fv',
  value: Float32List,
): number
export function setAttribute(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string,
  type: '4f',
  value: [number, number, number, number],
): number
export function setAttribute(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string,
  type: '4fv',
  value: Float32List,
): number
/** Gets the location of a WebGL vertex attribute, assigns a value, and returns its pointer */
export function setAttribute(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  ...data: WebGLAttributeType
) {
  const index = gl.getAttribLocation(program, data[0])
  switch (data[1]) {
    case '1f': {
      gl.vertexAttrib1f(index, data[2])
      break
    }
    case '1fv': {
      gl.vertexAttrib1fv(index, data[2])
      break
    }
    case '2f': {
      gl.vertexAttrib2f(index, ...data[2])
      break
    }
    case '2fv': {
      gl.vertexAttrib2fv(index, data[2])
      break
    }
    case '3f': {
      gl.vertexAttrib3f(index, ...data[2])
      break
    }
    case '3fv': {
      gl.vertexAttrib3fv(index, data[2])
      break
    }
    case '4f': {
      gl.vertexAttrib4f(index, ...data[2])
      break
    }
    case '4fv': {
      gl.vertexAttrib4fv(index, data[2])
      break
    }
    default:
      throw new TypeError(`Invalid WebGL attribute type: '${data[1]}'`)
  }
  return index
}

type WebGLUniformType =
  | WebGLAttributeOrUniform<'1f', number>
  | WebGLAttributeOrUniform<'1fv', Float32List>
  | WebGLAttributeOrUniform<'1i', number>
  | WebGLAttributeOrUniform<'1iv', Int32List>
  | WebGLAttributeOrUniform<'2f', [number, number]>
  | WebGLAttributeOrUniform<'2fv', Float32List>
  | WebGLAttributeOrUniform<'2i', [number, number]>
  | WebGLAttributeOrUniform<'2iv', Int32List>
  | WebGLAttributeOrUniform<'3f', [number, number, number]>
  | WebGLAttributeOrUniform<'3fv', Float32List>
  | WebGLAttributeOrUniform<'3i', [number, number, number]>
  | WebGLAttributeOrUniform<'3iv', Int32List>
  | WebGLAttributeOrUniform<'4f', [number, number, number, number]>
  | WebGLAttributeOrUniform<'4fv', Float32List>
  | WebGLAttributeOrUniform<'4i', [number, number, number, number]>
  | WebGLAttributeOrUniform<'4iv', Int32List>
export function setUniform(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string,
  type: '1f',
  value: number,
): number
export function setUniform(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string,
  type: '1fv',
  value: Float32List,
): number
export function setUniform(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string,
  type: '1i',
  value: number,
): number
export function setUniform(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string,
  type: '1iv',
  value: Int32List,
): number
export function setUniform(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string,
  type: '2f',
  value: [number, number],
): number
export function setUniform(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string,
  type: '2fv',
  value: Float32List,
): number
export function setUniform(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string,
  type: '2i',
  value: [number, number],
): number
export function setUniform(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string,
  type: '2iv',
  value: Int32List,
): number
export function setUniform(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string,
  type: '3f',
  value: [number, number, number],
): number
export function setUniform(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string,
  type: '3fv',
  value: Float32List,
): number
export function setUniform(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string,
  type: '3i',
  value: [number, number, number],
): number
export function setUniform(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string,
  type: '3iv',
  value: Int32List,
): number
export function setUniform(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string,
  type: '4f',
  value: [number, number, number, number],
): number
export function setUniform(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string,
  type: '4fv',
  value: Float32List,
): number
export function setUniform(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string,
  type: '4i',
  value: [number, number, number, number],
): number
export function setUniform(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string,
  type: '4iv',
  value: Int32List,
): number
/** Gets the location of a WebGL uniform, assigns a value, and returns its pointer */
export function setUniform(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  ...data: WebGLUniformType
) {
  const index = gl.getUniformLocation(program, data[0])
  switch (data[1]) {
    case '1f': {
      gl.uniform1f(index, data[2])
      break
    }
    case '1fv': {
      gl.uniform1fv(index, data[2])
      break
    }
    case '1i': {
      gl.uniform1i(index, data[2])
      break
    }
    case '1iv': {
      gl.uniform1iv(index, data[2])
      break
    }
    case '2f': {
      gl.uniform2f(index, ...data[2])
      break
    }
    case '2fv': {
      gl.uniform2fv(index, data[2])
      break
    }
    case '2i': {
      gl.uniform2i(index, ...data[2])
      break
    }
    case '2iv': {
      gl.uniform2iv(index, data[2])
      break
    }
    case '3f': {
      gl.uniform3f(index, ...data[2])
      break
    }
    case '3fv': {
      gl.uniform3fv(index, data[2])
      break
    }
    case '3i': {
      gl.uniform3i(index, ...data[2])
      break
    }
    case '3iv': {
      gl.uniform3iv(index, data[2])
      break
    }
    case '4f': {
      gl.uniform4f(index, ...data[2])
      break
    }
    case '4fv': {
      gl.uniform4fv(index, data[2])
      break
    }
    case '4i': {
      gl.uniform4i(index, ...data[2])
      break
    }
    case '4iv': {
      gl.uniform4iv(index, data[2])
      break
    }
    default:
      throw new TypeError(`Invalid WebGL uniform type: '${data[1]}'`)
  }
  return index
}

type WebGLUniformMatrixType =
  | WebGLAttributeOrUniform<'2fv', Float32List>
  | WebGLAttributeOrUniform<'3fv', Float32List>
  | WebGLAttributeOrUniform<'4fv', Float32List>
export function setUniformMatrix(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string,
  type: '2fv',
  value: Float32List,
): number
export function setUniformMatrix(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string,
  type: '3fv',
  value: Float32List,
): number
export function setUniformMatrix(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string,
  type: '4fv',
  value: Float32List,
): number
/** Gets the location of a WebGL uniform matrix, assigns a value, and returns its pointer */
export function setUniformMatrix(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  ...data: WebGLUniformMatrixType
) {
  const location = gl.getUniformLocation(program, data[0])
  switch (data[1]) {
    case '2fv': {
      gl.uniformMatrix2fv(location, false, data[2])
      break
    }
    case '3fv': {
      gl.uniformMatrix3fv(location, false, data[2])
      break
    }
    case '4fv': {
      gl.uniformMatrix4fv(location, false, data[2])
      break
    }
    default:
      throw new TypeError(`Invalid WebGL uniform matrix type: '${data[1]}'`)
  }
  return location
}

/**
 * Creates a WebGL buffer
 * @param gl - the rendering context
 * @param data - the data to assign to the buffer
 * @param target - the type of the buffer: ARRAY_BUFFER | ELEMENT_ARRAY_BUFFER
 * @param usage - the drawing mode: STATIC_DRAW | DYNAMIC_DRAW | STREAM_DRAW
 */
export function createBuffer(
  gl: WebGLRenderingContext,
  data: BufferSource,
  target: GLenum = gl.ARRAY_BUFFER,
  usage: GLenum = gl.STATIC_DRAW,
) {
  const buffer = gl.createBuffer()
  if (!buffer) throw new Error('Could not create buffer')
  gl.bindBuffer(target, buffer)
  gl.bufferData(target, data, usage)
  gl.bindBuffer(target, null)
  return buffer
}

/**
 * Assigns a WebGLBuffer to a WebGL vertex attribute
 * @param gl - the rendering context
 * @param program - the WebGL program
 * @param name - buffer attribute name
 * @param size - components per iteration
 * @param buffer - the WebGLBuffer to assign
 * @param target - the type of the buffer: ARRAY_BUFFER | ELEMENT_ARRAY_BUFFER
 * @param type - the type of the buffer's values: FLOAT | BYTE | SHORT | UNSIGNED_BYTE | UNSIGNED_SHORT
 * @param normalized - whether to normalize the buffer's values
 * @param stride - 0 = move forward size * sizeof(type) each iteration to get the next position
 * @param offset - buffer index to start at
 */
export function assignBufferToAttribute(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string,
  size: number,
  buffer: WebGLBuffer,
  target: GLenum = gl.ARRAY_BUFFER,
  type: GLenum = gl.FLOAT,
  normalized: boolean = false,
  stride: number = 0,
  offset: number = 0,
) {
  const index = gl.getAttribLocation(program, name)
  gl.bindBuffer(target, buffer)
  gl.vertexAttribPointer(index, size, type, normalized, stride, offset)
  gl.enableVertexAttribArray(index)
  gl.bindBuffer(target, null)
  return buffer
}

/**
 * Creates a WebGLTexture
 * @param gl - the rendering context
 * @param source - TextImageSource: ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap
 */
export function createTexture(
  gl: WebGLRenderingContext,
  source: TexImageSource,
) {
  const target = gl.TEXTURE_2D
  const texture = gl.createTexture()
  if (!texture) throw new Error('Could not create texture')
  gl.bindTexture(target, texture)
  gl.texParameteri(target, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(target, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texImage2D(target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source)
  gl.bindTexture(target, null)
  return texture
}

/**
 * Creates a mat3 that converts pixel coords to clipspace
 * @param w
 * @param h
 * @param sw
 * @param sh
 * @param dx
 * @param dy
 * @param scaleX
 * @param scaleY
 */
export function px2ClipMatrix(
  sw: number,
  sh: number,
  dx: number,
  dy: number,
  scaleX: number,
  scaleY: number,
) {
  const dw = sw * scaleX
  const dh = sh * scaleY
  return [dw, 0, 0, 0, dh, 0, dx, dy, 1]
}

export class WebGLRenderer {
  private gl: WebGLRenderingContext
  private program: WebGLProgram
  private textures: WeakMap<TexImageSource, WebGLTexture>
  constructor(gl: WebGLRenderingContext) {
    const vertexShaderSource = `
      uniform mat3 u_matrix;
      uniform vec2 u_resolution;
      attribute vec2 a_position;
      varying vec2 v_tex_coord;
      void main() {
        vec2 position = (u_matrix * vec3(a_position, 1)).xy;
        vec2 zeroToOne = position / u_resolution;
        vec2 zeroToTwo = zeroToOne * 2.0;
        vec2 clipSpace = zeroToTwo - 1.0;
        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
        v_tex_coord = a_position;
      }
    `
    const fragmentShaderSource = `
      precision highp float;
      uniform sampler2D u_image;
      varying vec2 v_tex_coord;
      void main() {
        if (
          v_tex_coord.x < 0.0 || 
          v_tex_coord.y < 0.0 || 
          v_tex_coord.x > 1.0 || 
          v_tex_coord.y > 1.0) {
          discard;
        }
        vec4 color = texture2D(u_image, v_tex_coord);
        gl_FragColor = color;
        // pre-multiply the alpha channel;
        gl_FragColor.rgb *= gl_FragColor.a;
      }
    `
    const vs = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    const program = createProgram(gl, vs, fs)
    /* prettier-ignore */
    const texCoords = createBuffer(gl, new Float32Array([
      0, 0, 1, 0, 0, 1, // triangle A vertices
      0, 1, 1, 0, 1, 1, // triangle B vertices
    ]))
    assignBufferToAttribute(gl, program, 'a_position', 2, texCoords)
    gl.colorMask(true, true, true, true)
    gl.clearColor(0, 0, 0, 0)
    gl.enable(gl.BLEND)
    // gl.blendFunc(gl.SRC_COLOR, gl.DST_COLOR)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    this.gl = gl
    this.program = program
    this.textures = new WeakMap()
  }
  clear() {
    const { gl, program } = this
    const { width, height } = gl.canvas
    gl.viewport(0, 0, width, height)
    setUniform(gl, program, 'u_resolution', '2f', [width, height])
    gl.clear(gl.COLOR_BUFFER_BIT)
  }
  draw(
    sprite: TexImageSource,
    dx: number = 0,
    dy: number = 0,
    dw: number = sprite.width,
    dh: number = sprite.height,
  ) {
    const { gl, program } = this
    if (!this.textures.has(sprite)) {
      this.textures.set(sprite, createTexture(gl, sprite))
    }
    const texture = this.textures.get(sprite)!
    /* prettier-ignore */
    setUniformMatrix(gl, program, 'u_matrix', '3fv', [
      dw, 0, 0,
      0, dh, 0,
      dx, dy, 1
    ])
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }
}
