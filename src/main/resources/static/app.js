'use strict';

const React = require('react');
const client = require('./client');

const follow = require('./follow');

const stompClient = require('./websocket-listener');

const CreateDialog = require('./create-dialog');
const PokemonList = require('./pokemon-list');

const root = '/api';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { pokemons: [], attributes: [], page: 1, pageSize: 5, links: {} };
    this.updatePageSize = this.updatePageSize.bind(this);
    this.onNavigate = this.onNavigate.bind(this);
    this.onCreate = this.onCreate.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.refreshCurrentPage = this.refreshCurrentPage.bind(this);
    this.refreshAndGoToLastPage = this.refreshAndGoToLastPage.bind(this);
  }

  loadFromServer(pageSize) {
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
        pokemons: pokemonCollection.entity._embedded.pokemons,
        links: pokemonCollection.entity._links,
        attributes: Object.keys(this.schema.properties),
        pageSize: pageSize,
        page: pokemonCollection.entity.page
      });
    });
  }

  updatePageSize(pageSize) {
    if (pageSize !== this.state.pageSize) {
      this.loadFromServer(pageSize);
    }
  }

  onNavigate(navUri) {
    client({
      method: 'GET',
      path: navUri
    }).done(pokemonCollection => {
      this.setState({
        pokemons: pokemonCollection.entity._embedded.pokemons,
        links: pokemonCollection.entity._links,
        attributes: this.state.attributes,
        pageSize: this.state.pageSize,
        page: pokemonCollection.entity.page
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

  refreshAndGoToLastPage(message) {
    let relArray = [ { rel: 'pokemons', params: { size: this.state.pageSize } } ];
    follow(client, root, relArray).done(response => {
      if (response.entity._links.last !== undefined) {
        this.onNavigate(response.entity._links.last.href);
      } else {
        this.onNavigate(response.entity._links.self.href);
      }
    });
  }

  refreshCurrentPage(message) {
    if (this.state.pokemons.length === 1) {
      this.refreshAndGoToLastPage(message);
    } else {
      let relArray = [
        {
          rel: 'pokemons',
          params: {
            size: this.state.pageSize,
            page: this.state.page.number
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
          pokemons: pokemonCollection.entity._embedded.pokemons,
          links: pokemonCollection.entity._links,
          attributes: Object.keys(this.schema.properties),
          pageSize: this.state.pageSize,
          page: pokemonCollection.entity.page
        });
      });
    }
  }

  componentDidMount() {
    this.loadFromServer(this.state.pageSize);
    stompClient.register([
      { route: '/topic/newPokemon', callback: this.refreshAndGoToLastPage },
      { route: '/topic/updatePokemon', callback: this.refreshCurrentPage },
      { route: '/topic/deletePokemon', callback: this.refreshCurrentPage }
    ]);
  }

  // TODO: Can order attributes?
  render() {
    return (
      <div>

        <CreateDialog
            attributes={ this.state.attributes }
            onCreate={ this.onCreate }
        />

        <PokemonList
            pokemons={ this.state.pokemons } 
            links={ this.state.links }
            attributes={ this.state.attributes }
            pageSize={ this.state.pageSize }
            page={ this.state.page }
            updatePageSize={ this.updatePageSize }
            onNavigate={ this.onNavigate }
            onUpdate={ this.onUpdate }
            onDelete={ this.onDelete }
        />

      </div>
    );
  }

}

React.render(
  <App />,
  document.getElementById('react')
)
