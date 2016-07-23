'use strict';

const React = require('react');

class UserCandy extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <tr>
        <td>{ this.props.candy.name }</td>
        <td>{ this.props.candy.amount }</td>
      </tr>
    )
  }

}

module.exports = UserCandy;
