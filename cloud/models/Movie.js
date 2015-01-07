var Movie = Parse.Object.extend({
    className: 'Movie',
    attrs: ['name', 'originalTitle', 'director', 'releaseDate', 'posterPath', 'overview', 'imdbId', 'tmdbId', 'status', 'voteAverage', 'runtime', 'genres']
});

module.exports = Movie;