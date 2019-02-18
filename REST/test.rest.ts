const basePath = 'test';

export const restRules = [
    {
        description:'test GET call and answer',
        method: 'get',
        basePath,
        path: ``,
        controller: testGET

    },
    {
        description:'test POST call and answer',
        method: 'post',
        basePath,
        path: ``,
        controller: testPOST

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
    {
        description:'test/middleware',
        method: 'get',
        basePath,
        middleware: [testMiddleware1, testMiddleware2],
        path: `middleware`,
        controller: (rkInstance) => {
            return (req, res, next) => {
                return res.send({success:true, message: 'notRoot'});

            }
        }
    },

];

function testGET(rkInstance)  {
    return (req, res, next)  => {
        return res.send({success:true, message: 'get', tst: req.params.id});

    }
}

function testPOST(rkInstance)  {
    return (req, res, next)  => {
        return res.send({success:true, message: 'post'});

    }
}


function testMiddleware1(rkInstance) {
    return (req, res, next) => {
        console.log('chain them');
        req.tst = 'yep';
        next()
    }

}
function testMiddleware2(rkInstance) {
    return (req, res, next) => {
        console.log(req.tst);
        return res.status(505).send('not Auth')
    }

}
