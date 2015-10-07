var async = require('async'),
	git = require('simple-git')( './' ),
	fse = require('fs-extra'),
	path = require('path'),
	replaceStream = require('replacestream'),
	prompt = require('prompt'),
	randomstring = require("randomstring"),
	spawn = require('child_process').spawn;

var schema = {
	properties: {
		ip: {
			description: 'The default ip is 192.168.33.34.  Hit enter to accept default or type new ip'
		}
	}
}

var child,
 	tasks = [];

function msg( msg ) {
	console.log( msg );
}

msg('Development enviroment setup start...');

tasks = [
	promptForInstructions,
	cloneSite,
	gotowww,
	moveConfig,
	deleteHtAccess,
	gotoParentDir,
	promptForInput,
	updateSiteYml,
	promptToContinue,
	vagrantUp,
	editConfig1,
	deleteConfig,	
	composer,			
	promptForSSH
]

// Runs on load
async.waterfall( tasks, function ( err, result ) {
    if( err ) {
    	
    	msg( 'Uh oh, something went wrong...  ');
    }
    msg("Follow the follow steps:\n1. Type 'vagrant ssh\n2. After login, type 'cd \/vagrant'\n3. Type 'sh configure.sh\n4. Hit enter'");
  });

// debug utility
function whereAmI() {
	 msg( 'In directory ' + process.cwd() ); 
}

function promptForInstructions( callback ) {
	msg('');
	msg('');
	prompt.start();
	prompt.get(['This install will create an iip.dev domain on your local machine.\nIf an iip.dev domain already exists, then this will create a conflict\nRemove or rename it before continuing.\nHit enter when you are ready to continue....'], function() {
		callback();
	})
}


function cloneSite ( callback ) {
	msg('Cloning the yseali repository');
	
	// https://github.com/USStateDept/America.gov.git
	git.clone( 'https://github.com/USStateDept/Yseali.git', 'www', function( err ) {
		callback();
	});
}

function gotowww( callback ) {
	// change directories
	process.chdir( 'www' );
	callback();
}


function moveConfig ( callback )  {
	msg('Moving wp_config to yseali dir');

	// move wp-config.php
	fse.move( 'wp-config.php', '../wp-config.php', function ( err ) {
  		callback();
	});
}

function deleteHtAccess ( callback)  {
	msg('Deleting .htaccess');

	fse.remove('.htaccess', function (err) { 
	 	callback();
	});
}

function gotoParentDir ( callback ) {
	msg( 'Going to parent directory');
	// change to parent dir
	process.chdir( '..' );
	callback();
}

function promptForInput( callback ) {
	prompt.start();

	prompt.get(schema, function ( err, result ) {
		if (err) { 
			return onErr(err); 
		}
	 	callback( null, result );
	});

	function onErr(err) {
	  msg(err);
	  return 1;
	}
}

function updateSiteYml ( result, callback ) { 
	msg ('Updating site.yml file with');
	
   	var host = 'iip.dev', 
   		ip = '192.168.33.34', 
   		fileTpl, file, w, r;

   	if( result.hostname ) {
   		 host = result.hostname;
   	} 
   	if( result.ip ) {
   		 ip = result.ip;
   	} 

	var fileTpl = 'templates/site.tpl.yml';   	// will be reading from site.tpl.yml
	var file = 'site.yml';						// and writing to site.yml

	w = fse.createWriteStream( file );
	r = fse.createReadStream( fileTpl );

	r.on('error', function(err) {
		msg('Error in read stream : ' + err );
	});

	w.on('error', function(err) {
		msg('Error in write stream : ' + err );
	});

	// search and replace and pipe
	if ( result ) {
			r.pipe( replaceStream( '<%hostname%>', host) )
			.pipe( replaceStream( '<%ip%>', ip) )
			.pipe(w);
	} else {
		// just pipe
		r.pipe(w);
	}

	callback();
}

function promptToContinue( callback ) {
	prompt.start();
	prompt.get(['Provisioning vagrant, this may take a few minutes. Hit enter to continue...'], function() {
		callback();
	});
}

function vagrantUp( callback ) {
    child = spawn('vagrant', ['up']);
   
    msg('Provisioning started...');
	
	child.stdout.on('data', function (data) {
	  msg('stdout: ' + data);
	});

	child.stderr.on('data', function (data) {
	  msg('stderr: ' + data);
	});

	child.on('close', function (code) {
	 	msg( 'child process exited with code ' + code );
	 	if( code == 1 ) {
	 		return;
	 	}
	 	callback();
	});
}

function editConfig1( callback ) {
	msg('Editing wp-config')
	fse.copy( 'templates/wp-config.tpl-1.php', 'www/wp-config.php', function ( err ) {
  		callback();
	});
}

function deleteConfig( callback ) {
	msg('Deleting original wp-config');

	fse.remove('www/wp/wp-config.php', function ( err ) { 
	 	callback();
	});
}


function composer( callback ) {
	msg('Changing to www directory....');
	
	process.chdir( 'www' );

	child = spawn('composer', ['install']);

    msg('Running composer install');

    child.stdout.on('data', function ( data ) {
	  msg('stdout: ' + data);
	});

	child.stderr.on('data', function ( data ) {
	  msg('stderr: ' + data);
	});

	child.on('close', function ( code ) {
	 	msg( 'child process exited with code ' + code );
	 	callback();
	});
}


function promptForSSH( callback ) {
	msg('');
	prompt.start();
	prompt.get(["Next, you will need to ssh into vagrant and run a script.\n Hit enter to continue..."], function() {
		callback();
	})
}

//init();