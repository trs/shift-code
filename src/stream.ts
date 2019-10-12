import { getShiftCodes } from 'shift-code-observer';

import { PassThrough } from 'stream';

export function shiftCodeStream() {
  const stream = new PassThrough({objectMode: true});
  getShiftCodes()
    .subscribe(
      (code) => stream.write(code),
      (err) => stream.emit('error', err),
      () => stream.end()
    );
  return stream;
}
