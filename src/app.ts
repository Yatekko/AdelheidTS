import DiscordJS, { Channel, Guild, Intents, TextChannel } from 'discord.js';
import WOKCommands from 'wokcommands';
import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
import mysql from 'mysql';
dotenv.config();

const client = new DiscordJS.Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_MEMBERS
	],
});

client.on('ready', async () => {
	const wok = new WOKCommands(client, {
		commandsDir: path.join(__dirname, '../commands'),
		featuresDir: path.join(__dirname, '../features'),
		ignoreBots: true,
		typeScript: (process.platform === 'win32'),
		testServers: [process.env.OWNER_GUILD!],
		botOwners: [process.env.OWNER_ID!],
		mongoUri: process.env.MONGO_URI
	})
	const { slashCommands } = wok;

	console.log(`Logged in as ${client.user?.username}`);
});

export const dawn_con = mysql.createConnection({
	host: process.env.DAWN_HOST,
	user: process.env.DAWN_USER,
	password: process.env.DAWN_PASS,
	database: process.env.DAWN_DB,
});
dawn_con.connect(err =>{
	// Console log upon error
	if (err) return console.log(err);

	// No error found
	console.log(`MySQL connected successfully to ${dawn_con.config.host}`);
});

let token;
let guild: Guild;
let online_channel: TextChannel;

if (process.platform === 'linux') {
	token = process.env.TOKEN;
	client.guilds.fetch(process.env.DAWN_GUILD!).then(i => {
		guild = i as Guild;
		guild.channels.fetch(process.env.DAWN_CHANNEL!).then(j => online_channel = j as TextChannel);
	});
}
else {
	token = process.env.DEV_TOKEN;
	client.guilds.fetch(process.env.OWNER_GUILD!).then(i => {
		guild = i as Guild;
		guild.channels.fetch(process.env.DEV_CHANNEL!).then(j => online_channel = j as TextChannel);
	});
}

client.login(token);

export { guild, online_channel };