
import React, {useState} from 'react';
import {Box, Text} from 'ink';
import TextInput from 'ink-text-input';

import {Checkbox} from '../../components/checkbox';

enum ViewState {
  Input,
  Loading,
  Success
}

const EmailPrompt: React.FC<{email: string, setEmail: (u: string) => void}> = ({email, setEmail}) => {
  const [value, setValue] = useState<string>('');

  return (
    <Box>
      <Text bold>Email:&nbsp;</Text>
      {email
        ? <Text>{email}</Text>
        : <TextInput value={value} onChange={setValue} onSubmit={() => setEmail(value)} />
      }
    </Box>
  )
};

const PasswordPrompt: React.FC<{password: string, setPassword: (u: string) => void}> = ({password, setPassword}) => {
  const [value, setValue] = useState<string>('');

  return (
    <Box>
      <Text bold>Password:&nbsp;</Text>
      {password
        ? <Text>{Array(password.length).fill('*')}</Text>
        : <TextInput mask="*" value={value} onChange={setValue} onSubmit={() => setPassword(value)} />
      }
    </Box>
  )
};

const items = [
  {
    label: 'Borderlands',
    value: 'bl1'
  },
  {
    label: 'Borderlands 2',
    value: 'bl2'
  },
  {
    label: 'Borderlands: The Pre-Sequel',
    value: 'tps'
  },
  {
    label: 'Borderlands 3',
    value: 'bl3'
  }
]

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSelectGames = (items: any[]) => {
    console.log(items);
  }

  return (
    <Box flexDirection={'column'} padding={1}>
      <Box>
        <Text bold color='#FFA500'>SHiFT Account Login</Text>
      </Box>

      {items.map((item, index) => {
        return <Checkbox key={index} onCheck={() => {}}>{item.label}</Checkbox>
      })}

      {/* <EmailPrompt email={email} setEmail={setEmail} />

      {email
        ? <PasswordPrompt password={password} setPassword={setPassword} />
        : <Box></Box>
      }

      {email && password
        ? <MultiSelect items={items} onSubmit={handleSelectGames} />
        : <Box></Box>
      } */}

    </Box>
  )
};

// export const Login: React.FC = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [viewState, setViewState] = useState(ViewState.Input);

//   function submitEmail(value: string) {
//     setEmail(value);
//   }

//   function submitPassword(value: string) {
//     setPassword(value);
//     login();
//   }

//   async function login() {
//     // Reset
//     setError('');
//     setViewState(ViewState.Loading);

//     try {
//       throw new Error('bad');

//       setViewState(ViewState.Success);

//     } catch (err) {
//       setViewState(ViewState.Input);
//       setError(err.message);
//       setPassword('');
//     }
//   }

//   return (
//     <Box flexDirection={'column'} padding={1}>
//       <Box>
//         <Text bold color='#FFA500'>SHiFT Account Login</Text>
//         {viewState === ViewState.Loading && <Text>Loading...</Text> }
//       </Box>

//       {/* {error &&
//         <Box flexDirection={'column'}>
//           <Box>
//             <Text bold color='red'>Error:</Text>
//             <Text color='red'>{error}</Text>
//           </Box>
//           <Box paddingBottom={1}>
//             <Text>Try again:</Text>
//           </Box>
//         </Box>
//       } */}

//       {/* <Box>
//         <Text bold>Email:</Text>
//         {(!email && !password && <UncontrolledTextInput onSubmit={submitEmail} />) || <Text>{email}</Text>}
//       </Box> */}

//       {/* {email &&
//         <Box>
//           <Text bold>Password: </Text>
//           {(email && !password &&<UncontrolledTextInput mask="*" onSubmit={submitPassword} />) || <Text>{new Array(password.length).fill('*')}</Text>}
//         </Box>
//       } */}

//       {/* {viewState === ViewState.Success &&
//         <Box flexDirection={'column'}>
//           <Text bold color='green'>uccess!</Text>
//         </Box>
//       } */}
//     </Box>
//   )
// };
