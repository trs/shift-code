import React, {useEffect, useState} from 'react';
import meow from 'meow';

import Login from './components/Login';
import Logout from './components/Logout';
import Redeem from './components/Redeem';
import Cache from './components/Cache';
import Usage from './components/Usage';

type AppProps = meow.Result<meow.AnyFlags>;

const App: React.FC<AppProps> = (props) => {
  switch (props.input[0]) {
    case 'login': return (<Login />);
    case 'logout': return (<Logout />);
    case 'redeem': return (<Redeem />);
    case 'cache': return (<Cache />);
    default: return (<Usage />);
  }
};

export default App;