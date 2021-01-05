const play = require("./play");
const updatePlaylist = require("./updatePlaylist");
const plEmbed = require('../messages/playerEmbed');

module.exports = {
  name: "shuffle",
  aliases: ["shuffle"],
  async execute(message, args) {
    shuffle = message.client.playlist.shuffle;
    //if the shuffle is already true (from true -> false)
    if (shuffle == true) {
        //Ask the user if he really wanna restore the original playlist, and wait for his/hers answer
        msg = await message.reply("Willst du die ursprüngliche Playlist wiederherstellen? Dabei wird der erste Song der Playliste gestartet falls ich in einem VC bin. (y/n)");
        await message.channel.awaitMessages(m => m.author.id == message.author.id, {max: 1, time: 120000}).then(async collected =>{
            if (collected.first().content.toLowerCase() == "n"){
                //Playlist stays in the shuffled mode
                msg2 = await message.reply("Die Playlist bleibt im *shuffled* Modus");
                return;
            }else{
              //Playlist will be set to the original state by updating the playlist
              msg2 = await message.reply("Okay dann setze ich die Playlist zurück");
              message.client.playlist.shuffle = false;
              message.client.playlist.position = 0;
              await updatePlaylist.execute(message,0).then(()=>{
                play.execute(message);
              });
            }
            collected.first().delete({timeout: 4000});
        });
        msg.delete({timeout: 4000});
        msg2.delete({timeout: 4000});
    } else { //if the playlist was not shuffled
        //set the shuffle state to true
        message.client.playlist.shuffle = true;

        //Start the shuffle of the queue
        //store the songs into a
        var a = message.client.playlist.songs;
        //store the song playing rn 
        var temp = a[message.client.playlist.position];

        a.slice(0, 1);

        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        //making the now playling song the queue number 0
        a.unshift(temp);
        message.client.playlist.songs = a;
    }
    //update the Interface design
    await plEmbed.execute(message);
    message.delete();
  },
};
