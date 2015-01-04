var Movie = Parse.Object.extend({
    className: 'Movie',
    attrs: ['name', 'originalTitle', 'director', 'releaseDate', 'posterPath', 'overview', 'imdbId', 'tmdbId', 'status', 'voteAverage', 'runtime']
});

module.exports = Movie;