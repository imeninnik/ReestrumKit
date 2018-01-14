DROP TYPE IF EXISTS gendre CASCADE;
CREATE TYPE gender AS ENUM ('male', 'female', 'trans');

DROP TYPE IF EXISTS contact_endpoints_types, CASCADE;
CREATE TYPE contact_endpoints_types AS ENUM ('phone', 'email','address');


DROP TABLE IF EXISTS persons;
create table persons (
    id uuid,
    lname text,
    fname text,
    main_email text,
    emails text[],
    lname_aliases text[],
    fname_aliases text[],
    nicknames text[],
    main_phone text,
    phones text[],
    gender gender,
    dob date,
    dod date,

	country text,
	city text,

    updated_at timestamp,
    created_at timestamp,
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS added;
create table added (
    id uuid,
    agent_id uuid,
    person_id uuid,
    agents_customer_id uuid,
    campaign_id uuid,

    created_at timestamp,
    PRIMARY KEY (id)
);


DROP TABLE IF EXISTS verifies;
create table verifies (
    id uuid,
    agent_id uuid,
    campaign_id uuid,
    customer_id uuid,
    type text,
    verify_code text,
    valid_until timestamp,
    attempts numeric,
	status text,

    created_at timestamp,
    updated_at timestamp,
    PRIMARY KEY (id)
);


DROP TABLE IF EXISTS customer;
create table customer (
    id uuid,
    lname text,
    fname text,
    email text,
    phone text,
    gender gender,
    dob date,
    campaign_id uuid,
    customer_details_id uuid,


    updated_at timestamp,
    created_at timestamp,
    PRIMARY KEY (id)
);


DROP TABLE IF EXISTS contact_endpoints;
create table contact_endpoints (
    person_uuid uuid,
    type contact_endpoints_types,
    value text,
    verified boolean,
    verification_id uuid,

    updated_at timestamp,
    created_at timestamp,
    PRIMARY KEY (type, value)
);
