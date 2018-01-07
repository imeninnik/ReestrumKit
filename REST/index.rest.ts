export const restRules = [
    {
        description:'all repository actions endpoint',
        method: 'get',
        path: `index`,
        controller: function(req, res, next) {
            res.send('index!');
        }
    },

];