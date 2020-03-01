import React, {useState, useEffect} from 'react';
import {Box, Text, Color} from 'ink';
import {UncontrolledTextInput} from 'ink-text-input';
import Spinner from 'ink-spinner';

enum ViewState {
  Input,
  Loading,
  Success
}

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [viewState, setViewState] = useState(ViewState.Input);

  function submitEmail(value: string) {
    setEmail(value);
  }

  function submitPassword(value: string) {
    setPassword(value);
    login();
  }

  async function login() {
    // Reset
    setError('');
    setViewState(ViewState.Loading);

    try {
      throw new Error('bad');

      setViewState(ViewState.Success);

    } catch (err) {
      setViewState(ViewState.Input);
      setError(err.message);
      setPassword('');
    }
  }

  return (
    <Box flexDirection={'column'} padding={1}>
      <Box>
        <Text bold><Color hex={'FFA500'}>SHiFT Account Login </Color></Text>
        {viewState === ViewState.Loading && <Spinner /> }
      </Box>

      {error &&
        <Box flexDirection={'column'}>
          <Box>
            <Text bold><Color red>Error: </Color></Text>
            <Text><Color red>{error}</Color></Text>
          </Box>
          <Box paddingBottom={1}>
            <Text>Try again:</Text>
          </Box>
        </Box>
      }

      <Box>
        <Text bold><Color>Email: </Color></Text>
        {(!email && !password && <UncontrolledTextInput onSubmit={submitEmail} />) || <Text>{email}</Text>}
      </Box>

      {email &&
        <Box>
          <Text bold>Password: </Text>
          {(email && !password &&<UncontrolledTextInput mask="*" onSubmit={submitPassword} />) || <Text>{new Array(password.length).fill('*')}</Text>}
        </Box>
      }

      {viewState === ViewState.Success && 
        <Box flexDirection={'column'}>
          <Text bold><Color green>Success!</Color></Text>
        </Box>
      }
    </Box>
  )
};

export default Login;