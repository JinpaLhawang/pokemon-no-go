'use strict';

const React = require('react');

class WildPokemon extends React.Component {

  constructor(props) {
    super(props);
    this.handleCapture = this.handleCapture.bind(this);
  }

  handleCapture() {
    this.props.onWildPokemonCapture(this.props.wildPokemon);
  }

  render() {
    return (
      <tr>
        <td>{ this.props.wildPokemon.name }</td>
        <td>
          <button onClick={ this.handleCapture }>
            Capture
          </button>
        </td>
      </tr>
    )
  }

}

module.exports = WildPokemon;
