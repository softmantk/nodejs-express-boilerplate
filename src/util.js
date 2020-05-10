const path = require('path');

exports.getFileNameWithoutExt = (filName) => path.parse(filName).name;
