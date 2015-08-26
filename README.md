# Design Dev Box

Built on [VCCW](http://vccw.cc/).

Clone this repo and change into the directory:

```
$ git clone git@github.com:USStateDept/design-dev-box.git design
$ cd design/
```

The default IP address might conflict if you have a lot of virtual machines or
other entries in your `/etc/hosts` file. That said, you should only change the
following in the `site.yml` file:

```yml
#
# Network Settings
#
ip: 192.168.33.44

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
[vagrant@design www]$ ls -la
total 24
drwxr-xr-x. 1 vagrant vagrant  306 Aug 25 19:39 .
drwxr-xr-x. 1 vagrant vagrant  408 Aug 25 19:33 ..
-rw-r--r--. 1 vagrant vagrant  843 Aug 25 19:33 composer.json
-rw-r--r--. 1 vagrant vagrant 6325 Aug 25 19:33 composer.lock
-rw-r--r--. 1 vagrant vagrant  261 Aug 25 19:39 .gitignore
-rw-r--r--. 1 vagrant vagrant  236 Aug 25 19:39 .htaccess
-rw-r--r--. 1 vagrant vagrant  410 Aug 25 19:33 index.php
drwxr-xr-x. 1 vagrant vagrant  748 Aug 25 19:39 wp
drwxr-xr-x. 1 vagrant vagrant  102 Aug 25 19:33 wp-content
```

Change to the `wp` directory, and move the `wp-config.php` up a level to `www`. Then chance to the `www` directory.

```
[vagrant@design www]$ cd wp/
[vagrant@design wp]$ mv wp-config.php ../
[vagrant@design wp]$ cd ../
[vagrant@design www]$ ls -la
total 28
drwxr-xr-x. 1 vagrant vagrant  340 Aug 25 19:46 .
drwxr-xr-x. 1 vagrant vagrant  408 Aug 25 19:33 ..
-rw-r--r--. 1 vagrant vagrant  843 Aug 25 19:33 composer.json
-rw-r--r--. 1 vagrant vagrant 6325 Aug 25 19:33 composer.lock
-rw-r--r--. 1 vagrant vagrant  261 Aug 25 19:39 .gitignore
-rw-r--r--. 1 vagrant vagrant  236 Aug 25 19:39 .htaccess
-rw-r--r--. 1 vagrant vagrant  410 Aug 25 19:33 index.php
drwxr-xr-x. 1 vagrant vagrant  714 Aug 25 19:46 wp
-rw-r--r--. 1 vagrant vagrant 1768 Aug 25 19:39 wp-config.php
drwxr-xr-x. 1 vagrant vagrant  102 Aug 25 19:33 wp-content
```

You'll need to install either `nano`, `vim`, or another \*nix text editor:

```
[vagrant@design www]$ sudo yum install vim
...

```

Edit the `wp-config.php` file:
```
[vagrant@design www]$ vim wp-config.php
```

Add the following just before the `/* That's all, stop editing! Happy blogging. */`:

```java
...

// Tells Wordpress to look for the wp-content directory in a non-standard location
define( 'WP_CONTENT_DIR', dirname(__FILE__) . '/wp-content' );
define( 'WP_CONTENT_URL', WP_HOME . '/wp-content' );

/* That's all, stop editing! Happy blogging. */
...
```

Make sure you can log into http://design.dev/wp/wp-admin/. You'll likely get a SSL warning:

![Chrome SSL warning](https://github.com/USStateDept/design-dev-box/blob/master/sec-warning.jpg)

Now for some fun! Delete the Wordpress installation:

```
[vagrant@design www]$ rm -rf wp/
```

And run `composer install`:

```
[vagrant@design www]$ composer install
...

[vagrant@design www]$ ls -la
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
