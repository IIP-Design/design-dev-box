<?php
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, and ABSPATH. You can find more information by visiting
 * {@link http://codex.wordpress.org/Editing_wp-config.php Editing wp-config.php}
 * Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */

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

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
/*if (getenv('DEV') == 'True') {
    define('WP_DEBUG', true);
    define('WP_DEBUG_LOG', true);
} else {
    define('WP_DEBUG', false);
}*/

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

/* Multisite */
/*define( 'WP_ALLOW_MULTISITE', true);

define('MULTISITE', true);
define('SUBDOMAIN_INSTALL', true);
define('DOMAIN_CURRENT_SITE', 'design.dev'); //getenv('OPENSHIFT_APP_DNS'))
define('PATH_CURRENT_SITE', '/');
define('SITE_ID_CURRENT_SITE', 1);  
define('BLOG_ID_CURRENT_SITE', 1);

define('WP_DEFAULT_THEME', 'newspaper');

define('SUNRISE', 'on'); // wordpress-mu-domain-mapping activation*/


/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');


