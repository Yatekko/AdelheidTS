import { TextChannel, Client } from "discord.js";
const AsciiTable = require('ascii-table')
import { dawn_con, online_channel } from "../src/app";
import dotenv from 'dotenv';
dotenv.config();

/**
 * Updates the list of currently online users
 * on the game server in the Discord server's
 * designated text channel.
 */

export const config = {
	displayName: 'Online List',
	dbName: 'ONLINE_LIST'
}

export default (client: Client) => {
	const updateList = async () => {
		let table = new AsciiTable('Players Online')
			.setHeading('Character', 'Job', 'Location');

		dawn_con.query(process.env.DAWN_QUERY!, (err, results) =>
		{
			if (err)
			{
				online_channel.bulkDelete(5).then(() => online_channel.send(`${err.message}`));
				return;
			}

			if (results.length == 0)
			{
				table.addRow('', '', '');
			}

			for (let i = 0; i < results.length; i++)
			{
				let gmlevel = '';
				if (results[i].gm > 1) gmlevel = '[GM]';
				table.addRow(`${gmlevel}${results[i].character}`, `${results[i].job}${results[i].level}` + (results[i].subjob == 0 ? '' : `/${results[i].subjob}${results[i].sublevel}`), `${results[i].location}`);

			}

			online_channel.bulkDelete(5).then(() => online_channel.send(`\`\`\`\n${table.toString()}\`\`\``));
		})
		setTimeout(updateList, 1000 * 60);
	}
	updateList();
}
