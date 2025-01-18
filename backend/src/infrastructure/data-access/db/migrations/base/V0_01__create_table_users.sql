CREATE SCHEMA iotdb;

CREATE TABLE iotdb.utilizatori (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    nume VARCHAR(255) NOT NULL,
    prenume VARCHAR(255) NOT NULL,
    hash_parola TEXT NOT NULL,
    secret_totp TEXT,
    tip_administrator BOOLEAN NOT NULL,
    activ BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO iotdb.utilizatori (email, nume, prenume, hash_parola, tip_administrator) VALUES ('admin@local.com', 'Admin', 'Admin' , '$2a$10$SAy8BFh2LJVZpBADCjXZ/uBuoEpeQKeTHJJZ02MhXg/GKl7ld5Swi', TRUE)