'use strict';

const React = require('react');

class User extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h3>{ this.props.user.name }</h3>

        <p>Level: <strong>{ this.props.user.level }</strong></p>
        <p>Experience Points: <strong>{ this.props.user.exeriencePoints ? this.props.user.exeriencePoints : 0 }</strong></p>
        <p>Stardust: <strong>{ this.props.user.stardust ? this.props.user.stardust : 0 }</strong></p>

        <table>
          <tr>
            <th>Candy</th>
            <th>Amount</th>
          </tr>
        </table>

      </div>
    );
  }

}

module.exports = User;
