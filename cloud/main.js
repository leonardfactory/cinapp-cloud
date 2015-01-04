var ParseCustom = require('cloud/common/ParseCustom.js');
ParseCustom.init();

var Movie = require('cloud/models/Movie.js');

/**
 * Add a new movie if it doesn't exist in Database.
 */
Parse.Cloud.define("insertMovie", function(request, response) 
{
    var movieExistsQuery = new Parse.Query(Movie);
    movieExistsQuery.equalTo('imdbId', request.params.movie.imdbId);
    movieExistsQuery.find()
        .then(function (movies) 
        {
            if(movies.length > 0) {
                response.success(movies[0]);
            }
            else {
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
            }
        });
});
