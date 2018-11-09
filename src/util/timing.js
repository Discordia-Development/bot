const ms = require('ms');

exports.convertToTime = function(str) {
  return ms(ms(str));
};