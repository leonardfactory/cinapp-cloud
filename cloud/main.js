var ParseCustom = require('cloud/common/ParseCustom.js');
ParseCustom.init();

var _ = require('underscore');

var Movie       = require('cloud/models/Movie.js');
var Watchlist   = require('cloud/models/Watchlist.js');

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
        }, response.error);
});

/**
 * Remove movie from watchlist
 */
Parse.Cloud.define("removeWatchedMovie", function (request, response) 
{
    var user = request.user;
    var movieFindQuery = new Parse.Query(Movie);
    movieFindQuery.equalTo('imdbId', request.params.movie.imdbId);
    movieFindQuery.first()
        .then(function (movie)
        {
            if(!movie) {
                response.error('Movie not found');
            }
            else {
                user.relation('watched').remove(movie);
                user.remove('watchedId', movie.imdbId);
                user.save()
                    .then(function () {
                        response.success(movie);
                    }, 
                    function (error) {
                        response.error(error);
                    });
            }
        }, response.error);
});

/**
 * Avoid watchlists with same name
 */
Parse.Cloud.beforeSave("Watchlist", function (request, response) 
{
    if(!request.object.existed()) {
        /**
         * Assign normalizedName and search for watchlists with the same name
         */
        request.object.normalizedName = request.object.computedNormalizedName(request.user);
        
        var nameQuery = new Parse.Query(Watchlist);
        nameQuery.equalTo('normalizedName', request.object.normalizedName);
        nameQuery.first()
            .then(function (object) {
                if(object) {
                    response.error('Watchlist normalizedName should be unique');
                }
                else {
                    response.success();
                }
            }, response.error);
    }
    else {
        /**
         * be sure that normalizedName has not been modified
         */
        for(var key in request.object.dirtyKeys()) {
            if(key === 'normalizedName') {
                response.error('normalizedName cannot be modified');
                return;
            }
        }
        
        response.success();
    }
});