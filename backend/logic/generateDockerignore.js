module.exports = function generateDockerignore() {
  const dockerignore = 
`docker-compose.env
docker-compose.yml
Dockerfile
node_modules
test
.vscode
  `;
  return dockerignore;
}
