
docker run --rm --name reestrum-pg -v reestrum_pg:/var/lib/postgresql/data -p 5432:5432 -d postgres
docker run --hostname my-rabbit --name reestrum-rabbit -p 5672:5672 -d rabbitmq:3


npm install -g node-gyp

npm config set python "C:\Users\pkarl\Anaconda3\envs\two-seven\python.exe"
npm install argon2


## MODELS
### UserClient - user_clients
Each user can have a client (web-browser instance, mobile device) that can be authenticated separately. We collect this 
data to be able predict user even if one accessed the side without logging in