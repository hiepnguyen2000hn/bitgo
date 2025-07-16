// src/lib/bitgo.ts
import { BitGo } from 'bitgo';

export const bitgo = new BitGo({
    env: process.env.BITGO_ENV as 'test' | 'prod',
    accessToken: process.env.BITGO_ACCESS_TOKEN,
});

export default bitgo;