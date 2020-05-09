const path = require('path');

exports.getFileNameWithoutExt = (filName) => {
    return path.parse(filName).name;
};
