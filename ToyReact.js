class ElementWrapper {
    constructor(type) {
        this.root = document.createElement(type)
    }
    setAttribute(name, value) {
        if (name.match(/^on([\s\S]+)$/)) { // 正则 /s表示空白 /S表示非空白 [\s\S]表示匹配on后的全部字符
            // console.log(RegExp.$1)
            // console.log(value)
            let eventName = RegExp.$1.replace(/^[\s\S]/, (s) => s.toLocaleLowerCase())
            this.root.addEventListener(eventName, value)
        }
        this.root.setAttribute(name, value)
    }
    appendChild(vchild) {
        // console.log(vchild ,vchild.mountTo)
        let range = document.createRange();
        if (this.root.children.length) {
            range.setStartAfter(this.root.lastChild)
            range.setEndAfter(this.root.lastChild)
        } else {
            range.setStart(this.root, 0)
            range.setEnd(this.root, 0)
        }
        vchild.mountTo(range)
    }
    mountTo(range) {
        range.deleteContents();
        range.insertNode(this.root)
        /* parent.appendChild(this.root) */
    }
} 

class TextWrapper {
    constructor(type) {
        this.root = document.createTextNode(type)
    }
    mountTo(range) {
        range.deleteContents();
        range.insertNode(this.root)
    }
} 

export class Component {
    constructor() {
        this.children = []
        this.props = Object.create(null) // Object.create(null) 方法创建的object比较干净，不会携带各种默认方法
    }
    setAttribute (name, value) {
        // console.log('name, value', name, value)
        this[name] = value
        this.props[name] = value
    } 
    mountTo(range) {
        this.range = range;
        this.update()
        /* let range = document.createRange();
        range.setStartAfter(parent.lastChild)
        range.setEndAfter(parent.lastChild) */
    }
    update() {
        let placeHolder = document.createComment("placeholder")
        let range = document.createRange();
        range.setStart(this.range.endContainer, this.range.endOffset)
        range.setEnd(this.range.endContainer, this.range.endOffset)
        range.insertNode(placeHolder)

        this.range.deleteContents();

        let vdom = this.render()
        vdom.mountTo(this.range)

        // placeHolder.parentNode.removeChild(placeHolder)

    }
    appendChild(vchild) {
        this.children.push(vchild)
    }
    setState(state) { // 增加promise可以变为异步render
        console.log('state', state)
        let merge = (oldState,newState) => {
            for(let p in newState) {
                if(typeof newState[p] === 'object') {
                    if(typeof oldState[p] !== 'object') {
                        oldState[p] = {}
                    }
                    merge(oldState[p], newState[p])
                } else {
                    oldState[p] = newState[p]
                }
            }
        }
        if(!this.state && state) {
            this.state = {}
        }
        merge(this.state, state)
        this.update()
        // console.log(this.state)
    }
}

export let ToyReact = {
    createElement(type, attributes, ...children) {
        // console.log(arguments)
        let element
        if (typeof type === 'string') {
            element = new ElementWrapper(type)
        } else {
            element = new type;
        }
        for (let name in attributes) {
            element.setAttribute(name, attributes[name])
        }
        let insertChildren = (children) => {
            for (let child of children) {
                if (typeof child === 'object' && child instanceof Array) {
                    insertChildren(child)
                } else {
                    if(child === null && child === void 0) {
                        child = ''
                    }
                    if (!(child instanceof Component) 
                    && !(child instanceof ElementWrapper) 
                    && !(child instanceof TextWrapper)) {
                        child = String(child)
                    }
                    if (typeof child === 'string') {
                        child = new TextWrapper(child)
                    }
                    // console.log(element.appendChild)
                    element.appendChild(child)
                }
            }
        }
        insertChildren(children)
        // console.log(element)
        return element
    },
    render(vdom, element) {
        let range = document.createRange();
        if (element.children.length) {
            range.setStartAfter(element.lastChild)
            range.setEndAfter(element.lastChild)
        } else {
            range.setStart(element, 0)
            range.setEnd(element, 0)
        }
        vdom.mountTo(range)
    },
}