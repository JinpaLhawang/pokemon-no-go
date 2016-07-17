'use strict';

const React = require('react');

const UserPokemon = require('./user-pokemon');

class UserPokemonList extends React.Component {

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
      this.props.updateUserPokemonListPageSize(pageSize);
    } else {
      React.findDOMNode(this.refs.pageSize).value =
        pageSize.substring(0, pageSize.length - 1);
    }
  }

  handleNavFirst(e) {
    e.preventDefault();
    this.props.onUserPokemonListNavigate(this.props.links.first.href);
  }

  handleNavPrev(e) {
    e.preventDefault();
    this.props.onUserPokemonListNavigate(this.props.links.prev.href);
  }

  handleNavNext(e) {
    e.preventDefault();
    this.props.onUserPokemonListNavigate(this.props.links.next.href);
  }

  handleNavLast(e) {
    e.preventDefault();
    this.props.onUserPokemonListNavigate(this.props.links.last.href);
  }

  render() {
    var pageInfo = this.props.page.hasOwnProperty('number')
        ? <h3>User Pokemons - Page { this.props.page.number + 1 } of { this.props.page.totalPages }</h3>
        : <h3>User Pokemons</h3>;

    var userPokemons = this.props.userPokemons.map(userPokemon =>
      <UserPokemon
          key={ userPokemon._links.self.href }
          userPokemon={ userPokemon }
          attributes={ this.props.attributes }
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
            <th>Name</th>
            <th>Type</th>
            <th>Combat Points</th>
            <th>Health Points</th>
            <th>Candy Needed to Evolve</th>
          </tr>
          { userPokemons }
        </table>

        <div>{ navLinks }</div>

      </div>
    )
  }

}

module.exports = UserPokemonList;
