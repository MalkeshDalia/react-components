import React from 'react';
import { Dropdown } from '../../src';

const Example = React.createClass({

  propTypes: {},

  getTemplate() {
    return (
      <div>
        <Dropdown>
          <p>one</p>
          <p>deux</p>
          <p>tres</p>
          <p>quattro</p>
        </Dropdown>
      </div>
    );
  },

  render() {
    return this.getTemplate();
  }

});

export default Example;
