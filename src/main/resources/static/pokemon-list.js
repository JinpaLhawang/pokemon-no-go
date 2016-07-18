'use strict';

const React = require('react');

const Pokemon = require('./pokemon');

class PokemonList extends React.Component {

  constructor(props) {
    super(props);
    this.handleInput = this.handleInput.bind(this);
    this.handleNavFirst = this.handleNavFirst.bind(this);
    this.handleNavPrev = this.handleNavPrev.bind(this);
    this.handleNavNext = this.handleNavNext.bind(this);
    this.handleNavLast = this.handleNavLast.bind(this);
  }

  handleInput(e) {
    e.preventDefault();
    var pageSize = React.findDOMNode(this.refs.pageSize).value;
    if (/^[0-9]+$/.test(pageSize)) {
      this.props.updatePokemonListPageSize(pageSize);
    } else {
      React.findDOMNode(this.refs.pageSize).value =
        pageSize.substring(0, pageSize.length - 1);
    }
  }

  handleNavFirst(e) {
    e.preventDefault();
    this.props.onPokemonListNavigate(this.props.links.first.href);
  }

  handleNavPrev(e) {
    e.preventDefault();
    this.props.onPokemonListNavigate(this.props.links.prev.href);
  }

  handleNavNext(e) {
    e.preventDefault();
    this.props.onPokemonListNavigate(this.props.links.next.href);
  }

  handleNavLast(e) {
    e.preventDefault();
    this.props.onPokemonListNavigate(this.props.links.last.href);
  }

  render() {
    var pageInfo = this.props.page.hasOwnProperty('number')
        ? <h3>Pokedex - Page { this.props.page.number + 1 } of { this.props.page.totalPages }</h3>
        : <h3>Pokedex</h3>;

    var pokemons = this.props.pokemons.map(pokemon =>
      <Pokemon
          key={ pokemon._links.self.href }
          pokemon={ pokemon }
          attributes={ this.props.attributes }
          onUpdate={ this.props.onUpdate }
          onDelete={ this.props.onDelete }
      />
    );

    var navLinks = [];
    if ('first' in this.props.links) {
      navLinks.push(<button key="first" onClick={ this.handleNavFirst }>&lt;&lt;</button>);
    }
    if ('prev' in this.props.links) {
      navLinks.push(<button key="prev" onClick={ this.handleNavPrev }>&lt;</button>);
    }
    if ('next' in this.props.links) {
      navLinks.push(<button key="next" onClick={ this.handleNavNext }>&gt;</button>);
    }
    if ('last' in this.props.links) {
      navLinks.push(<button key="last" onClick={ this.handleNavLast }>&gt;&gt;</button>);
    }

    return (
      <div>

        { pageInfo }

        <input
            ref="pageSize"
            defaultValue={ this.props.pageSize }
            onInput={ this.handleInput }
        />

        <table>
          <tr>
            <th>Number</th>
            <th>Name</th>
            <th>Type</th>
            <th>Candy Needed to Evolve</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
          { pokemons }
        </table>

        <div>{ navLinks }</div>

      </div>
    )
  }

}

module.exports = PokemonList;
