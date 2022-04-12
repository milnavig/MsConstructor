module.exports = function generateEnvFile() {
  const envFile = 
`DB_HOST='localhost'
DB_USER='postgres'
DB_PASSWORD='postgres'
  `;
  return envFile;
}
