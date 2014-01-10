/* @ author: Steve Young */

define([
    'http',
    'path',
    'module',
    'express',
    '../routes/router'
    ], function(http, path, module, express, Router){

  var ApplicationController = function(){

    // initialize the server
    function initialize(){
      var server = express(),
        port = 3000;

      http.createServer(server).listen(port, function(){
        configureServer(server, port, {
          standardIO: true,
          memoryUsage: true
        });
      });
    }

    // configure the server
    var configureServer = function(server, port, settings){
      var router = new Router();

      //! path.dirname(module.uri) used instead of __dirname due to requirejs known compat. ticket
      server.use(express.static(path.join(path.dirname(module.uri), 'public')));
      router.enableRoutes(server);

      if (settings) {
        for (parameter in settings) {
          if (typeof settings[parameter] === 'boolean') {
            var setting = settings[parameter];
            switch (parameter) {
              case 'standardIO':
                enableStandardInput(setting);
                break;
              case 'memoryUsage':
                enableMemoryUsage(setting);
                break;
              default:
                console.error('Settings hash fall-through detected!');
            }
          }
        }
      }

      explainConfiguration(port, settings)
    }

    // explain how the server was configured
    var explainConfiguration = function(port, settings){
      // pretties explaining how the server has been configured
      console.log('\n---------------------------------------*');
      console.log('Server has been configured and is now running at http://127.0.0.1:'
        + String(port)+'/');

      // require/node global reads
      console.log(process.execPath);
      console.log('node ' + process.version);
      console.log(process.platform);

      if (settings) {
        console.log('\noptional settings ~~~~~~~~~~~~~~~~~~~~~');
        for (parameter in settings) {
          var setting = settings[parameter];
          switch (parameter) {
            case 'standardIO':
              console.log('stdio streams enabled : ' + settings.standardIO);
              break;
            case 'memoryUsage':
              console.log('memory usage: ' + JSON.stringify(process.memoryUsage()));
              break;
            default:
              console.error('Settings hash fall-through detected!');
          }
        }
      } else {
        console.log('No optional configuration settings detected.');
      }
      console.log('---------------------------------------*');
      return this; // more chaining...
    }

    // enable Standard IO stream for typing in console after server boot
    var enableStandardInput = function(enabled){
      if (enabled) {
        process.stdin.resume();
        process.stdin.on('data', function (chunk) {
          process.stdout.write('data: ' + chunk);
        });
      }
    }

    var enableMemoryUsage = function(enabled){
      if (enabled) process.memoryUsage()
    }

    return {
      init: initialize
    }
  }

  return ApplicationController;
});