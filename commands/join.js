const config = require('../config.json');


module.exports = {
    name: "join",
    aliases: ["join"],
    async execute(message, args) {

        //Check if there is a MusicRoomID in the config file
        if (config.musicRoomID == "none"){
            msg = await message.reply("Bitte gib zuerst an wechem Voice Channel ich beitreten soll. Gib dazu den Befehl *setMusicRoom [ID]* ein.");
            msg.delete({timeout: 10000});
            message.delete();
            return;
        }
        
        //Join the previously selected voice channel
        message.client.playlist.connection = await message.client.vChannel.join();

        //Send a success message in the Chat, delete the messages afterwards
        msg = await message.channel.send("Ich bin dem Channel <#" + message.client.vChannel.id + "> beigetreten. Du kannst nun mit *"+ config.prefix+"play* die Wiedergabe starten. :)");
        msg.delete({timeout: 10000});
        message.delete({timeout: 10000});
    },
};