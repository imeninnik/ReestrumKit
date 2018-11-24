docker run --rm --name reestrum-pg -v reestrum_pg:/var/lib/postgresql/data -p 5432:5432 -d postgres
docker run --hostname my-rabbit --name reestrum-rabbit -p 5672:5672 -d rabbitmq:3

npm install -g node-gyp


## MODELS
### UserClient - user_clients
Each user can have a client (web-browser instance, mobile device) that can be authenticated separately. We collect this 
data to be able predict user even if one accessed the side without logging in

## ENV VARIABLES
RK_CLUSTER 0 to XX integer  
RK_MAINDB_HOST || 'localhost'  
RK_MAINDB_USER ||'postgres'  
RK_MAINDB_PORT || 5432  
RK_MAINDB_PASS ||'password'  
RK_MAINDB_DBNAME // dbname  
RK_APP_NAME || 'tstApplicationName!!!!!!'  

### TLS/SSL
RK_USE_TSL  
RK_TSL_KEY_PATH || 'C:\\SSL\\key.pem'  
RK_TSL_CERT_PATH || 'C:\\SSL\\cert.pem'  

### DAL
DBG_QUERY || null // "true" to show queries

### Email with AWS
TEMPLATE_DIRECTORY || `${__dirname}/templates`;
SENDER_EMAIL_ADDRESS || 'your.aws.verified.email.address@gmail.com';
AWS_REGION || 'eu-west-1';
AWS_ACCESS_KEY_ID || 'xxxxx';
AWS_SECRET_ACCESS_KEY || 'xxxxx/yyy';
RK_DEFAULT_FROM_EMAIL

