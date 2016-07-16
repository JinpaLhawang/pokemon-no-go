'use strict';

const React = require('react');

class UpdateDialog extends React.Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    var updatedPokemon = {};
    this.props.attributes.forEach(attribute => {
      updatedPokemon[attribute] = React.findDOMNode(this.refs[attribute]).value.trim();
    });
    this.props.onUpdate(this.props.pokemon, updatedPokemon);
    window.location = '#';
  }

  render() {
    var inputs = this.props.attributes.map(attribute =>
      <p key={ this.props.pokemon[attribute] }>
        <input
            type="text"
            ref={ attribute }
            defaultValue={ this.props.pokemon[attribute] }
            placeholder={ attribute }
            className="field"
        />
      </p>
    );

    var dialogId = "updatePokemon-" + this.props.pokemon._links.self.href;

    return (
      <div>

        <a href={ "#" + dialogId }>
          Update
        </a>

        <div id={ dialogId } className="modalDialog">
          <div>

            <a href="#" title="Close" className="close">
              X
            </a>

            <h2>Update a Pokemon</h2>

            <form>
              { inputs }
              <button onClick={ this.handleSubmit }>
                Update
              </button>
            </form>

          </div>
        </div>

      </div>
    )
  }

}

module.exports = UpdateDialog;
