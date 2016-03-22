var async = require('async'),
	fse = require('fs-extra'),
	path = require('path'),
	replaceStream = require('replacestream'),
	randomstring = require("randomstring"),
	prompt = require('prompt'),
	spawn = require('child_process').spawn,
	exec = require('child_process').exec,
	zlib = require('zlib');

var child, w, r,
	tasks = [];

function msg( msg ) {
	console.log( msg) ;
}

tasks = [
	verifyConnection,
	activateNewspaper,
	verifyNewspaper,
	createSalts,
	copyEnvvar,
	apacheRestart,
	moveConfig,
	editConfig1,
	promptToTest,
	editConfig2,
	convertToMultisite,
	editConfig3,
	replaceHtAccess,
	promptToTest2,
	editconfig4,  
	networkEnableShareTheme,
	enableEnviromentalVars,
	promptForImport
]

// Runs on load
async.waterfall( tasks, function ( err, result ) {
    if( err ) {
    	
    	msg( 'Uh oh, something went wrong...  ');
    }
    msg("-------  Process complete -----------\nYou should now have a basic development environment.\nVerify successful install by visiting the frontend http://design.dev\nand attempting to login in at  http://design.dev/wp/wp-admin/ using user:admin, password: admin");
});

function whereAmI() {
	 msg( 'In directory ' + process.cwd() ); 
}

function verifyConnection( callback ) {
	msg('Logged into vagrant box.'); 
	callback();
}

function activateNewspaper ( callback ) {
	msg( 'Activating  Newspaper...' );

	process.chdir( 'www/wp' );

	child = exec('/usr/local/bin/wp theme activate Newspaper', function ( err, stdout, stderr ) {
		msg( 'stdout: ' + stdout );
	    msg( 'stderr: ' + stderr );
		if( err ) {
		 	msg( err.code );
		}
		callback();
	});
}

function verifyNewspaper( callback ) {
	msg( 'Verifying Newspaper activation...' );
	msg('');
	prompt.start();
	prompt.get(['Complete the following:\n1. Login to site at  http://design.dev/wp/wp-admin/\n2. Update database as prompted.\n3. Hit continue and login with username: admin and password: admin.\n4. Visit frontend and ensure all is working.\n5. Hit enter to continue...'], function() {
		callback();
	})
}
 
function createSalts( callback ) {
	msg( 'Creating salts... ' ); 

	process.chdir( '/vagrant' );

	var fileTpl = 'templates/envvar.tpl.conf';   	
	var file = 	'templates/envvar.conf';				

	w = fse.createWriteStream( file );
	r = fse.createReadStream( fileTpl );

	// search and replace and pipe
	r.pipe( replaceStream( '<%salt1%>', randomstring.generate()) )
	 .pipe( replaceStream( '<%salt2%>', randomstring.generate()) )
	 .pipe( replaceStream( '<%salt3%>', randomstring.generate()) )
	 .pipe( replaceStream( '<%salt4%>', randomstring.generate()) )
	 .pipe( replaceStream( '<%salt5%>', randomstring.generate()) )
	 .pipe( replaceStream( '<%salt6%>', randomstring.generate()) )
	 .pipe( replaceStream( '<%salt7%>', randomstring.generate()) )
	 .pipe( replaceStream( '<%salt8%>', randomstring.generate()) )
	 .pipe(w);

	callback();
}

function copyEnvvar( callback ) {
	msg('Moving envvar.conf file...');

	fse.move( 'templates/envvar.conf', '/etc/httpd/conf.d/envvar.conf', function ( err ) {
  		msg('moved')
  		callback();
	});
}

function apacheRestart( callback ) {
	msg( 'Restating apache... ' ); 

	process.chdir( '/etc/httpd/conf.d' );

	child = spawn('apachectl', ['restart']);

    child.stdout.on('data', function (data) {
	  msg('stdout: ' + data);
	});

	child.stderr.on('data', function (data) {
	  msg('stderr: ' + data);
	});

	child.on('close', function (code) {
	 	msg( 'child process exited with code ' + code );
	 	callback();
	});
}

function moveConfig( callback ) {
	msg('Moving wp-config.php to www folder');
	
	process.chdir( '/vagrant' );

	fse.copy( 'wp-config.php', 'www/wp-config.php', function ( err ) {
  		callback();
	});
}

function editConfig1( callback ) {
	msg('Editing config...');
	
	fse.copy( 'templates/wp-config.tpl-2.php', 'www/wp-config.php', function ( err ) {
  		callback();
	});
}

function promptToTest( callback ) {
	prompt.start();
	prompt.get(['Confirm that you can still connect to the DB by:\n 1. Go to http://share.design.dev to verify frontend loads\n 2. Confirm that you can login to http://share.design.dev/wp/wp-login.php.\n 3. If login successful, hit enter to continue..'], function() {
		callback();
	});
}

function editConfig2( callback ) {
	msg('Allowing multisite...');
	
	fse.copy( 'templates/wp-config.tpl-3.php', 'www/wp-config.php', function ( err ) {
  		callback();
	});
}

function convertToMultisite ( callback ) {
	msg('Converting to multisite installation...');

	process.chdir( 'www/wp' );

	child = exec('/usr/local/bin/wp core multisite-convert --subdomains', function ( err, stdout, stderr ) {
		msg( 'stdout: ' + stdout );
	    msg( 'stderr: ' + stderr );
		if( err ) {
		 	msg( err.code );
		}
		callback();
	});
}

function editConfig3( callback ) {
	msg('Completing multisite installation...');
	
	process.chdir( '/vagrant' );
	
	fse.copy( 'templates/wp-config.tpl-4.php', 'www/wp-config.php', function ( err ) {
  		callback();
	});
}

function replaceHtAccess( callback ) {
	msg('Moving .htaccess file...');

	fse.copy( 'templates/.htaccess', 'www/.htaccess', function ( err ) {
  		callback();
	});
}

function promptToTest2( callback ) {
	prompt.start();
	prompt.get(['Make sure you can still access the http://share.design.dev, and that you can login: http://share.design.dev/wp/wp-admin/.\nHit Enter to continue...'], function() {
		callback();
	});
}

function editconfig4( callback ) {
	msg('Enabling domain mapping...');
	
	fse.copy( 'templates/wp-config.tpl-5.php', 'www/wp-config.php', function ( err ) {
  		callback();
	});
}


function networkEnableShareTheme( callback ) {
	msg('Network enabling Newspaper Theme...');
	
	process.chdir( 'www/wp' );
	
	child = exec('/usr/local/bin/wp theme enable Newspaper --network', function ( err, stdout, stderr ) {
		msg( 'stdout: ' + stdout );
	    msg( 'stderr: ' + stderr );
		if( err ) {
		 	msg( err.code );
		}
		callback();
	});
}

function addShareSite( callback ) {
	msg('Adding Share site to the network...');

	child = exec('/usr/local/bin/wp site create --slug=share', function ( err, stdout, stderr ) {
		msg( 'stdout: ' + stdout );
	    msg( 'stderr: ' + stderr );
		if( err ) {
		 	msg( err.code );
		}
		callback();
	});
}


function activateShareThemeForSite( callback ) {
	
	msg('Activating theme for Share site...');
	
	child = exec('/usr/local/bin/wp theme activate Newspaper --url=share.design.dev', function ( err, stdout, stderr ) {
		msg( 'stdout: ' + stdout );
	    msg( 'stderr: ' + stderr );
		if( err ) {
		 	msg( err.code );
		}
		callback();
	});
}

function enableEnviromentalVars( callback ) {
	msg('Enabling enviromental variables...');
	
	fse.copy( 'templates/wp-config.tpl-6.php', 'www/wp-config.php', function ( err ) {
  		callback();
	});
}


function promptForImport( callback ) {
	msg('');
	prompt.start();
	prompt.get(["Next, you will need to import and configure the the share.america.gov database..."], function() {
		callback();
	})
}

