FROM liquibase/liquibase

WORKDIR /usr/local/migrations

COPY ./migrations/changelog.xml ./
COPY ./migrations/base ./base

CMD ["sh", "-c", "liquibase --changeLogFile=changelog.xml --url=jdbc:postgresql://$DB_HOST:$DB_PORT/$DB_NAME --username=$DB_USER --password=$DB_PASSWORD update"]
