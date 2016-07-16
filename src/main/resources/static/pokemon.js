'use strict';

const React = require('react');

const UpdateDialog = require('./update-dialog');

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

module.exports = Pokemon;
