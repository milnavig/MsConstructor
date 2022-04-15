FROM postgres:10.5
ADD db/DoctorService_db/script.sql /docker-entrypoint-initdb.d
RUN chmod a+r /docker-entrypoint-initdb.d/*
EXPOSE 5432
