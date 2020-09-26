import React, {useState} from 'react';
import meow from 'meow';

// import Logout from './components/Logout';
// import Redeem from './components/Redeem';
// import Cache from './components/Cache';
import {Usage} from './features/usage';
import {Login} from './features/login';

type AppProps = meow.Result<meow.AnyFlags>;

const App: React.FC<AppProps> = (props) => {
  const [page] = useState<String>(props.input[0]);

  switch (page) {
    case 'login': return <Login />;
    // case 'logout': return <Logout />;
    // case 'redeem': return <Redeem />;
    // case 'cache': return <Cache />;
    default: return <Usage />;
  }
};

export default App;
