import { ReactElement } from 'react'
import Reconciler, { Fiber, HostConfig } from 'react-reconciler'
import {
  unstable_scheduleCallback as scheduleDeferredCallback,
  unstable_cancelCallback as cancelDeferredCallback,
} from 'scheduler'
import { createElement, Element as PixelElement } from './elements'

declare namespace Pixel8 {
  export type Type = string
  export type Props = {}
  export type HostContext = {}
  export type Container = HTMLCanvasElement
  export type UpdatePayload = {}
}

type Pixel8HostConfig = HostConfig<
  Pixel8.Type, // Type
  Pixel8.Props, // Props
  Pixel8.Container, // Container
  PixelElement, // Instance
  PixelElement, // TextInstance
  any, // HydratableInstance
  any, // PublicInstance
  Pixel8.HostContext, // HostContext
  Pixel8.UpdatePayload, // UpdatePayload
  any, // ChildSet
  number, // TimeoutHandle
  -1 // NoTimeout
>

const hostConfig: Pixel8HostConfig = {
  scheduleDeferredCallback,
  cancelDeferredCallback,
  setTimeout,
  clearTimeout,

  // React Suspense stuff: Usually set it to - 1. But can be any ID that
  // setTimeout doesnt provide.So that it can be used to check if timeout
  // handler is present or not
  noTimeout: -1,

  // Set this to true. This is primarily used in codebase to manage context
  // if there are more than one renderers I think. This is the hunch I got
  // after reading the codebase.
  isPrimaryRenderer: true,

  // Current react-dom doesnt support it yet.
  supportsPersistence: false,

  // Enable if you can support hydration.
  // More on hydration here: https://reactjs.org/docs/react-dom.html#hydrate
  supportsHydration: false,

  // This indicates the react-reconciler that the target (ie.DOM) UI API
  // supports mutation of the UI tree Ex: operations like appendChild,
  // removeChild etc
  supportsMutation: true,

  // This function is used by the reconciler in order to calculate current
  // time for prioritising work.
  now: (performance || Date).now,

  // Gives you a chance to hide internal instances
  getPublicInstance(instance) {
    return instance
  },

  // Lets you share some context with the other functions in this HostConfig.
  getRootHostContext(_nextRootInstance) {
    // nextRootInstance is basically the root dom node you specify while
    // calling render. This is most commonly <div id="root"></div>
    return {} as Pixel8.HostContext
  },

  // This function provides a way to access context from the parent and also
  // a way to pass some context to the immediate children of the current node.
  // Context is basically a regular object containing some information.
  getChildHostContext(_parentHostContext, _type, _rootContainerInstance) {
    // This can contain any data that you want to pass down to immediate child
    return {} as Pixel8.HostContext
  },

  // If the function returns true, the text would be created inside the host
  // element and no new text element would be created separately.
  shouldSetTextContent(_type, _props) {
    // We want false so that even text is represented by an element instance
    return false
  },

  // Helps with deprioritizing offscreen stuff
  shouldDeprioritizeSubtree(_type, _props) {
    return false
  },

  // Here we specify how should renderer handle the text content
  createTextInstance(
    text,
    rootContainerInstance,
    _hostContext,
    _internalInstanceHandle,
  ) {
    // The reconciler is currently at the leaf text node in our traversal.
    // Once it finishes text creation operation, it will move back up and
    // call createInstance on the enclosing element.
    return createElement('text', { text }, rootContainerInstance)
  },

  // Create instance is called on all host nodes except the leaf text nodes
  createInstance(
    type,
    props,
    rootContainerInstance,
    _hostContext,
    _internalInstanceHandle,
  ) {
    // At this point it is important to understand that we are coming back up
    // from recursion.So all child nodes have been instantiated and created.
    // Hence, right after creating instance, we will need to attach the
    // children to this node and that will be done in appendInitialChild.
    return createElement(type, props, rootContainerInstance)
  },

  // This function should return a payload object. Payload is a Javascript
  // object that can contain information on what needs to be changed on this
  // host element. If returned true,
  prepareUpdate(
    _instance,
    _type,
    oldProps,
    newProps,
    _rootContainerInstance,
    _hostContext,
  ) {
    // Prepare update is called first on the node, where the prop change occurs
    // and then it is called on all the tree nodes recursively. This method can
    // be used to hint the reconciler whether an update needs to be performed
    // on this node or not. If this function doesnt return anything, then
    // reconciler decides whether the update should be performed on this node
    // or not based on its algorithm.
    return {}
  },

  // 🔔 TODO
  // Here we perform all updates that we queued using prepareUpdate method. We
  // will get the instance, the updatePayload, old and new props etc. This is
  // where we should do all our dom manupulation work if needed.
  commitUpdate(
    instance,
    _updatePayload,
    _type,
    _oldProps,
    newProps,
    _internalInstanceHandle,
  ) {
    // console.log('commitUpdate', newProps)
    instance.applyProps(newProps)
  },

  // Here we perform the actual dom update on the textNode.
  commitTextUpdate(_textInstance, _oldText, _newText) {
    // noop
  },

  // Attach the child dom node to the parent on the initial render phase
  appendInitialChild(parentInstance, child) {
    // console.log('appendInitialChild', child.type)
    parentInstance.appendChild(child)
  },

  // This function is called whenever a new element needs to be inserted into a
  // parent element at the end. For example:
  // ```
  // <div>
  //   <p>test</p>
  //   {this.state.test === "yolo" && <button>Hello</button>}
  // </div>
  // ```
  appendChild(parentInstance, child) {
    // console.log('appendChild', child.type)
    parentInstance.appendChild(child)
  },

  // Here we will attach our in-memory tree to the root host div.
  // But this function only works if we set supportsMutation:true.
  appendChildToContainer(_container, _child) {
    if (_container instanceof HTMLCanvasElement) return
    // console.log('appendChildToContainer', _container, _child)
    // Can't append pixel dom to real DOM, so this is a noop
  },

  // This function is called whenever a new element needs to be inserted before
  // a child element inside the parent element. For example:
  // ```
  // <div>
  //   <p>test</p>
  //  {this.state.test === "yolo" && <button>Hello</button>}
  //   <p>test2</p>
  // </div>
  // ```
  // So here when state.test becomes yolo. This function will be called with
  // parentInstance = div, beforeChild = p(test2) , child = button
  // in the commit Phase.
  insertBefore(parentInstance, child, beforeChild) {
    parentInstance.insertBefore(child, beforeChild)
  },

  // This function is called whenever an element needs to insertedBefore the top
  // most level component(Root component) itself. For Example:
  // ```
  // const App = () => (
  //   <>
  //     {this.state.test === 'yolo' && <button>Hello</button>}
  //     <div> World</div>
  //   </>
  // )
  // ```
  // So here when state.test becomes yolo.This function will be called with
  // container = root#div and child = div(World) and beforeChild = button
  // in the commit Phase.
  insertInContainerBefore(_container, _child, _beforeChild) {
    if (_container instanceof HTMLCanvasElement) return
    // console.log('removeChildFromContainer', _container, _child, _beforeChild)
  },

  // This is called whenever an element needs to be removed from its parent
  removeChild(parentInstance, child) {
    parentInstance.removeChild(child)
  },

  // This function is called whenever an element is present at the top level as
  // this <button> and needs to be removed.For Example:
  // ```
  // const App = () => (
  //   <>
  //     {this.state.test === 'yolo' && <button>Hello</button>}
  //     <div> World</div>
  //   </>
  // )
  // ```
  // So here when state.test becomes NOT yolo. This function will be called
  // with container = root#div and child=button in the commit Phase.
  removeChildFromContainer(_container, _child) {
    if (_container instanceof HTMLCanvasElement) return
    // console.log('removeChildFromContainer', _container, _child)
  },

  // If true, the commitMount method will be called after the all elements of
  // the tree have been rendered (even after resetAfterCommit)
  finalizeInitialChildren(
    parentInstance,
    type,
    _props,
    _rootContainerInstance,
    _hostContext,
  ) {
    // Remember that the parent of the current node hasn’t been instantiated
    // yet. So the reconciler will go up and call
    // createInstance → appendInitialChild → finalizeInitialChildren
    // on the parent. This cycle will happen till we reach the top of the
    // recursion tree.
    return type === 'root'
  },

  // This function is called for every element that has set the return value
  // of finalizeInitialChildren to true. This method is called after all the
  // steps are done (ie after resetAfterCommit), meaning the entire tree has
  // been attached to the dom.
  commitMount(instance, _type, _newProps, _internalInstanceHandle) {
    // console.log('commitMount!!!!!!!!!')
    // Call root.draw() immediately before timer kicks in
    instance.update()
    instance.draw()
  },

  // This is called when we have made a in-memory render tree of all the views.
  prepareForCommit(_containerInfo) {
    // Here we can do any preparation that needs to be done on the
    // rootContainer before attaching the in memory render tree. For example:
    // In the case of react- dom, it keeps track of all the currently focused
    // elements, disabled events temporarily, etc.
  },

  // This function gets executed after the inmemory tree has been attached to
  // the root dom element
  resetAfterCommit(_containerInfo) {
    // Here we can do any post attach operations that needs to be done.
    // For example: react-dom re-enabled events which were temporarily
    // disabled in prepareForCommit and refocuses elements, etc.
  },
}

// Create the Pixel8 renderer
const Pixl8r = Reconciler(hostConfig)

// Map top-level HTMLCanvasElement to its Fiber
const CONTAINERS = new Map<HTMLCanvasElement, Fiber>()

// Renders the top-level Pixel8 Element into its root DOM Element
export function render(
  element: ReactElement,
  rootElement: HTMLCanvasElement,
  callback?: () => void,
) {
  if (!CONTAINERS.has(rootElement)) {
    // console.log('CREATE CONTAINER')
    const isAsync = false
    const container: Fiber = Pixl8r.createContainer(rootElement, isAsync)
    CONTAINERS.set(rootElement, container)
  }
  const parentComponent = null
  const container = CONTAINERS.get(rootElement)
  Pixl8r.updateContainer(element, container, parentComponent, callback)
  return Pixl8r.getPublicRootInstance(container) as PixelElement
}

// Unmounts the top-level Pixel8 Element
export function unmountComponentAtNode(element: HTMLCanvasElement) {
  // console.log('UNMOUNT')
  const container = CONTAINERS.get(element)
  if (!container) return
  const root: PixelElement = Pixl8r.getPublicRootInstance(container)
  root.destroy()
  Pixl8r.updateContainer(null, container, null, () =>
    CONTAINERS.delete(element),
  )
}
