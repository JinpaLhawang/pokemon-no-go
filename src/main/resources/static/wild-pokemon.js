'use strict';

const React = require('react');

class WildPokemon extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <tr>
        <td>{ this.props.wildPokemon.name }</td>
        <td>
          <button onClick={ this.handleInspect }>
            Inspect
          </button>
        </td>
      </tr>
    )
  }

}

module.exports = WildPokemon;
