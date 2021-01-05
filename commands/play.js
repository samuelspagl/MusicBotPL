const ytdl              = require("discord-ytdl-core");
const plEmbed           = require("../messages/playerEmbed");

module.exports = {
  name: "play",
  aliases: ["play"],
  async execute(message, args) {
    queue = message.client.playlist;

    //console.log(queue);

    stream = null;

    stream = ytdl(queue.songs[queue.position].url);
    console.log("Playing the song: " + queue.songs[queue.position].name);

    const dispatcher = queue.connection
      .play(stream, { type: "opus" })
      .on("finish", () => {
        queue.position++;
        if (queue.position > queue.songs.length) {
          
            if (queue.repeat == true) {
              queue.position = 0;
            } else queue.position = 0;
            queue.dispatcher.end();
            return;
          }
        
        message.client.playerMessage.edit(plEmbed.execute(message));
        this.execute(message);
      });
  },
};
