'use strict';

const React = require('react');

const client = require('./client');
const follow = require('./follow');
const stompClient = require('./websocket-listener');

const WildPokemonList = require('./wild-pokemon-list');
const UserPokemonList = require('./user-pokemon-list');
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
      userPokemonList: {
        userPokemons: [],
        attributes: [],
        page: 1,
        pageSize: 50,
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

    this.updateUserPokemonListPageSize = this.updateUserPokemonListPageSize.bind(this);
    this.onUserPokemonListNavigate = this.onUserPokemonListNavigate.bind(this);
    this.updatePokemonListPageSize = this.updatePokemonListPageSize.bind(this);
    this.onPokemonListNavigate = this.onPokemonListNavigate.bind(this);

    this.onWildPokemonCapture = this.onWildPokemonCapture.bind(this);
    this.onCreate = this.onCreate.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onDelete = this.onDelete.bind(this);

    this.refreshWildPokemonList = this.refreshWildPokemonList.bind(this);
    this.refreshUserPokemonListCurrentPage = this.refreshUserPokemonListCurrentPage.bind(this);
    this.refreshUserPokemonListAndGoToLastPage = this.refreshUserPokemonListAndGoToLastPage.bind(this);
    this.refreshPokemonListCurrentPage = this.refreshPokemonListCurrentPage.bind(this);
    this.refreshPokemonListAndGoToLastPage = this.refreshPokemonListAndGoToLastPage.bind(this);
  }

  // LOAD
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

  loadUserPokemonListFromServer(pageSize) {
    let relArray = [ { rel: 'userPokemons', params: { size: pageSize } } ];
    follow(client, root, relArray).then(userPokemonCollection => {
      return client({
        method: 'GET',
        path: userPokemonCollection.entity._links.profile.href,
        headers: { 'Accept': 'application/schema+json' }
      }).then(schema => {
        this.schema = schema.entity;
        return userPokemonCollection;
      });
    }).done(userPokemonCollection => {
      this.setState({
        userPokemonList: {
          userPokemons: userPokemonCollection.entity._embedded.userPokemons,
          links: userPokemonCollection.entity._links,
          attributes: Object.keys(this.schema.properties),
          pageSize: pageSize,
          page: userPokemonCollection.entity.page
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

  // NAVIGATION
  updateUserPokemonListPageSize(pageSize) {
    if (pageSize !== this.state.userPokemonList.pageSize) {
      this.loadUserPokemonListFromServer(pageSize);
    }
  }

  onUserPokemonListNavigate(navUri) {
    client({
      method: 'GET',
      path: navUri
    }).done(userPokemonCollection => {
      this.setState({
        userPokemonList: {
          userPokemons: userPokemonCollection.entity._embedded.userPokemons,
          links: userPokemonCollection.entity._links,
          attributes: this.state.userPokemonList.attributes,
          pageSize: this.state.userPokemonList.pageSize,
          page: userPokemonCollection.entity.page
        }
      });
    });
  }

  updatePokemonListPageSize(pageSize) {
    if (pageSize !== this.state.pokemonList.pageSize) {
      this.loadPokemonListFromServer(pageSize);
    }
  }

  onPokemonListNavigate(navUri) {
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

  // CRUD
  onWildPokemonCapture(wildPokemon) {
    console.log('Capturing wildPokemon', wildPokemon);
    client({
      method: 'GET',
      path: '/api/' + wildPokemon.id + '/capture'
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

  // REFRESH
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

  refreshUserPokemonListAndGoToLastPage(message) {
    let relArray = [ { rel: 'userPokemons', params: { size: this.state.userPokemonList.pageSize } } ];
    follow(client, root, relArray).done(response => {
      if (response.entity._links.last !== undefined) {
        this.onUserPokemonListNavigate(response.entity._links.last.href);
      } else {
        this.onUserPokemonListNavigate(response.entity._links.self.href);
      }
    });
  }

  refreshUserPokemonListCurrentPage(message) {
    if (this.state.userPokemonList.userPokemons.length === 1) {
      this.refreshUserPokemonListAndGoToLastPage(message);
    } else {
      let relArray = [
        {
          rel: 'userPokemons',
          params: {
            size: this.state.userPokemonList.pageSize,
            page: this.state.userPokemonList.page.number
          }
        }
      ];
      follow(client, root, relArray).then(userPokemonCollection => {
        return client({
          method: 'GET',
          path: userPokemonCollection.entity._links.profile.href,
          headers: { 'Accept': 'application/schema+json' }
        }).then(schema => {
          this.schema = schema.entity;
          return userPokemonCollection;
        });
      }).done(userPokemonCollection => {
        this.setState({
          userPokemonList: {
            userPokemons: userPokemonCollection.entity._embedded.userPokemons,
            links: userPokemonCollection.entity._links,
            attributes: Object.keys(this.schema.properties),
            pageSize: this.state.userPokemonList.pageSize,
            page: userPokemonCollection.entity.page
          }
        });
      });
    }
  }

  refreshPokemonListAndGoToLastPage(message) {
    let relArray = [ { rel: 'pokemons', params: { size: this.state.pokemonList.pageSize } } ];
    follow(client, root, relArray).done(response => {
      if (response.entity._links.last !== undefined) {
        this.onPokemonListNavigate(response.entity._links.last.href);
      } else {
        this.onPokemonListNavigate(response.entity._links.self.href);
      }
    });
  }

  refreshPokemonListCurrentPage(message) {
    if (this.state.pokemonList.pokemons.length === 1) {
      this.refreshPokemonListAndGoToLastPage(message);
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

  // INIT
  componentDidMount() {
    this.loadWildPokemonListFromServer(this.state.wildPokemonList.pageSize);
    this.loadUserPokemonListFromServer(this.state.userPokemonList.pageSize);
    this.loadPokemonListFromServer(this.state.pokemonList.pageSize);
    stompClient.register([
      { route: '/topic/newWildPokemon', callback: this.refreshWildPokemonList },
      { route: '/topic/updateWildPokemon', callback: this.refreshWildPokemonList },
      { route: '/topic/deleteWildPokemon', callback: this.refreshWildPokemonList },
      { route: '/topic/newUserPokemon', callback: this.refreshUserPokemonListAndGoToLastPage },
      { route: '/topic/updateUserPokemon', callback: this.refreshUserPokemonListCurrentPage },
      { route: '/topic/deleteUserPokemon', callback: this.refreshUserPokemonListCurrentPage },
      { route: '/topic/newPokemon', callback: this.refreshPokemonListAndGoToLastPage },
      { route: '/topic/updatePokemon', callback: this.refreshPokemonListCurrentPage },
      { route: '/topic/deletePokemon', callback: this.refreshPokemonListCurrentPage }
    ]);
  }

  // RENDER
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
            onWildPokemonCapture={ this.onWildPokemonCapture }
        />

        <UserPokemonList
            userPokemons={ this.state.userPokemonList.userPokemons }
            links={ this.state.userPokemonList.links }
            attributes={ this.state.userPokemonList.attributes }
            pageSize={ this.state.userPokemonList.pageSize }
            page={ this.state.userPokemonList.page }
            updateUserPokemonListPageSize={ this.updateUserPokemonListPageSize }
            onUserPokemonListNavigate={ this.onUserPokemonListNavigate }
        />

        <PokemonList
            pokemons={ this.state.pokemonList.pokemons }
            links={ this.state.pokemonList.links }
            attributes={ this.state.pokemonList.attributes }
            pageSize={ this.state.pokemonList.pageSize }
            page={ this.state.pokemonList.page }
            updatePokemonListPageSize={ this.updatePokemonListPageSize }
            onPokemonListNavigate={ this.onPokemonListNavigate }
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
