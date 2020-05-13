# `@shift-code/api`

> Borderlands SHiFT code redemption library

## Install

```sh
npm install @shift-code/api
```

## Usage

```js
import {login, redeem, account, logout} from '@shift-code/api';

(async () => {
  const session = await login('email', 'password');

  const user = await account(session);
  console.log('Redeeming code for %s', user.email);

  const results = redeem(session, 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX');
  for await (const result of results) {
    console.log(result);
  }

  await logout(session);
})();
```

## API

### `login(email: string, password: string) => Promise<Session>`

Create a login session to use for additional methods.

### `logout(session: Session) => Promise<void>`

Logout and invalidate the session.

### `redeem(session, code) => AsyncGenerator<RedemptionResult>`

Redeem a SHiFT code on the account associated to the session.

A code can be associated to multiple platforms, so one or many RedemptionResults will be yielded.

### `account(session) => Promise<Account>`

Get account details, such as email and ID.
