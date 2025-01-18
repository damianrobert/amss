ALTER TABLE iotdb.senzori
    ADD COLUMN nume VARCHAR(255) NOT NULL,
    ADD COLUMN detalii_json JSONB NOT NULL DEFAULT '{}';

ALTER TABLE iotdb.dispozitive
    ADD COLUMN nume VARCHAR(255) NOT NULL,
    ADD COLUMN detalii_json JSONB NOT NULL DEFAULT '{}';
