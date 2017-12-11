//calling the package
var Discord = require('discord.js');
var economy = require('discord-eco');
var bot = new Discord.Client();
var fs = require('fs');
var moment = require('moment');

var userData = JSON.parse(fs.readFileSync('Storage/userData.json', 'utf8'));
var commandsList = fs.readFileSync('Storage/commands.txt', 'utf8');
var items = JSON.parse(fs.readFileSync('Storage/items.json', 'utf8'));

//functions


//Listener Event: Message Received (this will run every time a message is received)
bot.on('message', message => {

  var userData = JSON.parse(fs.readFileSync('Storage/userData.json', 'utf8'));
  var commandsList = fs.readFileSync('Storage/commands.txt', 'utf8');

    //Variables
    var sender = message.author; //the person who sent the message
    var msg = message.content.toUpperCase(); //takes message and makes it all uppercase
    var prefix = '!' //the text before commands
    var cont = message.content.slice(prefix.length).split(" ");
    var args = cont.slice(1);

    if (sender.id === '389333933671579668'){
      return;
    }

    if (!userData[sender.id + message.guild.id]) userData[sender.id + message.guild.id] = {}
    if (!userData[sender.id + message.guild.id].lastWork) userData[sender.id + message.guild.id].lastWork = 'Not worked';

    fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
      if(err) console.error(err);
    })

    //help command
    if (msg === prefix + 'HELP' || msg === prefix + 'COMMANDS')
    {
      message.channel.send(commandsList)
    }

    //ping/pong command
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

    if (msg === prefix + 'WORK'){
      if (userData[sender.id + message.guild.id].lastWork != moment().format('L'))
      {
        userData[sender.id + message.guild.id].lastWork = moment().format('L')
          economy.updateBalance(message.author.id, 200).then((i) => {
            message.channel.send({embed: {
              title: "Work",
              color: 0x005FFF,
              description: "You got your work done for today and earned **$200**!"
            }})
          })
      }
      else{
         message.channel.send({embed: {
           title: "Work",
           color: 0xFF0000,
           description: "You already worked today! Come back " + moment().endOf('day').fromNow() + " to work and earn money again...",
         }})
       }
    }

    if (msg.startsWith(`${prefix}BUY`)){

      var categories = [];

      if (!args.join(" ")) {
          for(var i in items) {
            if(!categories.includes(items[i].type)){
              categories.push(items[i].type)
            }
          }

          const embed = new Discord.RichEmbed()
            .setDescription('Available items')
            .setColor(0x11D300)

            for(var i = 0; i < categories.length; i++) {

                var tempDesc = '';

                for(var c in items) {
                    if (categories[i] === items[c].type) {
                      tempDesc += `${items[c].name} - ${items[c].price} - ${items[c].desc}\n`;

                    }
                }

                embed.addField(categories[i], tempDesc);

            }

            message.channel.send({embed})

      }
    }

    fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
      if(err) console.error(err);
    })
});




//Listener even: Bot Launched
bot.on('ready', () => {
    console.log('Bot Launched...')
    console.log('Economy Launched...')

    bot.user.setStatus('online')
    bot.user.setGame('RIOT RolePlay')

});

//Listener Event: User Joined
bot.on('guildMemberAdd', member => {

    console.log('User ' + member.user.username + ' has joined the server!')

    var role = member.guild.roles.find('name', 'tester');

    member.addRole(role)

    member.guild.channels.get('385738955921948672').send('Yaaaaay, **' + member.user.username + '** joined the server!')
});

//Listener Event: User Left
bot.on('guildMemberRemove', member => {

    console.log('User ' + member.user.username + ' has left the server!')
    member.guild.channels.get('385738955921948672').send('Noooooooooooo, **' + member.user.username + '** left the server!')

});

// THIS  MUST  BE  THIS  WAY
bot.login(process.env.BOT_TOKEN);
