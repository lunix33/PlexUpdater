#!/usr/bin/env node

const http = require('https'),
      process = require('process'),
	  fs = require('fs'),
	  cprocess = require('child_process');

const build = process.env['PU_PLEX_BUILD'] || 'Ubuntu 64-bit',
	  pkgmanager = process.env['PU_PKG_MNG_PATH'] || '/usr/bin/dpkg',
	  pkgmanagerargs = process.env['PU_PKG_MNG_ARGS'] || '-i {pkg}',
      location = `.computer.Linux.releases.find(x => x.label.indexOf('${build}') > -1 ).url`,
	  filename = 'plex-install.deb';
function main() {
	getLink().then((link) => {
		console.log(`Downloading from: ${link}`);
		downloadFile(link).then(() => {
			console.log(`File downloaded!`);
			install().then(() => {
				console.log('Package manager finished correctly.');
				clean().then(() => {
					process.exit(0);
				}).catch((err) => {
					process.exit(4);
				});
			}).catch((err) => {
				console.log(err);
				process.exit(3);
			});
		}).catch((err) => {
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

/**
 * Install the package.
 * @returns {Promise} Return a promise which indicate when the package is done installing correctly (done), otherwise return an error message.
 */
function install() {
	const errMsg = `Package wasn't installed correctly`;
	
	return new Promise((resolve, reject) => {
		try{
			const args = pkgmanagerargs.replace('{pkg}', filename).split(' ');
			const child = cprocess.spawn(pkgmanager, args);

			child.stdout.on('data', (data) => {
				console.log(`pkg-mng: ${data}`);
			});

			child.stderr.on('data', (data) => {
				console.log('\x1b[31m%s\x1b[0m', `pkg-mng: ${data}`);
			});

			child.on('close', (code) => {
				if (code === 0)
					resolve();
				else
					reject(`${errMsg}: The package manager finished with code ${code}`);
			});
		} catch (e) {
			reject(`${errMsg}: The package manager could not start.`);
		}
	});
}

function clean() {
	const errMsg = 'Unable to complete the cleaning operation';
	
	return new Promise((resolve, reject) => {
		fs.unlink(filename, (err) => {
			if (err)
				reject(`${errMsg}: Unable to delete the installation file.`);
			
			resolve();
		});
	});
}

main();
