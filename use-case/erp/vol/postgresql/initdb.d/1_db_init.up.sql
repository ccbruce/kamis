--CREATE DATABASE db OWNER db ;
--CREATE ROLE erp WITH LOGIN PASSWORD 'mithra35';
-- CREATE USER root WITH PASSWORD 'mithra35';
-- CREATE DATABASE root OWNER root ;
CREATE USER odoo WITH PASSWORD 'mithra35';
ALTER USER odoo CREATEDB;
CREATE USER gitlab WITH PASSWORD 'mithra35';
ALTER USER gitlab CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE gitlab TO gitlab;
CREATE DATABASE gitlab OWNER gitlab ;
-- CREATE DATABASE odoo OWNER odoo ;

-- CREATE TYPE
--DROP TYPE IF EXISTS genre;
-- CREATE TYPE genre AS ENUM (
--     'ADVENTURE',
--     'HORROR',
--     'COMEDY',
--     'ACTION',
--     'SPORTS'
-- );

-- CREATE TABLE
-- DROP TABLE IF EXISTS movies;
-- CREATE TABLE movies (
--     id SERIAL PRIMARY KEY,
--     title VARCHAR NOT NULL,
--     release_year SMALLINT,
--     genre genre,
--     price NUMERIC(4, 2)
-- );
