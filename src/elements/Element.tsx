export default class Element<T = any, P = any> {
  type: T
  props: P
  parent: null | Element
  children: Set<Element>
  id: number
  width: number
  height: number
  x: number
  y: number
  constructor(type: T, props: P) {
    this.type = type
    this.props = props
    this.children = new Set()
    this.parent = null
    this.id = performance.now() * 1000000000
  }
  applyProps(nextProps: P) {
    this.props = nextProps
  }
  appendChild(child: Element) {
    this.children.add(child)
    child.parent = this
  }
  insertBefore(child: Element, beforeChild: Element) {
    const nextChildren = new Set<Element>()
    for (const c of this.children) {
      if (c === beforeChild) {
        nextChildren.add(child)
        child.parent = this
      }
      nextChildren.add(c)
    }
    this.children = nextChildren
  }
  removeChild(child: Element) {
    this.children.delete(child)
    child.parent = null
  }
  update() {
    if (this.parent) {
      this.x = this.props.x + this.parent.x || 0
      this.y = this.props.y + this.parent.y || 0
    }
    for (const child of this.children) {
      child.update()
    }
  }
  destroy() {}
  draw(...args: any[]) {}
}
