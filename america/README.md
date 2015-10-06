# America.dev Multisite

Built on top of the [Design Dev Box](https://github.com/USStateDept/design-dev-box).

## Setup
1. Install [VirtualBox](https://www.virtualbox.org/) and [Vagrant](http://www.vagrantup.com/).
2. Install the vagrant-hostsupdater plugin (recommended):
```
$ vagrant plugin install vagrant-hostsupdater
```
Windows doesn't allow the `vagrant-hostsupdater` plugin to change the `%SystemRoot%\System32\drivers\etc\hosts` file. You'll need to manually add an entry. For example:

```
...
design.dev  192.168.33.44
...
```

## Directions

1. If you have not already done so, clone the design-dev-box repo as 'design-dev-boxes'
```
$ git clone git@github.com:USStateDept/design-dev-box.git design-dev-boxes
```
2. Go to america directory: `cd america`
3. Run npm install: `npm install`
4. Run node install.js: `node install.js`
5. Follow instruction in the script