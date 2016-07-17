'use strict';

const React = require('react');

class WildPokemon extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <tr>
        <td>{ this.props.wildPokemon.number }</td>
        <td>{ this.props.wildPokemon.name }</td>
        <td>{ this.props.wildPokemon.type }</td>
        <td>{ this.props.wildPokemon.combatPoints }</td>
        <td>{ this.props.wildPokemon.healthPoints }</td>
      </tr>
    )
  }

}

module.exports = WildPokemon;
