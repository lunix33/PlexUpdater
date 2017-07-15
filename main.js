#!/usr/bin/env node

const http = require('https'),
      process = require('process'),
	  fs = require('fs');

const build = process.env['PLEX_BUILD'] | 'linux-ubuntu-x86_64',
      location = `.computer.Linux.releases.find(x => x.build === '${build}').url`,
	  filename = 'plex-install.deb';
function main() {
	getLink().then((link) => {
		console.log(`Downloading from: ${link}`);
		downloadFile(link).then(() => {
			console.log(`File downloaded!`);
			install();
		}).catch(() => {
			console.log(err);
			process.exit(2);
		});
	}).catch((err) => {
		console.log(err);
		process.exit(1);
	});
}

/**
 * Get the download link of the installation file.
 * @returns {Promise} A promise which return the download link (then) or an error message (catch)
 */
function getLink() {
	const errMsg = 'Unable to get download URL';
	
	return new Promise((resolve, reject)=> {
		http.get('https://plex.tv/api/downloads/1.json', (res) => {
			if (res.statusCode === 200) {
				res.setEncoding('utf8');
				let data = "";
				res.on('data', (d) => {
					data += d;
				});
				res.on('end', () => {
					let link = '';
					try {
						data = JSON.parse(data);
						link = eval(`data${location}`);
					} catch (e) {
						reject(`${errMsg}: ${e.message}`);
					}

					if (link !== '')
						resolve(link);
					else
						reject(`${errMsg}: Empty download URL.`);
				});
			} else {
				reject(`${errMsg}: Bad server response.`);
			}
		}).on('error', (err) => {
			reject(`${errMsg}: ${err.message}`);
		}).end();
	});
}

/**
 * Download the installation file into the system.
 * @param   {string}  link The download URL.
 * @returns {Promise}      A promise which return when the file is done downloading (then), or an error message (catch)
 */
function downloadFile(link) {
	const errMsg = 'Unable to download installation file';
	
	return new Promise((resolve, reject) => {
		http.get(link, (res) => {
			if (res.statusCode === 200) {
				const stream = fs.createWriteStream(filename);
				res.pipe(stream);
				
				let size = res.headers['content-length'],
				    downloaded = 0,
					echothreshold = 350,
					count = echothreshold;
				
				res.on('data', (res) => {
					downloaded += res.length;
					count++;
					
					if (count >= echothreshold) {
						console.log(`Downloaded: ${downloaded}B (~${Math.round(downloaded / size * 100)}%)`);
						count = 0;
					}
				});
				
				res.on('end', () => {
					resolve();
					stream.close();
				});
			} else {
				reject(`${errMsg}: Bad server response.`);
			}
		}).on('error', (err) => {
			reject(`${errMsg}: ${err.message}`);
		}).end();
	});
}

function install() {
	const args = ['-i', filename];
}

main();
