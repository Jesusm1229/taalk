const blessed = require('blessed');
const util = require('util')

module.exports = ({ screen, pubClient, subClient, name }) => {
  subClient.subscribe("messages", (err, count) => {
  });
  const chatBox = blessed.box({
    label: 'Chats',
    width: '100%',
    height: '100%-3',
    border: {
      type: 'line',
    },
  });

  const chatLog = blessed.log({
    parent: chatBox,
    tags: true,
    scrollable: true,
    alwaysScroll: true,
    scrollbar: {
      ch: '',
      inverse: true,
    },
    mouse: true,
  });

  const inputBox = blessed.box({
    label: 'Type your message (press enter to send)',
    bottom: '0',
    width: '100%',
    height: 3,
    border: {
      type: 'line',
    },
  });

  const input = blessed.textbox({
    parent: inputBox,
    inputOnFocus: true,
  });

  subClient.on("message", (channel,message) => {
   chatLog.log(message);
  });

  input.key('enter', () => {
    const text = input.getValue();
    pubClient.publish("messages", "{red-fg} " + name + ":{green-fg} "+text);
    input.clearValue();
    input.focus();
  });

  input.key(['C-c'], () => process.exit(0));

  screen.append(chatBox);
  screen.append(inputBox);

  screen.render();

  input.focus();
};
