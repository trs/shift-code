import React from 'react';
import {render} from 'ink';
import meow from 'meow';

import App from './App';

const cli = meow(``);

render(React.createElement(App, cli.flags));