import DiscordJS, { Intents } from 'discord.js';
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


client.login(process.env.TOKEN);