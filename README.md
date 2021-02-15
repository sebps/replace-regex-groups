replace-regex-groups
==========

A lightweight library to replace the regex groups in a string by a set of replacement values

<!-- TOC -->
- [Usage](#usage)
- [Input Validation](#input-validation)
- [License](#license)
<!-- /TOC -->

## Usage
```sh
$ npm install replace-regex-groups
```

### Indexed capture groups ( unnamed )
```js
const replaceRegexGroups = require('replace-regex-groups')
const regex = /http:\/\/([A-Za-z0-9]*):([0-9]*)\/.*/g
const url = 'http://localhost:8080/foo/bar'
const replacements = ['127.0.0.1', 9090 ]
const replaced = replaceRegexGroups(url, regex, replacements)
// replaced is http://127.0.0.1:9090
```

### Named capture groups
```js
const replaceRegexGroups = require('replace-regex-groups')
const regex = /http:\/\/(?<host>[A-Za-z0-9]*):(?<port>[0-9]*)\/.*/g
const url = 'http://localhost:8080/foo/bar'
const replacements = { host: '127.0.0.1', port: 9090 }
const replaced = replaceRegexGroups(url, regex, replacements)
// replaced is http://127.0.0.1:9090
```

### Dataset pattern replacement
```js
const { readFileSync, writeFileSync } = require('fs')
const replaceRegexGroups = require('replace-regex-groups')
const transactions = readFileSync('./transactions.csv', 'utf8')
const sourcePattern = /(?<reference>[A-Z]{4}.[A-Z0-9]*),(?<period>[0-9]{4}.[0-9]{2}),/gm
const replacements = { reference: 'ANONYMIZED_REFERENCE', period: 'ANONYMIZED_PERIOD' }
const anonymizedTransactions = replaceRegexGroups(transactions, sourcePattern, replacements)
writeFileSync('./anonymized-transactions.csv', anonymizedTransactions)
```

## Input validation
- In case of unnamed capture groups the size of the replacements array must be the same as the capture groups count in the input regex
- In case of named capture groups the keys in the replacements map must be the exact same as the capture groups names of the input regex
- All the regex groups must be of the same kind ( either unnamed or named using ?<GROUP_NAME> syntax  )  
- For a regex containing named capture groups a replacement map is expected
- For a regex containing unnamed capture groups a replacement array is expected
- Capture groups must not be nested

## License

ISC

[npm-url]: https://www.npmjs.com/package/replace-regex-groups