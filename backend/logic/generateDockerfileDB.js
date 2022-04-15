module.exports = function generateDockerfileDB(dbName) {
  const dockerfile = 
`FROM postgres:10.5
ADD /script.sql /docker-entrypoint-initdb.d
RUN chmod a+r /docker-entrypoint-initdb.d/*
EXPOSE 5432
`;
  return dockerfile;
}
