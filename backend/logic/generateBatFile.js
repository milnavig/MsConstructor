module.exports = function generateBatFile() {
  const file = 
`CALL npm install
CALL docker build -t microservices .
CALL npm run dc:up
  `;
  return file;
}
