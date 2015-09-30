<?php


// ** MySQL settings ** //
/** The name of the database for WordPress */
define('DB_NAME', 'wordpress');

/** MySQL database username */
define('DB_USER', 'wordpress');

/** MySQL database password */
define('DB_PASSWORD', 'wordpress');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

define('AUTH_KEY',         'UWm+v<K4H0W/P=T!C3M_L5jcElpx*2k3R=pA/6${dC#+YaCWi/6chy0|XC7Mwb,o');
define('SECURE_AUTH_KEY',  'ovNeXWDG>DMbUR#f7Zwu }b@f-w.ky>%<wByKH%+|LV=e~MIom<k`-<x].[lA}Tb');
define('LOGGED_IN_KEY',    '?H8OFW+B=HF>Ob~hJ[v.dZ,[TLtsw+oPKie~o~Vm-?u)e):e%tlhm97%_4%|P/D#');
define('NONCE_KEY',        'T%jD>e<aqt`-/>%gyvZ*[Q2NLFG8;K;+*XonE]hhD}:I:x+S?`=U%d+c1Y9VRRvq');
define('AUTH_SALT',        '@eXz,m&-{yZ3%=_e*0c82~Ap>Wd(2m3&N3[$3<4*R3&E/aGRkinN>{dj<D?uKs7p');
define('SECURE_AUTH_SALT', '&+#7MWf|0YD[O,NmEav]|}/-<u/wB#$YHZe#9|$XJmv=m2AP%ym/8b9sy7,YB!,9');
define('LOGGED_IN_SALT',   '4+3;ZLjsT1(yOS;%RMOa<k]pBpoV8c5*%0v%J*w%SPuI7`/sF`D95|)4u+v4G%lq');
define('NONCE_SALT',       '&j%t|3t+B#5wv-O%qfj2)=?a!M8fse$+mq8FKyrSLFX9~Acgb-GL;JJC)yYyM2Y}');


$table_prefix = 'wp_';


define( 'WP_HOME', 'http://yali.state.dev' );
define( 'WP_SITEURL', 'http://yali.state.dev/wp' );
define( 'JETPACK_DEV_DEBUG', true );
define( 'WP_DEBUG', true );
define( 'FORCE_SSL_ADMIN', true );
define( 'SAVEQUERIES', false );


// Tells Wordpress to look for the wp-content directory in a non-standard location
define('WP_CONTENT_DIR', __DIR__ . '/wp-content');

if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) and $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https') {
    define('WP_CONTENT_URL', 'https://' . $_SERVER['SERVER_NAME'] . '/wp-content');
    define('WP_SITEURL', 'https://' . $_SERVER['SERVER_NAME'] . '/wp');
    define('WP_HOME', 'https://' . $_SERVER['SERVER_NAME']);
        $_SERVER['HTTPS']='on';
} else {
    define('WP_CONTENT_URL', 'http://' . $_SERVER['SERVER_NAME'] . '/wp-content');
    define('WP_SITEURL', 'http://' . $_SERVER['SERVER_NAME'] . '/wp');
    define('WP_HOME', 'http://' . $_SERVER['SERVER_NAME']);
}

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
    define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');