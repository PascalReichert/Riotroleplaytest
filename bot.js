var Discord = require('discord.js');
var economy = require('discord-eco');
var bot = new Discord.Client();
var fs = require('fs');
var moment = require('moment');


var commandsList = fs.readFileSync('Storage/commands.txt', 'utf8');

bot.on('ready', () => {
    console.log('I am ready!');
});

bot.on('message', message => {
    
  var commandsList = fs.readFileSync('Storage/commands.txt', 'utf8');

    var sender = message.author; //the person who sent the message
    var msg = message.content.toUpperCase(); //takes message and makes it all uppercase
    var prefix = '!' //the text before commands
    var cont = message.content.slice(prefix.length).split(" ");
    var args = cont.slice(1);
    if (sender.id === '389333933671579668'){
      return;
    }
    
    if (msg === prefix + 'HELP' || msg === prefix + 'COMMANDS')
    {
      message.channel.send(commandsList)
    }
    
    if(msg === prefix + 'PING')
    {
        message.channel.send('Pong! Ping = **' + bot.ping + '**')
    }
    
    if (msg === prefix + 'BALANCE'){

      economy.fetchBalance(message.author.id).then((i) => {
        message.channel.send({embed:{
          title: "Bank",
          color: 0xFFDC00,
          fields:[{
            name: "Account Holder",
            value: message.author.username,
            inline:true
          },
          {
            name: "Account Balance",
            value: i.money,
            inline: true
          }
        ]
        }})
      })
    }
});

// THIS  MUST  BE  THIS  WAY
bot.login(process.env.BOT_TOKEN);
