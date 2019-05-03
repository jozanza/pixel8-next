export default class Element<
  T extends string = any,
  P extends { [key: string]: any } = any
> {
  type: T
  props: P
  root: null | Element
  parent: null | Element
  children: Set<Element>
  touchstartables?: Set<Element>
  touchmoveables?: Set<Element>
  touchendables?: Set<Element>
  mousedownables?: Set<Element>
  mousemoveables?: Set<Element>
  mouseupables?: Set<Element>
  clickables?: Set<Element>
  id: number
  x: number
  y: number
  width: number
  height: number
  constructor(type: T, props: P) {
    this.type = type
    this.props = props
    this.children = new Set()
    this.id = performance.now() * 1000000000
    this.root = null
    this.parent = null
    this.x = 0
    this.y = 0
    this.width = 0
    this.height = 0
  }
  applyProps(nextProps: P) {
    this.props = nextProps
  }
  appendChild(child: Element) {
    this.children.add(child)
    child.parent = this
    child.root = this.root
  }
  insertBefore(child: Element, beforeChild: Element) {
    const nextChildren = new Set<Element>()
    for (const c of this.children) {
      if (c === beforeChild) {
        nextChildren.add(child)
        child.parent = this
        child.root = this.root
      }
      nextChildren.add(c)
    }
    this.children = nextChildren
  }
  removeChild(child: Element) {
    this.children.delete(child)
    child.parent = null
    if (this.clickables) {
      this.clickables.delete(child)
    }
    child.root = null
  }
  update() {
    // Position & Size
    if (this.parent) {
      this.x = this.props.x + this.parent.x || 0
      this.y = this.props.y + this.parent.y || 0
    } else {
      this.x = this.props.x || 0
      this.y = this.props.y || 0
    }
    if (this.type === 'pixel') {
      this.width = this.height = 1
    } else {
      this.width = this.props.width || 0
      this.height = this.props.height || 0
    }
    // Event Handlers
    if (this.props.onTick) {
      this.props.onTick()
    }
    if (this.root) {
      if (this.props.onTouchStart) {
        this.root.touchstartables!.add(this)
      } else {
        this.root.touchstartables!.delete(this)
      }
      if (this.props.onTouchMove) {
        this.root.touchmoveables!.add(this)
      } else {
        this.root.touchmoveables!.delete(this)
      }
      if (this.props.onTouchEnd) {
        this.root.touchendables!.add(this)
      } else {
        this.root.touchendables!.delete(this)
      }
      if (this.props.onMouseDown) {
        this.root.mousedownables!.add(this)
      } else {
        this.root.mousedownables!.delete(this)
      }
      if (this.props.onMouseMove) {
        this.root.mousemoveables!.add(this)
      } else {
        this.root.mousemoveables!.delete(this)
      }
      if (this.props.onMouseUp) {
        this.root.mouseupables!.add(this)
      } else {
        this.root.mouseupables!.delete(this)
      }
      if (this.props.onClick) {
        this.root.clickables!.add(this)
      } else {
        this.root.clickables!.delete(this)
      }
    }
    for (const child of this.children) {
      child.update()
    }
  }
  destroy() {}
  draw(...args: any[]) {}
}
