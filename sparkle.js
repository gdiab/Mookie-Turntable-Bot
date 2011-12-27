/**
 *  sparkle.js
 *  Author: sharedferret
 *  Version: [dev] 2011.12.26
 *  
 *  A Turntable.fm bot for the Indie/Classic Alternative 1 + Done room.
 *  Based on bot implementations by alaingilbert, anamorphism, and heatvision
 *  Uses node.js with modules ttapi, node_mysql
 * 
 *  Run: 'node sparkle.js'
 *  
 *  Make sure parameters in config.js are set before running.
 *  Make sure a mysql server instance is running before starting the bot.
 *
*/
var Bot;
var config;
var mysql;
var client;

//Creates the bot listener
try {
	Bot = require('ttapi');
} catch(e) {
	console.log(e);
	console.log('It is likely that you do not have the ttapi node module installed.'
		+ '\nUse the command \'npm install ttapi\' to install.');
	process.exit(0);
}

//Creates the config object
try {
	config = require('./config.js');
} catch(e) {
	console.log(e);
	console.log('Ensure that config.js is present in this directory.');
	process.exit(0);
}

//Creates mysql db object
try {
	mysql = require('mysql');
} catch(e) {
	console.log(e);
	console.log('It is likely that you do not have the mysql node module installed.'
		+ '\nUse the command \'npm install mysql\' to install.');
	process.exit(0);
}

//Connects to mysql server
try {
	client = mysql.createClient(config.DBLOGIN);
} catch(e) {
	console.log(e);
	console.log('Make sure that a mysql server instance is running and that the '
		+ 'username and password information in config.js are correct.');
}

//Creates the bot and initializes global vars
var bot = new Bot(config.AUTH, config.USERID);
var usersList = { };

//Used for room enforcement
var djs = { };
var usertostep;
var userstepped = false;

var currentsong = {
	artist: null,
	song: null,
	djname: null,
	djid: null,
	up: 0,
	down: 0,
	listeners: 0};

//Checks if the user id is present in the admin list. Authentication
//for admin-only privileges.
function admincheck(userid) {
	for (i in config.admins) {
		if (userid == config.admins[i]) {
			return true;
		}
	}
	return false;
}

//The bot will respond to a Reptar call with a variant of 'rawr!' based on
//the result from a RNG.
//TODO: pull this out to a db
function reptarCall() {
	var rand = Math.random();
	if (rand < 0.05) {
		bot.speak('That band is pretty awesome.');
	} else if (rand < 0.10) {
		bot.speak('Good morning!');
	} else if (rand < 0.18) {
		bot.speak('Rawr!');
	} else if (rand < 0.3) {
		bot.speak('rawr!');
	} else if (rand < 0.4) {
		bot.speak('RAWR!');
	} else if (rand < 0.5) {
		bot.speak('rawr.');
	} else if (rand < 0.6) {
		bot.speak('RAWR!!!');
	} else {
		bot.speak('.reptar');
	}
}

//Adds the song data to the songdata table.
//This runs on the endsong event.
function addToDb(data) {
	client.query(
		'INSERT INTO '+ config.SONG_TABLE +' '
		+ 'SET artist = ?,song = ?, djname = ?, djid = ?, up = ?, down = ?, listeners = ?, started = ?',
		[currentsong.artist, 
		currentsong.song, 
		currentsong.djname, 
		currentsong.djid, 
		currentsong.up, 
		currentsong.down, 
		currentsong.listeners, 
		new Date()]);
}

//Reminds a user that has just played a song to step down, and pulls them
//off stage if they do not step down.
function enforceRoom() {
	setTimeout( function() {
		if(!userstepped) {
			bot.speak(usersList[usertostep].name + ', please step down');
			setTimeout( function() {
				if(!userstepped) {
					bot.remDj(usertostep);
				}
			}, 19000);
		}
	}, 15000);
}

//When the bot is ready, this makes it join the primary room (ROOMID)
//and sets up the database/tables
//TODO: Actually handle those errors (99% of the time it'll be a "db/table
//	already exists" error which is why I didn't handle them immediately)
bot.on('ready', function (data) {
	//Creates DB and tables if needed, connects to db
	client.query('CREATE DATABASE ' + config.DATABASE,
		function(error) {
			//yay
		});
	client.query('USE '+ config.DATABASE);

	//song table
	client.query('CREATE TABLE ' + config.SONG_TABLE
		+ '(id INT(11) AUTO_INCREMENT PRIMARY KEY,'
		+ ' artist VARCHAR(255),'
		+ ' song VARCHAR(255),'
		+ ' djname VARCHAR(255),'
		+ ' djid VARCHAR(255),'
		+ ' up INT(3),' + ' down INT(3),'
		+ ' listeners INT(3),'
		+ ' started DATETIME)',
		function (error) {
			//yay
		});

	//chat table
	client.query('CREATE TABLE ' + config.CHAT_TABLE
		+ '(id INT(11) AUTO_INCREMENT PRIMARY KEY,'
		+ ' user VARCHAR(255),'
		+ ' userid VARCHAR(255),'
		+ ' chat VARCHAR(255),'
		+ ' time DATETIME)',
		function (error) {
			//yay
		});
			
	bot.roomRegister(config.ROOMID);
});

//Runs when the room is changed.
//Updates the currentsong array and users array with new room data.
bot.on('roomChanged', function(data) {
	if (data.room.metadata.current_song != null) {
		currentsong.artist = data.room.metadata.current_song.metadata.artist;
		currentsong.song = data.room.metadata.current_song.metadata.song;
		currentsong.djname = data.room.metadata.current_song.djname;
		currentsong.djid = data.room.metadata.current_song.djid;
		currentsong.up = data.room.metadata.upvotes;
		currentsong.down = data.room.metadata.downvotes;
		currentsong.listeners = data.room.metadata.listeners;
	}

	//Creates the dj list
	djs = data.room.metadata.djs;
	
	//Repopulates usersList array.
	var users = data.users;
	for (i in users) {
		var user = users[i];
		usersList[user.userid] = user;
	}
});

//Runs when a user updates their vote
//Updates current song data and logs vote in console
bot.on('update_votes', function (data) {
	//Update vote and listener count
	currentsong.up = data.room.metadata.upvotes;
	currentsong.down = data.room.metadata.downvotes;
	currentsong.listeners = data.room.metadata.listeners;

	//Log vote in console
	//Note: Username only displayed for upvotes, since TT doesn't broadcast
	//      username for downvote events.
	if (config.logConsoleEvents) {
		if (data.room.metadata.votelog[0][1] == 'up') {
			var voteduser = usersList[data.room.metadata.votelog[0][0]];
				console.log('Vote: [+'
				+ data.room.metadata.upvotes + ' -'
				+ data.room.metadata.downvotes + '] ['
				+ data.room.metadata.votelog[0][0] + '] '
				+ voteduser.name + ': '
				+ data.room.metadata.votelog[0][1]);
		} else {
			console.log('Vote: [+'
				+ data.room.metadata.upvotes + ' -'
				+ data.room.metadata.downvotes + ']');
		}
	}
});

//Runs when a user joins
//Adds user to userlist, logs in console, and greets user in chat.
bot.on('registered',   function (data) {
	//Log event in console
	if (config.logConsoleEvents) {
		console.log('Joined room: ' + data.user[0].name);
	}

	//Add user to usersList
	var user = data.user[0];
	usersList[user.userid] = user;

	//Greet user
	//Displays custom greetings for certain members
	if(config.welcomeUsers) {
		if (!user.name.match(/^ttdashboard/)) {
			switch(user.name) {
				case 'overlordnyaldee':
					bot.speak('Meow!');
					setTimeout(function() {
						bot.speak('hugs overlordnyaldee');
					}, 2000);
					break;
				case 'sharedferret':
					bot.speak('Hi ferret!');
					break;
				default:
					bot.speak(config.welcomeGreeting + user.name + '!');
			}
		}
	}
});

//Runs when a user leaves the room
//Removes user from usersList, logs in console
bot.on('deregistered', function (data) {
	//Log in console
	if (config.logConsoleEvents) {
		console.log('Left room: ' + data.user[0].name);
	}
	var user = data.user[0];
	delete usersList[user.userid];
});

//Runs when something is said in chat
//Responds based on coded commands, logs in console, adds chat entry to chatlog table
//Commands are added under switch(text)
bot.on('speak', function (data) {
	//Get name/text data
	var name = data.name;
	var text = data.text;

	//Log in console
	if (config.logConsoleEvents) {
		console.log('Chat ['+data.userid+' ' +name+'] '+text);
	}

	//Log in db (chatlog table)
	client.query('INSERT INTO ' + config.CHAT_TABLE + ' '
		+ 'SET user = ?, userid = ?, chat = ?, time = ?',
		[data.name, data.userid, data.text, new Date()]);

	//If it's a supported command, handle it	
	switch(text) {
		//--------------------------------------
		//COMMAND LISTS
		//--------------------------------------
	
		case '.sparklecommands':
			bot.speak('commands: .users, .owner, .source, rules, ping, reptar, '
				+ 'mostplayed, mostawesomed, mostlamed, mymostplayed, '
				+ 'mymostawesomed, mymostlamed, totalawesomes, dbsize, '
				+ 'pastnames [username]');
			break;

		case 'help':
		case 'commands':
			bot.speak('commands: .ad, ping, reptar, merica, .random, .facebook, '
				+ '.twitter, .rules, .users, .owner, .source, mostplayed, '
				+ 'mostawesomed, mostlamed, mymostplayed, mymostawesomed, '
				+ 'mymostlamed, totalawesomes, dbsize, pastnames [username]');
			break;

		//--------------------------------------
		//USER COMMANDS
		//--------------------------------------

		//Displays a list of users in the room
		case '.users':
			var numUsers = 0;
			var output = '';
			for (var i in usersList) {
				output += (usersList[i].name) + ', ';
				numUsers++;
			}
			bot.speak(numUsers + ' users in room: ' + output.substring(0,output.length - 2));
			break;

		//Boots user 'thisiskirby'
		//Booted user changed by changing userid in bot.boot()
		case 'antiquing':
		case 'antiquing?':
			bot.speak('boom!');
			bot.boot('4e1c82d24fe7d0313f0be9a7'); //boot kirby
			//bot.boot('4e3b6a804fe7d0578d003859', 'didn\'t awesome tpc'); //boot vic
			break;

		//Responds to reptar-related call
		case 'CAN YOU FEEL IT!?':
			setTimeout(function() {
				bot.speak('YES I CAN FEEL IT!');
			}, 1200);
			break;
		case 'I enjoy that band.':
			setTimeout(function() {
				bot.speak('Me too!');
			}, 1200);
			break;

		//Outputs bot owner
		case '.owner':
			bot.speak(config.ownerResponse);
			break;

		//Outputs github url for SparkleBot
		case '.source':
			bot.speak('My source code is available at: '
				+ 'https://github.com/sharedferret/Sparkle-Turntable-Bot');
			break;

		//Ping bot
		//Useful for users that use the iPhone app
		case 'ping':
			var rand = Math.random();
			if (rand < 0.5) {
				bot.speak('You\'re still here, '+name+'!');
			} else {
				bot.speak('Still here, '+name+'!');
			}
			break;

		//Reptar call!
		//Randomly picks a response in reptarCall()
		case 'reptar':
			reptarCall();
			break;

		//Rules rehash since xxRAWRxx only responds to .rules
		case 'rules':
			bot.speak('You can view the rules here: http://tinyurl.com/63hr2jl');
			setTimeout(function() {
				bot.speak('No queue, fastest finger, play one song and step down');
			}, 600);
			break;

		//hugs support.
		//Change xxMEOWxx, meow etc to bot name
		case 'hugs xxMEOWxx':
		case 'hugs meow':
			var rand = Math.random();
			var timetowait = 1600;
			if (rand < 0.4) {
				setTimeout(function() {
					bot.speak('Awww!');
				}, 1500);
				timetowait += 600;
			}
			setTimeout(function() {
				bot.speak('hugs ' + data.name);
			}, timetowait);
			break;

		//--------------------------------------
		//USER DATABASE COMMANDS
		//--------------------------------------

		//Returns the total number of awesomes logged in the songlist table
		case 'totalawesomes':
			client.query('SELECT SUM(UP) AS SUM FROM '
				+ config.SONG_TABLE,
				function selectCb(error, results, fields) {
					var awesomes = results[0]['SUM'];
					bot.speak('Total awesomes in this room: ' + awesomes);					
				});
			break;

		//Returns the three song plays with the most awesomes in the songlist table
		case 'bestplays':
			client.query('SELECT CONCAT(song,\' by \',artist) AS TRACK, UP FROM '
				+ config.SONG_TABLE + ' ORDER BY UP DESC LIMIT 3',
				function select(error, results, fields) {
					var response = 'The song plays I\'ve heard with the most awesomes: ';
					for (i in results) {
						response += results[i]['TRACK'] + ': '
							+ results[i]['UP'] + ' awesomes.  ';
					}
					bot.speak(response);
			});
			break;

		//Returns the three DJs with the most points logged in the songlist table
		case 'bestdjs':
			client.query('SELECT djname as DJ, sum(up) as POINTS from ' + config.SONG_TABLE
				+ ' group by djname order by sum(up) desc limit 3',
				function select(error, results, fields) {
					console.log(results);
					console.log(results[0]);
					var response = 'The DJs with the most points accrued in this room: ';
					for (i in results) {
						response += results[i]['DJ'] + ': '
							+ results[i]['POINTS'] + ' points.  ';
					}
					bot.speak(response);
			});
			break;

		//Returns the three DJs with the most points logged in the songlist table
		case 'worstdjs':
			client.query('SELECT djname as DJ, sum(down) as POINTS from ' + config.SONG_TABLE
				+ ' group by djname order by sum(down) desc limit 3',
				function select(error, results, fields) {
					var response = 'The DJs with the most lames accrued in this room: ';
					for (i in results) {
						response += results[i]['DJ'] + ': '
							+ results[i]['POINTS'] + ' lames.  ';
					}
					bot.speak(response);
			});
			break;

		//Returns the three most-played songs in the songlist table
		case 'mostplayed':
			client.query('SELECT CONCAT(song,\' by \',artist) AS TRACK, COUNT(*) AS COUNT FROM '
				+ config.SONG_TABLE + ' GROUP BY CONCAT(song,\' by \',artist) ORDER BY COUNT(*) DESC LIMIT 3',
				function select(error, results, fields) {
					var response = 'The songs I\'ve heard the most: ';
					for (i in results) {
						response += results[i]['TRACK'] + ': '
							+ results[i]['COUNT'] + ' plays.  ';
					}
					bot.speak(response);
			});
			break;

		//Returns the three most-awesomed songs in the songlist table
		case 'mostawesomed':
			client.query('SELECT CONCAT(song,\' by \',artist) AS TRACK, SUM(up) AS SUM FROM '
				+ config.SONG_TABLE + ' GROUP BY CONCAT(song,\' by \',artist) ORDER BY SUM DESC LIMIT 3',
				function select(error, results, fields) {
					var response = 'The most awesomed songs I\'ve heard: ';
					for (i in results) {
						response += results[i]['TRACK'] + ': '
							+ results[i]['SUM'] + ' awesomes.  ';
					}
					bot.speak(response);
			});
			break;

		//Returns the three most-lamed songs in the songlist table
		case 'mostlamed':
			client.query('SELECT CONCAT(song,\' by \',artist) AS TRACK, SUM(down) AS SUM FROM '
				+ config.SONG_TABLE + ' GROUP BY CONCAT(song,\' by \',artist) ORDER BY SUM DESC LIMIT 3',
				function select(error, results, fields) {
					var response = 'The most lamed songs I\'ve heard: ';
					for (i in results) {
						response += results[i]['TRACK'] + ': '
							+ results[i]['SUM'] + ' lames.  ';
					}
					bot.speak(response);
			});
			break;
			
		//Returns the user's three most played songs
		case 'mymostplayed':
			client.query('SELECT CONCAT(song,\' by \',artist) AS TRACK, COUNT(*) AS COUNT FROM '
				+ config.SONG_TABLE + ' WHERE (djid = \''+ data.userid +'\')'
				+ ' GROUP BY CONCAT(song,\' by \',artist) ORDER BY COUNT(*) DESC LIMIT 3',
				function select(error, results, fields) {
					var response = 'The songs I\'ve heard the most from you: ';
					for (i in results) {
						response += results[i]['TRACK'] + ': '
							+ results[i]['COUNT'] + ' plays.  ';
					}
					bot.speak(response);
			});
			break;

		//Returns the user's three most-awesomed songs (aggregate)
		case 'mymostawesomed':
			client.query('SELECT CONCAT(song,\' by \',artist) AS TRACK, SUM(up) AS SUM FROM '
				+ config.SONG_TABLE + ' WHERE (djid = \''+ data.userid +'\')'
				+ ' GROUP BY CONCAT(song,\' by \',artist) ORDER BY SUM DESC LIMIT 3',
				function select(error, results, fields) {
					var response = 'The most appreciated songs I\'ve heard from you: ';
					for (i in results) {
						response += results[i]['TRACK'] + ': '
							+ results[i]['SUM'] + ' awesomes.  ';
					}
					bot.speak(response);
			});
			break;

		//Returns the user's three most-lamed songs (aggregate)
		case 'mymostlamed':
			client.query('SELECT CONCAT(song,\' by \',artist) AS TRACK, SUM(down) AS SUM FROM '
				+ config.SONG_TABLE + ' WHERE (djid = \''+ data.userid +'\')'
				+ ' GROUP BY CONCAT(song,\' by \',artist) ORDER BY SUM DESC LIMIT 3',
				function select(error, results, fields) {
					var response = 'The most hated songs I\'ve heard from you: ';
					for (i in results) {
						response += results[i]['TRACK'] + ': '
							+ results[i]['SUM'] + ' lames.  ';
					}
					bot.speak(response);
			});
			break;

		//For debugging/monitoring of db
		//Returns the number of songs logged and the size of the database in MB.
		case 'dbsize':
			//var response = 'Songs logged';
			client.query('SELECT COUNT(STARTED) AS COUNT FROM ' + config.SONG_TABLE,
				function selectCb(error, results, fields) {
					bot.speak('Songs logged: ' + results[0]['COUNT'] + ' songs.');
			});
			setTimeout(function() {
			client.query('SELECT sum( data_length + index_length ) / 1024 / 1024 \'dbsize\''
				+ ' FROM information_schema.TABLES'
				+ ' WHERE (table_schema = \'' + config.DATABASE + '\')',
				function selectCb(error, results, fields) {
					bot.speak('Database size: ' + results[0]['dbsize'] + ' MB.');
			});
			}, 500);
			break;

		//Bot freakout
		case 'reptar sucks':
			bot.speak('OH NO YOU DIDN\'T');
			setTimeout(function() {
				reptarCall();
			}, 1000);
			break;
			

		//--------------------------------------
		//ADMIN-ONLY COMMANDS
		//--------------------------------------

		//Tells bot to awesome the current song
		case '\.a':
		case 'awesome':
			if (admincheck(data.userid)) {
				bot.vote('up');
			}
			break;

		//Tells bot to lame the current song
		case '\.l':
		case 'lame':
			if (admincheck(data.userid)) {
				bot.vote('down');
			}
			break;

		//Pulls a DJ after their song.
		case 'pulldj':
			if (admincheck(data.userid)) {
				if (!userstepped) {
					bot.remDj(usertostep);
				}
			}
			break;

		//Pulls the current dj.
		case 'pullcurrent':
			if (admincheck(data.userid)) {
				if(currentsong.djid != null) {
					bot.remDj(currentsong.djid);
				}
			}
			break;

		//Pulls all DJs on stage and plays a song.
		case 'cb4':
			bot.speak('Awwwww yeah');
			for (i in djs) {
				bot.remDj(djs[i]);
			}
			bot.addDj();
			break;

		//Changes room
		case 'Meow, go to IAS':
			if (data.userid == config.MAINADMIN) {
				bot.roomDeregister();
				bot.roomRegister(config.IASROOMID);
			}
			break;
		case 'Meow, go to Reptar Room':
			if (data.userid == config.MAINADMIN) {
				bot.roomDeregister();
				bot.roomRegister(config.ROOMID);
			}
			break;

		//Step up to DJ
		case 'Meow, step up':
			if (admincheck(data.userid)) {
				bot.addDj();
			}
			break;

		//Step down if DJing
		case 'Meow, step down':
			if (admincheck(data.userid)) {
				bot.remDj(config.USERID);
			}
			break;

		//Bot freakout
		case 'OH MY GOD MEOW':
			if (admincheck(data.userid)) {
				reptarCall();
				setTimeout(function() {
					reptarCall();
				}, 1400);
				setTimeout(function() {
					reptarCall();
				}, 2800);
				setTimeout(function() {
					reptarCall();
				}, 4200);
				setTimeout(function() {
					reptarCall();
				}, 5600);
				setTimeout(function() {
					reptarCall();
				}, 7000);
			}
			break;

		//Shuts down bot (only the main admin can run this)
		//Disconnects from room, exits process.
		case 'Meow, shut down':
			if (data.userid == config.MAINADMIN) {
				bot.roomDeregister();
				process.exit(0);
			}
		
	}

	//Returns a list of names a user has gone by
	//Usage: 'pastnames [username]'
	if (text.match(/^pastnames/)) {
		//bot.speak('DEBUG: I\'m searching for '+text.substring(9));
		client.query('SELECT djname FROM ' + config.SONG_TABLE
			+ ' WHERE (djid LIKE (SELECT djid FROM '
			+ config.SONG_TABLE + ' WHERE (djname like ?)'
			+ ' ORDER BY id DESC LIMIT 1)) GROUP BY djname',
			[text.substring(10)],
			function select(error, results, fields) {
					var response = 'Names I\'ve seen that user go by: ';
					for (i in results) {
						response += results[i]['djname'] + ', ';
					}
					bot.speak(response.substring(0,response.length-2));
			});
	}
				

});

//Runs when no song is playing.
bot.on('nosong', function (data) {
	//
});

//Runs at the end of a song
//Logs song in database, reports song stats in chat
bot.on('endsong', function (data) {
	//Log song in DB
	addToDb();

	//Used for room enforcement
	userstepped = false;
	usertostep = currentsong.djid;

	//Report song stats in chat
	if (config.reportSongStats) {
		bot.speak(currentsong.song + ' stats: awesomes: '
			+ currentsong.up + ' lames: ' + currentsong.down);
	}
});

//Runs when a new song is played
//Populates currentsong data, tells bot to step down if it just played a song,
//logs new song in console, auto-awesomes song
bot.on('newsong', function (data) {
	//Populate new song data in currentsong
	currentsong.artist = data.room.metadata.current_song.metadata.artist;
	currentsong.song = data.room.metadata.current_song.metadata.song;
	currentsong.djname = data.room.metadata.current_song.djname;
	currentsong.djid = data.room.metadata.current_song.djid;
	currentsong.up = data.room.metadata.upvotes;
	currentsong.down = data.room.metadata.downvotes;
	currentsong.listeners = data.room.metadata.listeners;
	currentsong.started = data.room.metadata.current_song.starttime;

	//Enforce stepdown rules
	if (usertostep != null) {
		if (usertostep == config.USERID) {
			bot.remDj(config.USERID);
		} else if (config.oneDownEnforce) {
			enforceRoom();
		}
	}

	//Log in console
	if (config.logConsoleEvents) {
		console.log('Now Playing: '+currentsong.artist+' - '+currentsong.song);
	}

	//Auto-awesome
	setTimeout(function() {
		bot.vote('up');
	}, 5000);

	//SAIL!
	if((currentsong.artist == 'AWOLNATION') && (currentsong.song == 'Sail')) {
		setTimeout(function() {
			bot.speak('SAIL!');
		}, 34500);
	}

	// ****
	// REPTAR SINGALONGS
	// ****

	//CAN YOU FEEL IT?
	if(currentsong.song == 'Houseboat Babies') {
		setTimeout(function() {
			bot.speak('CAN YOU FEEL IT?')	;
		}, 84500);
		setTimeout(function() {
			bot.speak('YES I CAN FEEL IT');
		}, 86500);
		setTimeout(function() {
			bot.speak('When I\'m at Jenny\'s house');
		}, 89500);
		setTimeout(function() {
			bot.speak('I look for bad ends');
		}, 93000);
		setTimeout(function() {
			bot.speak('Forget your parents!');
		}, 95200);
		setTimeout(function() {
			bot.speak('But it\'s just cat and mouse!');
		}, 97900);
	}

	if((currentsong.artist == 'Reptar') && (currentsong.song == 'Blastoff')) {
		setTimeout(function() {
			bot.speak('Well I won\'t call you!');
		}, 184000);
		setTimeout(function() {
			bot.speak('If you don\'t call me!');
		}, 186000);
		setTimeout(function() {
			bot.speak('No no I won\'t call you!');
		}, 188000);
		setTimeout(function() {
			bot.speak('If you don\'t call me!');
		}, 190000);
		setTimeout(function() {
			bot.speak('Yeah!');
		}, 192000);
	}
});

//Runs when a dj steps down
//Logs in console
bot.on('rem_dj', function (data) {
	//Log in console
	//console.log(data.user[0]);
	if (config.logConsoleEvents) {
		console.log('Stepped down: '+ data.user[0].name + ' [' + data.user[0].userid + ']');
	}

	//Adds user to 'step down' vars
	//Used by enforceRoom()
	if (usertostep == data.user[0].userid) {
		userstepped = true;
		usertostep = null;
	}

	//Remove from dj list
	for (i in djs) {
		if (djs[i] == data.user[0].userid) {
			delete djs[i];
		}
	}
});

//Runs when a dj steps up
//Logs in console
bot.on('add_dj', function(data) {
	//Log in console
	if (config.logConsoleEvents) {
		console.log('Stepped up: ' + data.user[0].name);
	}
	djs[djs.length] = data.user[0].userid;
});
