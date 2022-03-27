module.exports = function generateBatFile() {
  const file = 
`npm install
docker build -t microservices .
npm run dc:up
  `;
  return file;
}
