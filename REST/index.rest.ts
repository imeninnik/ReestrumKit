export const restRules = [
    {
        description:'all repository actions endpoint',
        method: 'get',
        path: `index`,
        controller: (rkInstance) => {
            return (req, res, next) => {
                res.send('index!');
            }

        }
    },

];
