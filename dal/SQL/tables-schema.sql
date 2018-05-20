DROP TYPE IF EXISTS reestrum.GENDER CASCADE;
CREATE TYPE reestrum.GENDER AS ENUM ('male', 'female', 'unknown');

DROP TYPE IF EXISTS reestrum.CONTACT_ENDPOINTS_TYPES, CASCADE;
CREATE TYPE reestrum.CONTACT_ENDPOINTS_TYPES AS ENUM ('phone', 'email', 'address');


DROP TABLE IF EXISTS reestrum.persons;
CREATE TABLE reestrum.persons (
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
  gender        reestrum.GENDER,
  dob           DATE,
  dod           DATE,

  country       TEXT,
  city          TEXT,

  updated_at    TIMESTAMP,
  created_at    TIMESTAMP,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS reestrum.added;
CREATE TABLE reestrum.added (
  id                 UUID,
  agent_id           UUID,
  person_id          UUID,
  agents_customer_id UUID,
  campaign_id        UUID,

  created_at         TIMESTAMP,
  PRIMARY KEY (id)
);


DROP TABLE IF EXISTS reestrum.verifies;
CREATE TABLE reestrum.verifies (
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


DROP TABLE IF EXISTS reestrum.customer;
CREATE TABLE reestrum.customer (
  id                  UUID,
  lname               TEXT,
  fname               TEXT,
  email               TEXT,
  phone               TEXT,
  gender              reestrum.GENDER,
  dob                 DATE,
  campaign_id         UUID,
  customer_details_id UUID,


  updated_at          TIMESTAMP,
  created_at          TIMESTAMP,
  PRIMARY KEY (id)
);


DROP TABLE IF EXISTS reestrum.contact_endpoints;
CREATE TABLE reestrum.contact_endpoints (
  person_uuid     UUID,
  type            reestrum.CONTACT_ENDPOINTS_TYPES,
  value           TEXT,
  verified        BOOLEAN,
  verification_id UUID,

  updated_at      TIMESTAMP,
  created_at      TIMESTAMP,
  PRIMARY KEY (type, value)
);
