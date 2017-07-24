const cluster = require('cluster'),
      os = require('os');

function startWorker(){
  let worker = cluster.fork();
  console.log(`Cluster %d has ran ${worker.id}`)
}

if ( cluster.isMaster ){
  os.cpus().forEach( ()=> startWorker() );
  cluster.on('disconnect', worker => console.log(`Executer %d has disconnected from luster ${worker.id}`));
  cluster.on('exit', function(worker, code, signal){
    console.log(`Cluster executer %d has finished with code %d (%s) ${worker.id} ${code} ${signal}`);
    startWorker();
  });
} else {
  require('./index.js')();
}