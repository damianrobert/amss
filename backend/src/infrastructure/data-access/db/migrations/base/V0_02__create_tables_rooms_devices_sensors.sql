CREATE TABLE iotdb.camere (
    id SERIAL PRIMARY KEY,
    nume VARCHAR(255) NOT NULL,
    culoare VARCHAR(9) NOT NULL
);

CREATE TABLE iotdb.access_utilizatori_camere (
    id SERIAL PRIMARY KEY,
    id_utilizator INT NOT NULL,
    id_camera INT NOT NULL,
    tip_access VARCHAR(12) NOT NULL CONSTRAINT chk_tip_access CHECK (tip_access IN ('R', 'RW')),
    CONSTRAINT auc_fk_utilizator FOREIGN KEY (id_utilizator) REFERENCES iotdb.utilizatori(id),
    CONSTRAINT auc_fk_camera FOREIGN KEY (id_camera) REFERENCES iotdb.camere(id)
);

CREATE TABLE iotdb.dispozitive (
    id SERIAL PRIMARY KEY,
    id_camera INT NOT NULL,
    CONSTRAINT dispozitive_fk_camera FOREIGN KEY (id_camera) REFERENCES iotdb.camere(id)
);


CREATE TABLE iotdb.senzori (
    id SERIAL PRIMARY KEY,
    id_camera INT NOT NULL,
    CONSTRAINT senzori_fk_camera FOREIGN KEY (id_camera) REFERENCES iotdb.camere(id)
);
