# ajv-merge-patch

$merge and $patch keywords for [Ajv JSON-Schema validator](https://github.com/epoberezkin/ajv) to extend schemas

[![Build Status](https://travis-ci.org/epoberezkin/ajv-merge-patch.svg?branch=master)](https://travis-ci.org/epoberezkin/ajv-merge-patch)
[![npm version](https://badge.fury.io/js/ajv-merge-patch.svg)](https://www.npmjs.com/package/ajv-merge-patch)
[![Code Climate](https://codeclimate.com/github/epoberezkin/ajv-merge-patch/badges/gpa.svg)](https://codeclimate.com/github/epoberezkin/ajv-merge-patch)
[![Coverage Status](https://coveralls.io/repos/epoberezkin/ajv-merge-patch/badge.svg?branch=master&service=github)](https://coveralls.io/github/epoberezkin/ajv-merge-patch?branch=master)


## Usage

```javascript
var Ajv = require('ajv');
var mergePatch = require('ajv-merge-patch');
var ajv = new Ajv({ v5: true });
mergePatch(ajv);
```

See tests for schema examples
