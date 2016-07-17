'use strict';

const React = require('react');

const WildPokemon = require('./wild-pokemon');

class WildPokemonList extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.wildPokemons) {
      var wildPokemons = this.props.wildPokemons.map(wildPokemon =>
      <WildPokemon
          key={ wildPokemon._links.self.href }
          wildPokemon={ wildPokemon }
          attributes={ this.props.attributes }
      />
    );
    }

    return (
      <div>

      <h3>Wild Pokemons</h3>

        <table>
          <tr>
            <th>Number</th>
            <th>Name</th>
            <th>Type</th>
            <th>Combat Points</th>
            <th>Health Points</th>
          </tr>
          { wildPokemons }
        </table>

      </div>
    )
  }

}

module.exports = WildPokemonList;
