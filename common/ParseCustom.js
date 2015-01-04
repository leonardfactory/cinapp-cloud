var _ = require('underscore');
var originalObjectExtend = Parse.Object.extend;

exports.Object = {};

exports.Object.extend = function (prototypeProps) 
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
                if(typeof obj[attr] !== "undefined") {
                    _this.set(attr, obj[attr]);
                }
            });
        }
    }
    
    return newClass;
}