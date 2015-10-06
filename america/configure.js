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
	activateGenesis,
	verifyGenesis,
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
	activateExtender,
	enableBaseTheme,
	// addDocsSite,
	// addClimateSite,
	// addFactsSite,
	// addInteractiveSite,
	// activateBaseThemeDocs,
	// activateBaseThemeClimate,
	// activateBaseThemeFacts,
	// activateBaseThemeInteractive,
	// promptForImport
	// importDB
]

// Runs on load
async.waterfall( tasks, function ( err, result ) {
    if( err ) {
    	
    	msg( 'Uh oh, something went wrong...  ');
    }
    //msg("-------  Process complete -----------\nYou should now have a basic development environment.\nVerify successful install by visiting the frontend http://america.dev\nand attempting to login in at  http://america.dev/wp/wp-admin/ using user:admin, password: admin");
    msg("Import the db and upload the theme settings to complete the install");
});

function whereAmI() {
	 msg( 'In directory ' + process.cwd() ); 
}

function verifyConnection( callback ) {
	msg('Logged into vagrant box.'); 
	callback();
}

function activateGenesis ( callback ) {
	msg( 'Activating  genesis...' );

	process.chdir( 'www/wp' );

	child = exec('/usr/local/bin/wp theme activate Genesis', function ( err, stdout, stderr ) {
		msg( 'stdout: ' + stdout );
	    msg( 'stderr: ' + stderr );
		if( err ) {
		 	msg( err.code );
		}
		callback();
	});
}

function verifyGenesis( callback ) {
	msg( 'Verifying Genesis activations...' );
	msg('');
	prompt.start();
	prompt.get(['Complete the following:\n1. Login to site at  http://america.dev/wp/wp-admin/\n2. Update database as prompted.\n3. Hit continue and login with username: admin and password: admin.\n4. Visit frontend and ensure all is working.\n5. Hit enter to continue...'], function() {
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

    msg('Restarting apache');

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
	
	fse.move( 'wp-config.php', 'www/wp-config.php', function ( err ) {
  		callback();
	});
}

function editConfig1( callback ) {
	msg('Editing config...');
	
	fse.move( 'templates/wp-config.tpl-2.php', 'www/wp-config.php', function ( err ) {
  		callback();
	});
}

function promptToTest( callback ) {
	prompt.start();
	prompt.get(['Confirm that you can still connect to the DB by:\n 1. Go to http://america.dev to verify frontend loads\n 2. Confirm that you can login to http://america.dev/wp/wp-login.php.\n 3. If login successful, hit enter to continue..'], function() {
		callback();
	});
}

function editConfig2( callback ) {
	msg('Allowing multisite...');
	
	fse.move( 'templates/wp-config.tpl-3.php', 'www/wp-config.php', function ( err ) {
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
	
	fse.move( 'templates/wp-config.tpl-4.php', 'www/wp-config.php', function ( err ) {
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
	prompt.get(['Make sure you can still access the http://america.dev, and that you can login: http://america.dev/wp/wp-admin/.\nHit Enter to continue...'], function() {
		callback();
	});
}

function editconfig4( callback ) {
	msg('Enabling domain mapping...');
	
	fse.move( 'templates/wp-config.tpl-5.php', 'www/wp-config.php', function ( err ) {
  		callback();
	});
}

function activateExtender( callback ) {
	msg('Activating America Theme Extender...');

	process.chdir( 'www/wp' );

	child = exec('/usr/local/bin/wp plugin activate america-theme-extender --network', function ( err, stdout, stderr ) {
		msg( 'stdout: ' + stdout );
	    msg( 'stderr: ' + stderr );
		if( err ) {
		 	msg( err.code );
		}
		callback();
	});
}

function enableBaseTheme( callback ) {
	msg('Network enabling America.gov Base Theme...');

	child = exec('/usr/local/bin/wp theme enable america --network', function ( err, stdout, stderr ) {
		msg( 'stdout: ' + stdout );
	    msg( 'stderr: ' + stderr );
		if( err ) {
		 	msg( err.code );
		}
		callback();
	});
}

// function addDocsSite( callback ) {
// 	msg('Adding docs site to the network...');

// 	child = exec('/usr/local/bin/wp site create --slug=docs', function ( err, stdout, stderr ) {
// 		msg( 'stdout: ' + stdout );
// 	    msg( 'stderr: ' + stderr );
// 		if( err ) {
// 		 	msg( err.code );
// 		}
// 		callback();
// 	});
// }

// function addClimateSite( callback ) {
// 	msg('Adding climate site to the network...');

// 	child = exec('/usr/local/bin/wp site create --slug=climate', function ( err, stdout, stderr ) {
// 		msg( 'stdout: ' + stdout );
// 	    msg( 'stderr: ' + stderr );
// 		if( err ) {
// 		 	msg( err.code );
// 		}
// 		callback();
// 	});
// }

// function addFactsSite( callback ) {
// 	msg('Adding facts site to the network...');

// 	child = exec('/usr/local/bin/wp site create --slug=facts', function ( err, stdout, stderr ) {
// 		msg( 'stdout: ' + stdout );
// 	    msg( 'stderr: ' + stderr );
// 		if( err ) {
// 		 	msg( err.code );
// 		}
// 		callback();
// 	});
// }

// function addInteractiveSite( callback ) {
// 	msg('Adding interactive site to the network...');

// 	child = exec('/usr/local/bin/wp site create --slug=interactive', function ( err, stdout, stderr ) {
// 		msg( 'stdout: ' + stdout );
// 	    msg( 'stderr: ' + stderr );
// 		if( err ) {
// 		 	msg( err.code );
// 		}
// 		callback();
// 	});
// }


// function activateBaseThemeDocs( callback ) {
	
// 	msg('Activating america base theme for sites...');
	
// 	child = exec('/usr/local/bin/wp theme activate america --url=docs.america.dev', function ( err, stdout, stderr ) {
// 		msg( 'stdout: ' + stdout );
// 	    msg( 'stderr: ' + stderr );
// 		if( err ) {
// 		 	msg( err.code );
// 		}
// 		callback();
// 	});
// }

// function activateBaseThemeClimate( callback ) {
	
// 	msg('Activating america base theme for sites...');
	
// 	child = exec('/usr/local/bin/wp theme activate america --url=climate.america.dev', function ( err, stdout, stderr ) {
// 		msg( 'stdout: ' + stdout );
// 	    msg( 'stderr: ' + stderr );
// 		if( err ) {
// 		 	msg( err.code );
// 		}
// 		callback();
// 	});
// }

// function activateBaseThemeFacts( callback ) {
	
// 	msg('Activating america base theme for sites...');
	
// 	child = exec('/usr/local/bin/wp theme activate america --url=facts.america.dev', function ( err, stdout, stderr ) {
// 		msg( 'stdout: ' + stdout );
// 	    msg( 'stderr: ' + stderr );
// 		if( err ) {
// 		 	msg( err.code );
// 		}
// 		callback();
// 	});
// }

// function activateBaseThemeInteractive( callback ) {
	
// 	msg('Activating america base theme for sites...');
	
// 	child = exec('/usr/local/bin/wp theme activate america --url=interactive.america.dev', function ( err, stdout, stderr ) {
// 		msg( 'stdout: ' + stdout );
// 	    msg( 'stderr: ' + stderr );
// 		if( err ) {
// 		 	msg( err.code );
// 		}
// 		callback();
// 	});
// }

function promptForImport( callback ) {
	msg('');
	prompt.start();
	prompt.get(["Next, you will need to import the america.gov database.\n 1.Copy the  america.gov.sql script to the vagrant directory.\n 2. Run sh db.sh using 'wordpress' as the password'. Hit enter after the import to continue..."], function() {
		callback();
	})
}

function importDB( callback ) {
	process.chdir( '/vagrant' );

	var gunzip = zlib.createGunzip();

	r = fse.createReadStream('america.gov.sql.gz');
	w = fse.createWriteStream( 'america.gov.sql' );

	// uncompresses
	r.pipe( gunzip )  
	 .pipe( w );  

	 // may need to drop wordpress db and recreate it before importing dump		
	
	// import
	child = exec('mysql -u root -p  wordpress < america.gov.sql', function ( err, stdout, stderr ) {
		//msg( 'stdout: ' + stdout );
	    msg( 'stderr: ' + stderr );
		if( err ) {
		 	msg( err.code );
		}
		callback();
	});
}



