import { ToyReact, Component } from './ToyReact.js'

class Mycomponent extends Component {
    render() {
        return <div>
            <span>hello</span>
            <div>
                {true}
                {this.children}
            </div>
        </div>
    }
}

let a = <Mycomponent name="a">
    <div>12324</div>
</Mycomponent>

ToyReact.render(
    a,
    document.body
);