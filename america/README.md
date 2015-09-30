# America.dev Multisite

Built on top of the [Design Dev Box](https://github.com/USStateDept/design-dev-box).

## Directions

Clone the dev box as `america`:

```
$ git clone git@github.com:USStateDept/America.gov-Dev-Box.git america
```

Change to `america`:

```
$ cd america
```

Clone the America.gov repo as `www` and change to that directory.

```
$ git clone git@github.com:IIP-Design/America.gov.git www
$ cd www
```

Start a local tracking branch for each of the repo's other remote branches, and switch back to `master`:

```
$ git checkout -b dev origin/dev
$ git checkout -b staging origin/staging
$ git checkout master
```

Move the `wp-config.php` file from `www` to the `america` directory, delete the `.htaccess` file, and change to the the `america` directory:

```
$ mv wp-config.php ../
$ rm .htaccess
$ cd ../
```

If necessary, edit the `site.yml` file and change the fields below if the defaults conflict with your hosts file (`/etc/hosts`).

```yml
#
# Network Settings
#
hostname: america.dev
ip: 192.168.33.45
```

Spin up Vagrant, and let it run through it's provisioning process.

```
$ vagrant up
```

Move to the `www` directory:

```
$ cd www
```

Move the `wp-config.php` file from `www/wp` to `www`:

```
$ mv wp/wp-config.php ./
```

Edit the wp-config.php file and add the following just before the `/* That's all, stop editing! Happy blogging. */` in www/wp-config.php:

```java
...

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
...
```

Install dependencies with Composer:

```
$ composer install
```

Log into the Wordpress Admin on http://america.dev/wp/wp-admin/. Update the database as prompted, and then hit the "continue" button. Username: admin and Password: admin

Go to Appearance > Themes. Activate the Genesis Base Theme.

Visit the front end to make sure everything is working properly.

SSH into the Vagrant box:

```
$ vagrant ssh
```

Install vim or your favorite \*nix text editor:

```
$ sudo yum install vim
```

Change to the Apache configuration directory, and create the `envvar.conf` file:

```
[vagrant@america ~]$  cd /etc/httpd/conf.d
[vagrant@america conf.d]$ sudo vim envvar.conf
```

Add the following. You'll need to add the salts from your `www/wp-config.php`. **Don't use these**:

```apache2
SetEnv  AUTH_KEY                        'tQ.]!CiUVLUwPRH+_BPH X=ry11c$shHa^VxiO[5vf|6+%F3|5TI2tbr]x!2>+6T'
SetEnv  SECURE_AUTH_KEY                 'fjS8OxiG&tty-rf,9>dFm)Th79g>qr+iq.Yv-`@BS+?JxF,[@~tO.+nWs>qL~s}t'
SetEnv  LOGGED_IN_KEY                   'qvqq<fJAIDJK~YfEL>|X-.$$Tc]vJL(1+K;M}A$m4:wVo|G_ #V5<@y,+D5_Or$E'
SetEnv  NONCE_KEY                       '!sF)xn6IF-V&O`[rb$*6Rc+-~/6q>boo~2v 7|k1I~{5ou>,ZIW}]S1p;[UVj?5R'
SetEnv  AUTH_SALT                       ':?H3(V5U,TV(HA3ajI^u`bcw@}H4NfR/)q+))Ilpy e**j:^TXP4X,KQrc;6m|tO'
SetEnv  SECURE_AUTH_SALT                'sT]1s02Nw4wN__]ei;~u&MR|2hRIHTT#6I_2Vg|5t4}ur?PeHcC+2BMx-[d8|/jg'
SetEnv  LOGGED_IN_SALT                  'b5v`~mOe,Nuh#4b.ol2 HSH.A)H,`{659P*&L.*EX0}Uk?UJKpud?~y0wMR+N;1>'
SetEnv  NONCE_SALT                      ',3K&W|]XzlAb`CFcM%|=MZ8cQ,DM_r7x51dKum,i|LUlaB2zeb &iB7>9yB|j0L+'

SetEnv  OPENSHIFT_APP_NAME              'wordpress'
SetEnv  OPENSHIFT_MYSQL_DB_USERNAME     'wordpress'
SetEnv  OPENSHIFT_MYSQL_DB_PASSWORD     'wordpress'
SetEnv  OPENSHIFT_MYSQL_DB_HOST         'localhost'
SetEnv  OPENSHIFT_MYSQL_DB_PORT         '3306'
SetEnv  OPENSHIFT_APP_DNS               'america.dev'

SetEnv  DEV                             'True'
SetEnv  SUBDOMAIN_INSTALL               'True'
```

Restart Apache:

```
[vagrant@america conf.d]$ sudo apachectl restart
```

Change to `/vagrant/www/`

```
[vagrant@america conf.d]$ cd /vagrant/www/
```

Delete the `wp-config.php`:

```
[vagrant@america www]$ rm wp-config.php

```

Move the America.gov wp-config.php file into it's place:

```
[vagrant@america www]$ mv ../wp-config.php ./
```

Edit the `wp-config.php` file. **Search for WP_SITEURL and make sure it points to `/wp`**. Also comment out the Multsite bit and save:

```java
/* Multisite */
/*define( 'WP_ALLOW_MULTISITE', true);

define('MULTISITE', true);
if (getenv('SUBDOMAIN_INSTALL') == 'True') {
	define('SUBDOMAIN_INSTALL', true);
} else {
	define('SUBDOMAIN_INSTALL', false);
}
define('DOMAIN_CURRENT_SITE', getenv('OPENSHIFT_APP_DNS'));
define('PATH_CURRENT_SITE', '/');
define('SITE_ID_CURRENT_SITE', 1);
define('BLOG_ID_CURRENT_SITE', 1);

define('WP_DEFAULT_THEME', 'genesis');

define('SUNRISE', 'on'); // wordpress-mu-domain-mapping activation*/

```

Confirm that you can still connect to the DB by going to http://america.dev. Confirm that you can login to http://america.dev/wp/wp-login.php.

Turn on Multisite in the `www/wp-config.php` file by uncommenting the following:

```java
...
define( 'WP_ALLOW_MULTISITE', true);

/* That's all, stop editing! Happy blogging. */
...
```

Refresh the [Wordpress Admin](http://america.gov/wp/wp-admin/), and then go to Tools > Network Setup.

Choose Subdomains, and add your email address, if you like. Click Install.

In `www/wp-config.php`, uncomment the following:

```java
define('MULTISITE', true);
if (getenv('SUBDOMAIN_INSTALL') == 'True') {
	define('SUBDOMAIN_INSTALL', true);
} else {
	define('SUBDOMAIN_INSTALL', false);
}
define('DOMAIN_CURRENT_SITE', getenv('OPENSHIFT_APP_DNS'));
define('PATH_CURRENT_SITE', '/');
define('SITE_ID_CURRENT_SITE', 1);
define('BLOG_ID_CURRENT_SITE', 1);

define('WP_DEFAULT_THEME', 'genesis');
```

Also in `www/wp-config.php` remove the block that looks like this, add the following, and save:

```java
if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) and $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https') {
	define('WP_CONTENT_URL', 'https://' . $_SERVER['SERVER_NAME'] . '/wp-content');
	define('WP_SITEURL', 'https://' . $_SERVER['SERVER_NAME'] . '/');
	define('WP_HOME', 'https://' . $_SERVER['SERVER_NAME']);
        $_SERVER['HTTPS']='on';
} else {
	define('WP_CONTENT_URL', 'http://' . $_SERVER['SERVER_NAME'] . '/wp-content');
	define('WP_SITEURL', 'http://' . $_SERVER['SERVER_NAME'] . '/');
	define('WP_HOME', 'http://' . $_SERVER['SERVER_NAME']);
}
```

Check that you're in `www`, and replace the `.htaccess` file the one in the America.gov repo:

```
$ pwd
../../../america/www
$ curl -O https://raw.githubusercontent.com/IIP-Design/America.gov/master/.htaccess
```

Make sure you can still access the http://america.dev, and that you can login: http://america.dev/wp-login.php. **Note**: The login url changed!

The last edit you should have to make to `www/wp-config.php` is to uncomment the following line:

```java
define('SUNRISE', 'on'); // wordpress-mu-domain-mapping activation
```

Now refresh the [Network Admin](https://america.dev/wp-admin/network/).

In the Network Admin, go to the Plugins menu, and Network Activate the America Theme Extender.

Then go to the Themes menu and Network Activate the America.gov Base Theme.

Let's add the following sites to the network by going to the Sites menu:

* Climate Partners (climate.america.dev)
* Interactive (interactive.america.dev)
* Don't Be Fooled (facts.america.dev)
* Documentation (docs.america.dev)

Visit each site's Wordpress Admin and activate the America.gov Base Theme.

Go to the Genesis menu and import each of the `.json` theme settings files found in `america/theme-settings`.

After activating it in each site and uploading the theme settings, visit the site to make sure no errors occurred.

You should now have a basic development environment, that doesn't include any data.
