import {login, logout, redeem} from '../src';
import {Session} from '../src/types';

describe('redeem', () => {
  let session: Session;
  beforeAll(async () => {
    session = await login({
      email: process.env.SHIFT_USERNAME as string,
      password: process.env.SHIFT_PASSWORD as string
    });
  });

  afterAll(async () => {
    await logout(session);
  });

  it('test', async () => {
    const results = await redeem(session, 'KKWJB-JKKBK-66XBR-56JTJ-5WBCC');
    for await (const result of results) {
      expect(result);
    }
  });
});
