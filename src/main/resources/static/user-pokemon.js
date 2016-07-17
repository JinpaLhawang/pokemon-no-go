'use strict';

const React = require('react');

class UserPokemon extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <tr>
        <td>{ this.props.userPokemon.name }</td>
        <td>{ this.props.userPokemon.type }</td>
        <td>{ this.props.userPokemon.combatPoints }</td>
        <td>{ this.props.userPokemon.healthPoints }</td>
        <td>{ this.props.userPokemon.numCandyToEvolve } { this.props.userPokemon.candyToEvolve }</td>
      </tr>
    )
  }

}

module.exports = UserPokemon;
