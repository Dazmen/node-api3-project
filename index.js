// code away!
const server = require('./server.js');

port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log('\n* Server Running on http://localhost:4000 *\n');
});
