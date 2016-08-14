# ajv-merge-patch

$merge and $patch keywords for [Ajv JSON-Schema validator](https://github.com/epoberezkin/ajv) to extend schemas


## Usage

```javascript
var Ajv = require('ajv');
var mergePatch = require('ajv-merge-patch');
var ajv = new Ajv({ v5: true });
mergePatch(ajv);
```

See tests for schema examples
