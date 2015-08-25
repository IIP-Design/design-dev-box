# Design Dev Box

Built on [VCCW](http://vccw.cc/).

Clone this repo and change into the directory:

```
$ git clone git@github.com:USStateDept/design-dev-box.git design
$ cd design/
```

You should only change the following in the `site.yml` file:

```yml
#
# Network Settings
#
ip: 192.168.33.100

#
# WordPress User
#
admin_user: admin
admin_pass: admin
admin_email: example@example.com
```

Then start the vagrant box by running:

```
$ vagrant up
```

Once it's finished partitioning, ssh into the Vagrant box:

```
$ vagrant ssh
```

Your prompt should look something like this:

```
[vagrant@design ~]$
```

Now change into the `www` directory:

```
[vagrant@design ~]$ cd /vagrant/www/
```

List out the files in the directory. You should have something that looks very much like the following:

```
[vagrant@design ~]$ ls -la
total 24
drwxr-xr-x   6 vagrant vagrant 204 Aug 25 08:45 .
drwxr-xr-x  11 vagrant vagrant 374 Aug 25 08:47 ..
-rw-r--r--   1 vagrant vagrant 261 Aug 25 08:45 .gitignore
-rw-r--r--   1 vagrant vagrant 236 Aug 25 08:45 .htaccess
-rw-r--r--   1 vagrant vagrant 410 Aug 25 08:45 index.php
drwxr-xr-x  22 vagrant vagrant 748 Aug 25 08:45 wp
```

Change to the `wp` directory. And move the `wp-config.php` and `wp-content` directory up a level to `www`.

```
[vagrant@design ~]$ cd wp/
[vagrant@design ~]$ mv wp-config.php wp-content/ ../
[vagrant@design ~]$ cd ../
[vagrant@design ~]$ ls -la
total 32
drwxr-xr-x   8 vagrant  vagrant   272 Aug 25 08:57 .
drwxr-xr-x  11 vagrant  vagrant   374 Aug 25 08:47 ..
-rw-r--r--   1 vagrant  vagrant   261 Aug 25 08:45 .gitignore
-rw-r--r--   1 vagrant  vagrant   236 Aug 25 08:45 .htaccess
-rw-r--r--   1 vagrant  vagrant   410 Aug 25 08:45 index.php
drwxr-xr-x  20 vagrant  vagrant   680 Aug 25 08:57 wp
-rw-r--r--   1 vagrant  vagrant  1764 Aug 25 08:45 wp-config.php
drwxr-xr-x   6 vagrant  vagrant   204 Aug 25 08:45 wp-content
```

Edit the `wp-config.php` file, and add the following just before the `/* That's all, stop editing! Happy blogging. */`:

```java
...

// Tells Wordpress to look for the wp-content directory in a non-standard location
define( 'WP_CONTENT_DIR', dirname(__FILE__) . '/wp-content' );
define( 'WP_CONTENT_URL', WP_HOME . '/wp-content' );

/* That's all, stop editing! Happy blogging. */
...
```

Make sure you can access http://design.dev and log into http://design.dev/wp/wp-admin/.

Now for some fun! Delete the Wordpress installation:

```
[vagrant@design ~]$ rm -rf wp/
```

And run `composer install`:

```
[vagrant@design ~]$ composer install
...

[vagrant@design ~]$ ls -la
total 28
drwxr-xr-x. 1 vagrant vagrant  374 Aug 25 18:30 .
drwxr-xr-x. 1 vagrant vagrant  408 Aug 25 18:18 ..
-rw-r--r--. 1 vagrant vagrant  843 Aug 25 18:27 composer.json
-rw-r--r--. 1 vagrant vagrant 6325 Aug 25 18:30 composer.lock
-rw-r--r--. 1 vagrant vagrant  261 Aug 25 17:04 .gitignore
-rw-r--r--. 1 vagrant vagrant  236 Aug 25 17:04 .htaccess
-rw-r--r--. 1 vagrant vagrant  410 Aug 25 17:04 index.php
drwxr-xr-x. 1 vagrant vagrant  170 Aug 25 18:23 vendor
drwxr-xr-x. 1 vagrant vagrant  714 Aug 25 18:30 wp
-rw-r--r--. 1 vagrant vagrant 1885 Aug 25 18:16 wp-config.php
drwxr-xr-x. 1 vagrant vagrant  204 Aug 25 17:04 wp-content
```

Welcome to the wonderful world of Composer, where Wordpress is just a dependency. Make sure you can access http://design.dev and log into http://design.dev/wp/wp-admin/.
