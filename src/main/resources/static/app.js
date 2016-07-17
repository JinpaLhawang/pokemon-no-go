'use strict';

const React = require('react');

const client = require('./client');
const follow = require('./follow');
const stompClient = require('./websocket-listener');

const WildPokemonList = require('./wild-pokemon-list');
const PokemonList = require('./pokemon-list');
const CreateDialog = require('./create-dialog');

const root = '/api';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      wildPokemonList: {
        wildPokemons: [],
        attributes: [],
        page: 1,
        pageSize: 9,
        links: {}
      },
      pokemonList: {
        pokemons: [],
        attributes: [],
        page: 1,
        pageSize: 50,
        links: {}
      }
    };

    this.updatePageSize = this.updatePageSize.bind(this);
    this.onNavigate = this.onNavigate.bind(this);
    this.onCreate = this.onCreate.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onDelete = this.onDelete.bind(this);

    this.refreshWildPokemonList = this.refreshWildPokemonList.bind(this);
    this.refreshCurrentPage = this.refreshCurrentPage.bind(this);
    this.refreshAndGoToLastPage = this.refreshAndGoToLastPage.bind(this);
  }

  loadWildPokemonListFromServer(pageSize) {
    let relArray = [ { rel: 'wildPokemons', params: { size: pageSize } } ];
    follow(client, root, relArray).then(wildPokemonCollection => {
      return client({
        method: 'GET',
        path: wildPokemonCollection.entity._links.profile.href,
        headers: { 'Accept': 'application/schema+json' }
      }).then(schema => {
        this.schema = schema.entity;
        return wildPokemonCollection;
      });
    }).done(wildPokemonCollection => {
      this.setState({
        wildPokemonList: {
          wildPokemons: wildPokemonCollection.entity._embedded.wildPokemons,
          links: wildPokemonCollection.entity._links,
          attributes: Object.keys(this.schema.properties),
          pageSize: pageSize,
          page: wildPokemonCollection.entity.page
        }
      });
    });
  }

  loadPokemonListFromServer(pageSize) {
    let relArray = [ { rel: 'pokemons', params: { size: pageSize } } ];
    follow(client, root, relArray).then(pokemonCollection => {
      return client({
        method: 'GET',
        path: pokemonCollection.entity._links.profile.href,
        headers: { 'Accept': 'application/schema+json' }
      }).then(schema => {
        this.schema = schema.entity;
        return pokemonCollection;
      });
    }).done(pokemonCollection => {
      this.setState({
        pokemonList: {
          pokemons: pokemonCollection.entity._embedded.pokemons,
          links: pokemonCollection.entity._links,
          attributes: Object.keys(this.schema.properties),
          pageSize: pageSize,
          page: pokemonCollection.entity.page
        }
      });
    });
  }

  updatePageSize(pageSize) {
    if (pageSize !== this.state.pokemonList.pageSize) {
      this.loadPokemonListFromServer(pageSize);
    }
  }

  onNavigate(navUri) {
    client({
      method: 'GET',
      path: navUri
    }).done(pokemonCollection => {
      this.setState({
        pokemonList: {
          pokemons: pokemonCollection.entity._embedded.pokemons,
          links: pokemonCollection.entity._links,
          attributes: this.state.pokemonList.attributes,
          pageSize: this.state.pokemonList.pageSize,
          page: pokemonCollection.entity.page
        }
      });
    });
  }

  onCreate(newPokemon) {
    let relArray = [ 'pokemons' ];
    follow(client, root, relArray).done(response => {
      return client({
        method: 'POST',
        path: response.entity._links.self.href,
        entity: newPokemon,
        headers: { 'Content-Type': 'application/json' }
      })
    });
  }

  onUpdate(pokemon, updatedPokemon) {
    client({
      method: 'PUT',
      path: pokemon._links.self.href,
      entity: updatedPokemon,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  onDelete(pokemon) {
    client({
      method: 'DELETE',
      path: pokemon._links.self.href
    });
  }

  refreshWildPokemonList(message) {
    let relArray = [
      {
        rel: 'wildPokemons',
        params: {
          size: this.state.wildPokemonList.pageSize,
          page: this.state.wildPokemonList.page.number
        }
      }
    ];
    follow(client, root, relArray).then(wildPokemonCollection => {
      return client({
        method: 'GET',
        path: wildPokemonCollection.entity._links.profile.href,
        headers: { 'Accept': 'application/schema+json' }
      }).then(schema => {
        this.schema = schema.entity;
        return wildPokemonCollection;
      });
    }).done(wildPokemonCollection => {
      this.setState({
        wildPokemonList: {
          wildPokemons: wildPokemonCollection.entity._embedded.wildPokemons,
          links: wildPokemonCollection.entity._links,
          attributes: Object.keys(this.schema.properties),
          pageSize: this.state.wildPokemonList.pageSize,
          page: wildPokemonCollection.entity.page
        }
      });
    });
  }

  refreshAndGoToLastPage(message) {
    let relArray = [ { rel: 'pokemons', params: { size: this.state.pokemonList.pageSize } } ];
    follow(client, root, relArray).done(response => {
      if (response.entity._links.last !== undefined) {
        this.onNavigate(response.entity._links.last.href);
      } else {
        this.onNavigate(response.entity._links.self.href);
      }
    });
  }

  refreshCurrentPage(message) {
    if (this.state.pokemonList.pokemons.length === 1) {
      this.refreshAndGoToLastPage(message);
    } else {
      let relArray = [
        {
          rel: 'pokemons',
          params: {
            size: this.state.pokemonList.pageSize,
            page: this.state.pokemonList.page.number
          }
        }
      ];
      follow(client, root, relArray).then(pokemonCollection => {
        return client({
          method: 'GET',
          path: pokemonCollection.entity._links.profile.href,
          headers: { 'Accept': 'application/schema+json' }
        }).then(schema => {
          this.schema = schema.entity;
          return pokemonCollection;
        });
      }).done(pokemonCollection => {
        this.setState({
          pokemonList: {
            pokemons: pokemonCollection.entity._embedded.pokemons,
            links: pokemonCollection.entity._links,
            attributes: Object.keys(this.schema.properties),
            pageSize: this.state.pokemonList.pageSize,
            page: pokemonCollection.entity.page
          }
        });
      });
    }
  }

  componentDidMount() {
    this.loadWildPokemonListFromServer(this.state.wildPokemonList.pageSize);
    this.loadPokemonListFromServer(this.state.pokemonList.pageSize);
    stompClient.register([
      { route: '/topic/newPokemon', callback: this.refreshAndGoToLastPage },
      { route: '/topic/updatePokemon', callback: this.refreshCurrentPage },
      { route: '/topic/deletePokemon', callback: this.refreshCurrentPage },
      { route: '/topic/newWildPokemon', callback: this.refreshWildPokemonList },
      { route: '/topic/updateWildPokemon', callback: this.refreshWildPokemonList },
      { route: '/topic/deleteWildPokemon', callback: this.refreshWildPokemonList }
    ]);
  }

  render() {
    return (
      <div>

        <h1>Pokemon No Go</h1>

        <WildPokemonList
            wildPokemons={ this.state.wildPokemonList.wildPokemons }
            links={ this.state.wildPokemonList.links }
            attributes={ this.state.wildPokemonList.attributes }
            pageSize={ this.state.wildPokemonList.pageSize }
            page={ this.state.wildPokemonList.page }
        />

        <PokemonList
            pokemons={ this.state.pokemonList.pokemons }
            links={ this.state.pokemonList.links }
            attributes={ this.state.pokemonList.attributes }
            pageSize={ this.state.pokemonList.pageSize }
            page={ this.state.pokemonList.page }
            updatePageSize={ this.updatePageSize }
            onNavigate={ this.onNavigate }
            onUpdate={ this.onUpdate }
            onDelete={ this.onDelete }
        />

        <CreateDialog
            attributes={ this.state.pokemonList.attributes }
            onCreate={ this.onCreate }
        />

      </div>
    );
  }

}

React.render(
  <App />,
  document.getElementById('react')
)
