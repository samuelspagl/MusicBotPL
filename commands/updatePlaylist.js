const ytpl = require('ytpl');
const config = require('../config.json');
const Discord = require('discord.js');

module.exports = {
    name: "updatePlaylist",
    aliases: ["plUpdate"],
    async execute(message, args) {
        
        var playlist = await ytpl(message.client.playlist.id);
        var songs = [];
        
        message.client.playlist.name = playlist.title;
        message.client.playlist.songs = [];

        for(i = 0; i<playlist.items.length; i++){
            //taking all the Information that we need to display or use afterwards
            var name        = playlist.items[i].title;
            var author      = playlist.items[i].author.name;
            var url         = playlist.items[i].url;
            var id          = playlist.items[i].id;
            var thumbnail   = playlist.items[i].bestThumbnail.url;
            var duration    = playlist.items[i].duration;

            //creating the song object
            var song      = {
                                name:       name,
                                author:     author,
                                url:        url,
                                id:         id,
                                thumbnail:  thumbnail,
                                duration:   duration
            }
            //Adding it to the queue (playlist)
            songs.push(song);
        }

        console.log(songs);

        message.client.playlist.songs = songs;

        

        if(args == null){
            msg = await message.channel.send("Die Playlist: *" + playlist.title + "* wurde geupdated.");
            msg.delete({timeout:10000}); 
        }
        message.delete({timeout:10000});
    },
};

