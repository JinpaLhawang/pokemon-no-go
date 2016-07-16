'use strict';

const React = require('react');
const client = require('./client');

const follow = require('./follow');

const stompClient = require('./websocket-listener');

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

class CreateDialog extends React.Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    var newPokemon = {};
    this.props.attributes.forEach(attribute => {
      newPokemon[attribute] = React.findDOMNode(this.refs[attribute]).value.trim();
    });
    this.props.onCreate(newPokemon);

    // clear out the dialog's inputs
    this.props.attributes.forEach(attribute => {
      React.findDOMNode(this.refs[attribute]).value = '';
    });

    // Navigate away from the dialog to hide it.
    window.location = '#';
  }

  render() {
    var inputs = this.props.attributes.map(attribute =>
      <p key={ attribute }>
        <input
            type="text"
            ref={ attribute }
            placeholder={ attribute }
            className="field"
        />
      </p>
    );

    return (
      <div>

        <a href="#createPokemon">
          Create
        </a>

        <div id="createPokemon" className="modalDialog">
          <div>

            <a href="#" title="Close" className="close">
              X
            </a>

            <h2>Create New Pokemon</h2>

            <form>
              { inputs }
              <button onClick={ this.handleSubmit }>
                Create
              </button>
            </form>

          </div>
        </div>

      </div>
    )
  }

}

class UpdateDialog extends React.Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    var updatedPokemon = {};
    this.props.attributes.forEach(attribute => {
      updatedPokemon[attribute] = React.findDOMNode(this.refs[attribute]).value.trim();
    });
    this.props.onUpdate(this.props.pokemon, updatedPokemon);
    window.location = '#';
  }

  render() {
    var inputs = this.props.attributes.map(attribute =>
      <p key={ this.props.pokemon[attribute] }>
        <input
            type="text"
            ref={ attribute }
            defaultValue={ this.props.pokemon[attribute] }
            placeholder={ attribute }
            className="field"
        />
      </p>
    );

    var dialogId = "updatePokemon-" + this.props.pokemon._links.self.href;

    return (
      <div>

        <a href={ "#" + dialogId }>
          Update
        </a>

        <div id={ dialogId } className="modalDialog">
          <div>

            <a href="#" title="Close" className="close">
              X
            </a>

            <h2>Update a Pokemon</h2>

            <form>
              { inputs }
              <button onClick={ this.handleSubmit }>
                Update
              </button>
            </form>

          </div>
        </div>

      </div>
    )
  }

}

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
      this.props.updatePageSize(pageSize);
    } else {
      React.findDOMNode(this.refs.pageSize).value =
        pageSize.substring(0, pageSize.length - 1);
    }
  }

  handleNavFirst(e) {
    e.preventDefault();
    this.props.onNavigate(this.props.links.first.href);
  }

  handleNavPrev(e) {
    e.preventDefault();
    this.props.onNavigate(this.props.links.prev.href);
  }

  handleNavNext(e) {
    e.preventDefault();
    this.props.onNavigate(this.props.links.next.href);
  }

  handleNavLast(e) {
    e.preventDefault();
    this.props.onNavigate(this.props.links.last.href);
  }

  render() {
    var pageInfo = this.props.page.hasOwnProperty('number') ?
        <h3>Pokemons - Page { this.props.page.number + 1 } of { this.props.page.totalPages }</h3> : null;

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
            <th>Combat Points</th>
            <th>Health Points</th>
            <th>Candy Needed to Evolve</th>
            <th></th>
            <th></th>
          </tr>
          { pokemons }
        </table>

        <div>{ navLinks }</div>

      </div>
    )
  }

}

class Pokemon extends React.Component {

  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete() {
    this.props.onDelete(this.props.pokemon);
  }

  render() {
    return (
      <tr>
        <td>{ this.props.pokemon.number }</td>
        <td>{ this.props.pokemon.name }</td>
        <td>{ this.props.pokemon.type }</td>
        <td>{ this.props.pokemon.combatPoints }</td>
        <td>{ this.props.pokemon.healthPoints }</td>
        <td>{ this.props.pokemon.numCandyToEvolve } { this.props.pokemon.candyToEvolve }</td>
        <td>
          <UpdateDialog
              pokemon={ this.props.pokemon }
              attributes={ this.props.attributes }
              onUpdate={ this.props.onUpdate }
          />
        </td>
        <td>
          <button onClick={ this.handleDelete }>
            Delete
          </button>
        </td>
      </tr>
    )
  }

}

React.render(
  <App />,
  document.getElementById('react')
)
