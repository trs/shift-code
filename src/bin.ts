import React from 'react';
import {render} from 'ink';
import meow from 'meow';

import App from './App';

const cli = meow(`
  Usage
    $ shift-code login
    $ shift-code logout
    $ shift-code redeem [...codes]
    $ shift-code cache-clear
`);

render(React.createElement(App, cli));