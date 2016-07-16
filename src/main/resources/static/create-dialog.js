'use strict';

const React = require('react');

class CreateDialog extends React.Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    var newPokemon = {};
    this.props.attributes.forEach(attribute => {
      newPokemon[attribute] = React.findDOMNode(this.refs[attribute]).value.trim();
    });
    this.props.onCreate(newPokemon);

    // clear out the dialog's inputs
    this.props.attributes.forEach(attribute => {
      React.findDOMNode(this.refs[attribute]).value = '';
    });

    // Navigate away from the dialog to hide it.
    window.location = '#';
  }

  render() {
    var inputs = this.props.attributes.map(attribute =>
      <p key={ attribute }>
        <input
            type="text"
            ref={ attribute }
            placeholder={ attribute }
            className="field"
        />
      </p>
    );

    return (
      <div>

        <a href="#createPokemon">
          Create
        </a>

        <div id="createPokemon" className="modalDialog">
          <div>

            <a href="#" title="Close" className="close">
              X
            </a>

            <h2>Create New Pokemon</h2>

            <form>
              { inputs }
              <button onClick={ this.handleSubmit }>
                Create
              </button>
            </form>

          </div>
        </div>

      </div>
    )
  }

}

module.exports = CreateDialog;
