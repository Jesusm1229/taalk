const blessed = require('blessed');
const startChat = require('./startChat');
const Redis = require("ioredis");

var redisUrl;
for (let j = 0; j < process.argv.length; j++) {
    if(process.argv[j].includes('redis')){
        redisUrl = process.argv[j];
    }
}
let pubClient = new Redis(redisUrl);
let subClient = new Redis(redisUrl);

pubClient.on('error', function (error) {
  console.log("Couldn't connect to redis");
  console.log("Usage: termchat $redis_url");
  process.exit(0);
})

subClient.on('error', function (error) {
  console.log("Couldn't connect to redis");
  console.log("Usage: termchat $redis_url");
  process.exit(0);
})

const screen = blessed.screen({
  smartCSR: true,
  title: 'Lambda Store Chat 🚀',
});

const initBox = blessed.box({
  label: 'Please input your name',
  top: 'center',
  left: 'center',
  width: '50%',
  height: 3,
  border: {
    type: 'line',
  },
});

const initInput = blessed.textbox({
  parent: initBox,
  inputOnFocus: true,
});

initInput.key('enter', () => {
  const name = initInput.getValue();
  if (!name) return;

  screen.remove(initBox);

  startChat({
    screen,
    pubClient,
    subClient,
    name,
  });
});

initInput.key(['C-c'], () => process.exit(0));

screen.append(initBox);
screen.render();
initInput.focus();
