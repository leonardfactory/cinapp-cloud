var _ = require('underscore');

var ParseCustom = module.exports = {};

ParseCustom.init = function () 
{
    var originalObjectExtend = Parse.Object.extend;
    
    /**
     * Edit Parse library in order to provide enhanced functionalities.
     */
    Parse.Object.extend = function (prototypeProps) 
    {
        var newClass = originalObjectExtend.apply(this, arguments);
    
        if(Parse._.isObject(prototypeProps) && Parse._.isArray(prototypeProps.attrs))
        {
            // Define properties
            _.each(prototypeProps.attrs, function (attr) 
            {
                Object.defineProperty(newClass.prototype, attr, {
                    enumerable: true,
                    configurable: true,
                    get: function () { return this.get(attr); },
                    set: function (value) { this.set(attr, value); return this; }
                });
            });
        
            // Plain-Object converter
            newClass.prototype.toObject = function () 
            {
                var obj = {};
                var _this = this;
                _.each(prototypeProps.attrs, function (attr) {
                    obj[attr] = _this.get(attr);
                });
                return obj;
            }
        
            // Convert from Plain-Object
            newClass.prototype.fromObject = function (obj) 
            {
                var _this = this;
                _.each(prototypeProps.attrs, function (attr) {
                    // Process only defined attributes
                    if(typeof obj[attr] !== "undefined") 
                    {
                        // Date
                        if( (typeof obj[attr].__type !== "undefined") && obj[attr].__type === "Date" ) {
                            _this.set(attr, new Date(obj[attr].iso));
                        }
                        else {
                            _this.set(attr, obj[attr]);
                        }
                    }
                });
            }
        }
    
        return newClass;
    }
}

exports = ParseCustom;