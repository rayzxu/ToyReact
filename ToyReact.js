class ElementWrapper {
    constructor(type) {
        this.root = document.createElement(type)
    }
    setAttribute(name, value) {
        this.root.setAttribute(name, value)
    }
    appendChild(vchild) {
        console.log(vchild ,vchild.mountTo)
        vchild.mountTo(this.root)
    }
    mountTo(parent) {
        parent.appendChild(this.root)
    }
} 

export class Component {
    constructor() {
        this.children = []
    }
    setAttribute (name, value) {
        this[name] = value
    } 
    mountTo(parent) {
        let vdom = this.render()
        vdom.mountTo(parent)
    }
    appendChild(vchild) {
        this.children.push(vchild)
    }
}

class TextWrapper {
    constructor(type) {
        this.root = document.createTextNode(type)
    }
    mountTo(parent) {
        parent.appendChild(this.root)
    }
} 


export let ToyReact = {
    createElement(type, attributes, ...children) {
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
        vdom.mountTo(element)
    },
}