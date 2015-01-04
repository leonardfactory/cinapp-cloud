var ParseCustom = require('common/ParseCustom');

exports = ParseCustom.Object.extend({
    className: 'Movie',
    attrs: ['name', 'originalTitle', 'director', 'releaseDate', 'posterPath', 'overview', 'imdbId', 'tmdbId', 'status', 'voteAverage', 'runtime']
});