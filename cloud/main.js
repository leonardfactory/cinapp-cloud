var ParseCustom = require('cloud/common/ParseCustom.js');
ParseCustom.init();

var Movie = require('cloud/models/Movie.js');

// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("insertMovie", function(request, response) 
{
    var movie = new Movie();
    movie.fromObject(request.params.movie);
    
    //var acl = new Parse.ACL();
    //acl.setPublicReadAccess(true);
    //acl.setRoleWriteAccess("Administrator", true);
    
    movie.save(null, { 
        useMasterKey: true,
        success: function (object) {
            response.success(object);
        },
        error: function (error) {
            response.error(object);
        }
    });
});
