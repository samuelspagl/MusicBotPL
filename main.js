const Discord           = require('discord.js');
const client            = new Discord.Client();
const config            = require('./config.json');

const prefix            = config.prefix;

const getPlaylist       = require('./commands/getPlaylist');
const updatePlaylist    = require('./commands/updatePlaylist');
const play              = require('./commands/play');
const plEmbed           = require('./messages/playerEmbed');
const shuffle           = require('./commands/shuffle');
const join              = require('./commands/join');
//const startMessage      = require('./messages/startmessage'); //only needed if you have the js

client.playlist         = { 
                            name:       "",
                            id:         "",
                            connection: null,
                            songs:      [],
                            position:   0,
                            repeat:     true,
                            shuffle:    false,
                            shuffleQueue: [],
                            url:        ""

                        };

client.controlRoom      = null; //Room the bot will listen to
client.playerMessage    = null; //The Player Message with the information
client.vChannel         = null; //The Voice Channel


/*__________________________________________________________________________ */
/*__________________________________________________________________________ */
/*__________________________START UP METHOD_________________________________ */
/*__________________________________________________________________________ */
/*__________________________________________________________________________ */

client.once('ready',()=>{
    console.log("Playlist Music Bot is online");

    //if there is a Music Room specified in the config, try to get it
    if(config.musicRoomID != "none"){
    client.vChannel = client.channels.cache.get(config.musicRoomID);
    }

    //if there is a Control Room specified in the config, try to get it
    if(config.botControlRoomID != "none"){
        client.controlRoom = client.channels.cache.get(config.botControlRoomID);
    }
});

/*__________________________________________________________________________ */
/*__________________________________________________________________________ */
/*__________________________CLIENT METHODS__________________________________ */
/*__________________________________________________________________________ */
/*__________________________________________________________________________ */

client.on('message', async(message)=>{

    //do nothing if the message doesn't start with the prefix or is from the bot itself
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const command = message.content.slice(prefix.length).split(/ +/);
    console.log(command);

    //sets a new Controlroom, this command can be used in every chat the bot as permissions to
    if(command[0] == "setMBControlRoom"){
        client.controlRoom = client.channels.cache.get(command[1]);

        (await message.channel.send("The Control room was set to <#" + client.controlRoom.id + ">")).delete({timeout: 30000});
    }

    //those commands only work in the specified control room
    if(message.channel.id == client.controlRoom.id){
        switch(command[0]){

            case "setMusicRoom": //sets a new Music Room
                client.vChannel = client.channels.cache.get(command[1]).on('error', ()=>{
                    message.channel.send("The Room ID seems to be incorrect, pls check again :)");
                });

                message.channel.send("The Music Room as been updated!");
                message.delete({timeout: 5000});
                break;

            case "setPlaylist": //sets a YT playlist
                await getPlaylist.execute(message, command[1]);
                await plEmbed.execute(message);
                break;
            
            case "updatePlaylist": //updates the playlist 
                updatePlaylist.execute(message);
                break;

            case "join": //joins the Music Room
                join.execute(message);
                break;

            case "play": //plays the music
                await plEmbed.execute(message);
                play.execute(message);
                message.delete();
                break;

            case "stop": //not exactly working rn
                client.connection.dispatcher.end();
                message.delete();
                break;
            
            case "next": //plays the next song
                client.playlist.position++;
                await plEmbed.execute(message);
                play.execute(message);
                message.delete();
                break;


            case "shuffle": //shuffles/unshuffles the playlist
                await shuffle.execute(message);
                
               //await plEmbed.execute(message);
                //message.delete();
                break;

            case "repeat": //lets the playlist repeat itself
                if(client.playlist.repeat){
                    client.playlist.repeat = false;
                }else{
                    client.playlist.repeat = true;
                }
                await plEmbed.execute(message);
                message.delete();
                break;

            case "startMessage": //you can specify a startMessage.js with info or so
                startMessage.execute(message);
                break;

        }
    }
});

client.login(config.token);