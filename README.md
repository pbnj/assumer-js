# assumer-js
> A JavaScript library for assuming AWS IAM roles between accounts.

[![NPM](https://nodei.co/npm/assumer.png?downloads=true)](https://nodei.co/npm/assumer/)

[![Known Vulnerabilities](https://snyk.io/test/npm/assumer/badge.svg?style=flat-square)](https://snyk.io/test/npm/assumer)

## Install

```
npm install -s assumer
```

## Usage

```js
const assumer = require('assumer');

const data = {
  controlAccount: '123456789012',
  controlRole: 'control/role',
  targetAccount: '111111111111',
  targetRole: 'target/role',
  username: 'username',
  mfaToken: '123456'
}
assumer(data).then(creds => console.log(creds))
// {AccessKeyId: ASIA..., SecretAccessKey: ..., SessionToken: ...}
```

