import React, {useEffect, useState} from 'react';
import {Box, Text, Color} from 'ink';
import { Tabs, Tab } from 'ink-tab';
import { UncontrolledTextInput } from 'ink-text-input'
import Spinner from 'ink-spinner';
import cliCursor from 'cli-cursor';

import Home from './components/Home';
import Login from './components/Login';

import { Session, account } from 'shift-code-api';
import {loadContents, SESSION_FILE} from './store';

enum TabPage {
  Account = 'account',
  Redeem = 'redeem'
}

const App = () => {
  const [tab, setTab] = useState(TabPage.Account);

  useEffect(() => {
    // (async () => {
    //   try {
    //     cliCursor.hide();
        
    //     const session = await loadContents<Session>(SESSION_FILE);
    //     if (!session.token) {
    //       setLoadingState(LoadingState.Login);
    //       return;
    //     }

    //     const acc = await account(session);

    //     setLoadingState(LoadingState.Home);

    //   } catch (err) {
    //     setError(err.message)
    //   } finally {
    //     cliCursor.show();
    //   }
    // })();
  }, []);

  return (
    <Box flexDirection="column">
      <Tabs onChange={setTab} keyMap={null} flexDirection="column">
        <Tab name={TabPage.Account}>Accounts</Tab>
        <Tab name={TabPage.Redeem}>Redeem</Tab>
      </Tabs>

      {tab}

      <UncontrolledTextInput onSubmit={() => {}} />
    </Box>
  )
};

export default App;