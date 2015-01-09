var Watchlist = Parse.Object.extend({
    className: 'Watchlist',
    attrs: ['name', 'normalizedName', 'usersCount'],
    computedNormalizedName: function (user) {
        return this.name.trim().replace(/\W+/g, '-').toLowerCase() + '-' + user.id;
    }
});

module.exports = Watchlist;