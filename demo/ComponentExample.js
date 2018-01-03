import { hat, Component } from '';
import Icon from '';

// Good to have `style` properties because
// the components will be highly reusable and it won't
// matter if the user has a style-loader. Plus,
// we'll have dynamic styles. We should have `this.id`
// for dynamic styling

// `on=${{click, mousedown, etc}}` seems like the shortest
// syntax for addEventListener. If onclick is an array, it will
// be treated as [listener, options]

// We have to feed the class through a function, because
// the user would like to call component like so:
// hat`<some-html>${ DefaultButton(props) }</some-html>`

// We would also like to provide `hatParentNode` and `hatBoundNodes`
// properties in case the user wants to know where the component is.

// Is internal state important? Not sure. The user should potentially
// be encouraged to create any abstraction they want over top of the component.
// For example, maybe it's better to use a state machine. Hence, perhaps just
// using `this.props` would be sufficient. If so, `willGetProps` will be redundant.
// Still not sure though.

export const DefaultButton = hat(class extends Component {
  constructor() {
    this.hatParentNode;
    this.hatBoundNodes;
  }

  static style() {
    return hat`
      .DefaultButton {
        border: 1px solid black;
      }
    `
  }

  style() {
    return hat`
      #${this.id} {
        color: ${ this.props.color };
      }

      #${this.id} .DefaultButton__Icon {
        font-size: ${ this.props.fontSize };
      }
    `
  }

  render() {
    return hat`
      <button id=${this.id} class='DefaultButton' on=${{
        click: this,
        mousedown: this,
      }}>
        ${
          this.props.hasIcon && hat`
            <div class='DefaultButton__Icon'>
              ${ Icon(this.props.iconProps) }
            </div>
          `
        }
        <div class='DefaultButton__Content'>
          ${ this.props.children }
        </div>
      </button>
    `
  }

  willGetProps() {
    console.log('willGetProps');
  }

  willRender() {
    console.log('willRender');
  }

  didMount() {
    console.log('didMount');
  }

  willUnmount() {
    console.log('willUnmount');
  }

  handleEvent(e) {
    console.log('handleEvent', e);
  }
})