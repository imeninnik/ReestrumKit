DROP TYPE IF EXISTS GENDER CASCADE;
CREATE TYPE GENDER AS ENUM ('male', 'female', 'unknown');

DROP TYPE IF EXISTS CONTACT_ENDPOINTS_TYPES, CASCADE;
CREATE TYPE CONTACT_ENDPOINTS_TYPES AS ENUM ('phone', 'email', 'address');


DROP TABLE IF EXISTS persons;
CREATE TABLE persons (
  id            UUID,
  lname         TEXT,
  fname         TEXT,
  main_email    TEXT,
  emails        TEXT [],
  lname_aliases TEXT [],
  fname_aliases TEXT [],
  nicknames     TEXT [],
  main_phone    TEXT,
  phones        TEXT [],
  gender        GENDER,
  dob           DATE,
  dod           DATE,

  country       TEXT,
  city          TEXT,

  updated_at    TIMESTAMP,
  created_at    TIMESTAMP,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS added;
CREATE TABLE added (
  id                 UUID,
  agent_id           UUID,
  person_id          UUID,
  agents_customer_id UUID,
  campaign_id        UUID,

  created_at         TIMESTAMP,
  PRIMARY KEY (id)
);


DROP TABLE IF EXISTS verifies;
CREATE TABLE verifies (
  id          UUID,
  agent_id    UUID,
  campaign_id UUID,
  customer_id UUID,
  type        TEXT,
  verify_code TEXT,
  valid_until TIMESTAMP,
  attempts    NUMERIC,
  status      TEXT,

  created_at  TIMESTAMP,
  updated_at  TIMESTAMP,
  PRIMARY KEY (id)
);


DROP TABLE IF EXISTS customers;
CREATE TABLE customers (
  id                  UUID,
  lname               TEXT,
  fname               TEXT,
  email               TEXT,
  phone               TEXT,
  gender              GENDER,
  dob                 DATE,
  campaign_id         UUID,
  customer_details_id UUID,


  updated_at          TIMESTAMP,
  created_at          TIMESTAMP,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id                  UUID,
  person_id         UUID,
  is_business         BOOLEAN,
  verified            BOOLEAN,
  crypto_id           UUID,
  password            TEXT,
  roles               TEXT [],

  last_logon          TIMESTAMP,
  last_logout         TIMESTAMP,

  updated_at          TIMESTAMP,
  created_at          TIMESTAMP,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS cryptos;
CREATE TABLE cryptos (
  id                  UUID,
  value               TEXT,
  type                TEXT,

  updated_at          TIMESTAMP,
  created_at          TIMESTAMP,
  PRIMARY KEY (id)
);


DROP TABLE IF EXISTS contact_endpoints;
CREATE TABLE contact_endpoints (
  person_id     UUID,
  user_id     UUID,
  type            CONTACT_ENDPOINTS_TYPES,
  value           TEXT,
  verified        BOOLEAN,
  verification_id UUID,

  updated_at      TIMESTAMP,
  created_at      TIMESTAMP,
  PRIMARY KEY (type, value)
);


DROP TABLE IF EXISTS user_clients;
CREATE TABLE user_clients (
  id     UUID,
  user_id UUID,
  fingerprint     TEXT,
  token     TEXT,
  authenicated    BOOLEAN,


  updated_at      TIMESTAMP,
  created_at      TIMESTAMP,
  PRIMARY KEY (id, fingerprint, token)
);
