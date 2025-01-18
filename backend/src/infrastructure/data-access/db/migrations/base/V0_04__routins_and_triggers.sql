CREATE TABLE iotdb.declansatori_rutine (
    id SERIAL PRIMARY KEY,
    id_camera INT NOT NULL,
    tip VARCHAR(50) NOT NULL CHECK (tip IN ('SENSOR', 'SCHEDULE')),
    cron_exp VARCHAR(255), 
    id_senzor INT, 
    conditie VARCHAR(255),
    valoare_conditie VARCHAR(255)
    CONSTRAINT ck_tipdeclansator CHECK (
        (tip = 'SENSOR' AND id_senzor IS NOT NULL AND conditie IS NOT NULL AND valoare_conditie IS NOT NULL) OR
        (tip = 'SCHEDULE' AND cron_exp IS NOT NULL)
    ),
    CONSTRAINT declansatori_rutine_fk_camera FOREIGN KEY (id_camera) REFERENCES iotdb.camere(id)
);

CREATE TABLE iotdb.rutine (
    id SERIAL PRIMARY KEY,
    id_camera INT NOT NULL,
    nume VARCHAR(255) NOT NULL,
    id_declansator INT NOT NULL REFERENCES iotdb.declansatori_rutine(id) ON DELETE CASCADE,
    activ BOOLEAN DEFAULT TRUE,
    actiuni JSONB NOT NULL,
    CONSTRAINT rutine_fk_camera FOREIGN KEY (id_camera) REFERENCES iotdb.camere(id)
);
