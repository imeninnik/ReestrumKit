
docker run --rm --name reestrum-pg -v reestrum_pg:/var/lib/postgresql/data -p 5432:5432 -d postgres
docker run --hostname my-rabbit --name reestrum-rabbit -p 5672:5672 -d rabbitmq:3


npm install -g node-gyp

npm config set python "C:\Users\pkarl\Anaconda3\envs\two-seven\python.exe"
npm install argon2


## ENV VARIABLES
RK_CLUSTER 0 to XX integer
process.env.RK_MAINDB_HOST || 'localhost',
RK_MAINDB_USER ||'postgres',
RK_MAINDB_PORT || 5432,
RK_MAINDB_PASS ||'password',
RK_MAINDB_DBNAME ||'reestrum',
RK_APP_NAME || 'tstApplicationName!!!!!!'
