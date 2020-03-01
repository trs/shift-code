import React, {useState, useEffect} from 'react';
import {Box, Text, Color} from 'ink';
import {UncontrolledTextInput} from 'ink-text-input';
import StyledBox from 'ink-box';
import Spinner from 'ink-spinner';
import { login } from 'shift-code-api';

import {storeContents, SESSION_FILE} from '../store';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    (async () => {
      if (email && password) {
        const session = await login(email, password);
        await storeContents(SESSION_FILE, session);

        setSuccess(true);
      }
    })().catch((err) => {
      setError(err);
    });
  }, [email, password]);

  return (
    <Box flexDirection="column">
      <StyledBox
        padding={{left: 2, right: 2, top: 1, bottom: 1}}
        align={'center'}
        borderStyle={'round'}
      >
      {!email && 
        <Box>
          <Box marginRight={1}>
            <Text>Email:</Text>
          </Box>
          <UncontrolledTextInput
            focus={!email}
            onSubmit={setEmail}
          />
        </Box>
      }

      {email && !password && 
        <Box>
          <Box marginRight={1}>
            <Text>Password:</Text>
          </Box>
          <UncontrolledTextInput
            focus={!password}
            onSubmit={setPassword}
          />
        </Box>
      }

      {email && password && !success && !error &&
        <Spinner />
      }

      {error &&
        <Color red>{error.message}</Color>
      }
      </StyledBox>
      

      
    </Box>
  );
};

export default Login;