# Shift Code Source

> Get active Borderlands SHiFT codes

## Install

```
npm install shift-code-source
```

## Usage

### `getShiftCodes(): AsyncGenerator<ShiftCode>`

Create an `AsyncGenerator` of active SHiFT codes.

```ts

import {getShiftCodes} from 'shift-code-source';

for await (const shift of getShiftCodes()) {
  console.log(shift.code);
}

```

## Source Attribution

- https://shift.orcicorn.com/shift/