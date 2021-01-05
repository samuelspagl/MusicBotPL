const config = require('../config.json');
const Discord = require('discord.js');

module.exports = {
    name: "playerEmbed",
    aliases: ["playerEmbed"],
    async execute(message, args) {
        console.log("UPDATING THE EMBED");

        nowPlaying = message.client.playlist.songs[message.client.playlist.position];
        nextUp = upNext(message);
        
        var ssss = nowPlaying.name;
        var tttt = createUpNextMessage(nextUp);


         var embed = new Discord.MessageEmbed()
            .setColor(config.color)
            .setTitle(config.name + " [" + config.prefix + "]")
            .setAuthor(config.author)
            .setThumbnail(nowPlaying.thumbnail)
            .setDescription("**PLAYING RN**")
            .addFields(
                { name: 'Title',  value: nowPlaying.name, inline: true },
                { name: 'Author:', value: nowPlaying.author, inline: true},
                { name: 'up next',      value: tttt, inline:false},
                { name: 'settings' , value: "repeat: " + message.client.playlist.repeat + '\nshuffle: ' + message.client.playlist.shuffle}
            )
            .setTimestamp('timestamp');

        //console.log(embed);

        if (!message.client.playerMessage){
            message.client.playerMessage = await message.client.controlRoom.send(embed);
        }else{
            message.client.playerMessage.edit(embed);
        }
        message.client.user.setStatus('available');

        message.client.user.setPresence(
                                        {
                                        status: "online",
                                        activity: {
                                            name: ssss,
                                            type: 2,
                                            url: message.client.playlist.url,
                                            emoji: "🎧",
                                            details: "STUUUUUUUUFFFF",
                                                    },
                                                  }
                                                );
        console.log("DONE UPDATING THE EMBED");
        return embed;
    }
};



function upNext(message){
    var array = [];
    
    var position = message.client.playlist.position + 1;
    
    for (i = position; i < position + 3; i++){
        if(i > message.client.playlist.songs.length) return;
        //console.log(i);
        array.push(message.client.playlist.songs[i]);
    }

    return array;
}

function createUpNextMessage(array){
    var string = "";

    for (var i = 0; i < array.length; i++){
        string = string.concat(array[i].name, " - *", array[i].author, "*\n");
    }

    //console.log(string);

    return string;
}