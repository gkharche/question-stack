const moment = require('moment');
const path = require('path');

module.exports = {
    stripTags: function (input) {
        return input.replace(/<(?:.|\n)*?>/gm, '');
    },
    formatDate: function (date, format) {
        return moment(date).format(format);
    },
    ifCond : function (v1, v2, options) {
        if (v1 === v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    }
    
};



/**
 * IF condiation in handlebars
 * Handlebars.registerHelper('ifCond', function(v1, v2, options) {
  if(v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});
You can then call the helper in the template like this

{{#ifCond v1 v2}}
    {{v1}} is equal to {{v2}}
{{else}}
    {{v1}} is not equal to {{v2}}
{{/ifCond}}

 */