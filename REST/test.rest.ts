import * as glob from 'glob';

const basePath = 'test';

export const restRules = [
    {
        description:'all repository actions endpoint',
        method: 'get',
        basePath,
        path: ``,
        controller: function(rkInstance)  {
             return (req, res, next)  => {
                return res.send({success:true, message: 'root'});

            }
        }

    },
    {
        description:'test/not-root',
        method: 'get',
        basePath,
        path: `not-root`,
        controller: (rkInstance) => {
            return (req, res, next) => {
                return res.send({success:true, message: 'notRoot'});

            }
        }
    },

];