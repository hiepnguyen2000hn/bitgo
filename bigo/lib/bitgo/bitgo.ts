// src/lib/bitgo.ts
import { BitGo } from 'bitgo';

export const bitgo = new BitGo({
    env: 'test',
    accessToken: process.env.BITGO_ACCESS_TOKEN,
});

export default bitgo;