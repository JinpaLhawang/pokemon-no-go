'use strict';

const React = require('react');
const Cookie = require('react-cookie');
const moment = require('moment');

const client = require('./client');
const follow = require('./follow');
const stompClient = require('./websocket-listener');

const User = require('./user');
const WildPokemonList = require('./wild-pokemon-list');
const UserPokemonList = require('./user-pokemon-list');
const PokemonList = require('./pokemon-list');
const CreateDialog = require('./create-dialog');

const root = '/api';

class App extends React.Component {

  constructor(props) {
    super(props);
    Cookie.save('UserName', 'JinpaLhawang');
    this.state = {
      user: {
        name: Cookie.load('UserName'),
        level: 1,
        experiencePoints: 0,
        stardust: 0
      },
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

    this.switchUser = this.switchUser.bind(this);
    this.switchToJinpaLhawang = this.switchToJinpaLhawang.bind(this);
    this.switchToRaoul = this.switchToRaoul.bind(this);

    this.loadUser = this.loadUser.bind(this);
    this.reloadUser = this.reloadUser.bind(this);

    this.updateUserPokemonListPageSize = this.updateUserPokemonListPageSize.bind(this);
    this.onUserPokemonListNavigate = this.onUserPokemonListNavigate.bind(this);
    this.updatePokemonListPageSize = this.updatePokemonListPageSize.bind(this);
    this.onPokemonListNavigate = this.onPokemonListNavigate.bind(this);

    this.onWildPokemonCapture = this.onWildPokemonCapture.bind(this);
    this.onCreate = this.onCreate.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onDelete = this.onDelete.bind(this);

    this.reloadWildPokemons = this.reloadWildPokemons.bind(this);
    this.refreshUserPokemonListCurrentPage = this.refreshUserPokemonListCurrentPage.bind(this);
    this.refreshUserPokemonListAndGoToLastPage = this.refreshUserPokemonListAndGoToLastPage.bind(this);
    this.refreshPokemonListCurrentPage = this.refreshPokemonListCurrentPage.bind(this);
    this.refreshPokemonListAndGoToLastPage = this.refreshPokemonListAndGoToLastPage.bind(this);
  }

  switchUser(name) {
    this.setState({
      user: {
        name: name,
        level: this.state.user.level,
        experiencePoints: this.state.user.experiencePoints,
        stardust: this.state.user.stardust
      }
    });
    this.loadUser(name);
    this.loadWildPokemons(name, this.state.wildPokemonList.pageSize);
    this.loadUserPokemonListFromServer(name, this.state.userPokemonList.pageSize)
  }

  switchToJinpaLhawang(e) {
    this.switchUser('JinpaLhawang');
  }

  switchToRaoul(e) {
    this.switchUser('Raoul');
  }

  // USER
  loadUser(name) {
    client({
      method: 'GET',
      path: '/api/users/search/findByName?name=' + name
    }).done(response => {
      const user = response.entity;
      this.setState({
        user: {
          name: user.name,
          level: user.level,
          experiencePoints: user.experiencePoints,
          stardust: user.stardust
        }
      });
    });
  }

  reloadUser() {
    this.loadUser(this.state.user.name);
  }

  // WILD POKEMON
  loadWildPokemons(userName, pageSize) {
    let relArray = [
      'wildPokemons',
      'search',
      {
        rel: 'findByAvailableIsTrueAndTaggedByUserNot',
        params: {
          date: moment().format('YYYY-MM-DDThh:mm:ss.SSSZZ'),
          userId: userName,
          size: pageSize
        }
      }
    ];
    follow(client, root, relArray).then(wildPokemonCollection => {
      this.setState({
        wildPokemonList: {
          wildPokemons: wildPokemonCollection.entity._embedded.wildPokemons,
          links: wildPokemonCollection.entity._links,
          pageSize: pageSize,
          page: wildPokemonCollection.entity.page
        }
      });
    });
  }

  reloadWildPokemons(message) {
    this.loadWildPokemons(this.state.user.name, this.state.wildPokemonList.pageSize);
  }

  // WILD POKEMON
  loadUserPokemonListFromServer(userName, pageSize) {
    let relArray = [
      'userPokemons',
      'search',
      { rel: 'findByUserId', params: { userId: userName, size: pageSize } }
    ];
    follow(client, root, relArray).then(userPokemonCollection => {
      this.setState({
        userPokemonList: {
          userPokemons: userPokemonCollection.entity._embedded.userPokemons,
          links: userPokemonCollection.entity._links,
          pageSize: pageSize,
          page: userPokemonCollection.entity.page
        }
      });
    });
  }

  // POKEMON
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
      this.loadUserPokemonListFromServer(this.state.user.name, pageSize);
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
  onWildPokemonCapture(userName, wildPokemon) {
    client({
      method: 'GET',
      path: '/api/' + userName + '/' + wildPokemon.id + '/capture'
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
  refreshUserPokemonListAndGoToLastPage(message) {
    let relArray = [
      'userPokemons',
      'search',
      {
        rel: 'findByUserId',
        params: {
          userId: this.state.user.name,
          size: this.state.userPokemonList.pageSize
        }
      }
    ];
    follow(client, root, relArray).done(userPokemonCollection => {
      if (userPokemonCollection.entity._links.last !== undefined) {
        this.onUserPokemonListNavigate(userPokemonCollection.entity._links.last.href);
      } else {
        this.onUserPokemonListNavigate(userPokemonCollection.entity._links.self.href);
      }
    });
  }

  refreshUserPokemonListCurrentPage(message) {
    if (this.state.userPokemonList.userPokemons.length === 1) {
      this.refreshUserPokemonListAndGoToLastPage(message);
    } else {
      let relArray = [
        'userPokemons',
        'search',
        {
          rel: 'findByUserId',
          params: {
            userId: this.state.user.name,
            size: this.state.userPokemonList.pageSize,
            page: this.state.userPokemonList.page.number
          }
        }
      ];
      follow(client, root, relArray).then(userPokemonCollection => {
        this.setState({
          userPokemonList: {
            userPokemons: userPokemonCollection.entity._embedded.userPokemons,
            links: userPokemonCollection.entity._links,
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

    // User
    this.loadUser(this.state.user.name);
    stompClient.register([
      { route: '/topic/updateUser', callback: this.reloadUser }
    ]);

    // Wild Pokemon
    this.loadWildPokemons(this.state.user.name, this.state.wildPokemonList.pageSize);
    stompClient.register([
      { route: '/topic/newWildPokemon', callback: this.reloadWildPokemons },
      { route: '/topic/updateWildPokemon', callback: this.reloadWildPokemons },
      { route: '/topic/deleteWildPokemon', callback: this.reloadWildPokemons }
    ]);

    // User Pokemon
    this.loadUserPokemonListFromServer(this.state.user.name, this.state.userPokemonList.pageSize);
    stompClient.register([
      { route: '/topic/newUserPokemon', callback: this.refreshUserPokemonListAndGoToLastPage },
      { route: '/topic/updateUserPokemon', callback: this.refreshUserPokemonListCurrentPage },
      { route: '/topic/deleteUserPokemon', callback: this.refreshUserPokemonListCurrentPage }
    ]);

    // Pokemon
    this.loadPokemonListFromServer(this.state.pokemonList.pageSize);
    stompClient.register([
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

        <a href="#" onClick={ this.switchToJinpaLhawang }>
          JinpaLhawang
        </a>
        &nbsp;|&nbsp;
        <a href="#" onClick={ this.switchToRaoul }>
          Raoul
        </a>

        <div className="row">

          <div className="col-md-4">Communication (Logs/Notifications)</div>

          <div className="col-md-4">
            <WildPokemonList
                userName={ this.state.user.name }
                wildPokemons={ this.state.wildPokemonList.wildPokemons }
                links={ this.state.wildPokemonList.links }
                attributes={ this.state.wildPokemonList.attributes }
                pageSize={ this.state.wildPokemonList.pageSize }
                page={ this.state.wildPokemonList.page }
                onWildPokemonCapture={ this.onWildPokemonCapture }
            />
          </div>

          <div className="col-md-4">
            <User user={ this.state.user } />
          </div>

        </div>

        <UserPokemonList
            userName={ this.state.user.name }
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
