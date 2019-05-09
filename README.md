# Quant-UX -CLI


The Quant-UX-CLI tool allwos you to generate code out of your Quant-UX designs. 
Create a design at http://v2.quant-ux.com and run the cli to generate, CSS, HTML and Vue.js code

## Install

```
npm install --dev quant-ux-cli
```

## Howto:

Simply run the following command on the commandline. Make sure you are in the correct directory.

```
quant-ux
```

You need a .quant-ux.json file in your root directory. If the file does not exist, the cli will 
request the config parameters from you and create the config file for you. The config file has the 

```
{
    "token": "a2aa10azyyjaG658KWPs7GXyZinYy72N3VfwFobBG1cdgmbYpJK7zTfNKTVe",
    "targets": {
        "vue": "test/src/components",
        "css": "test/src/css",
        "html": "test/src/html"
    },
    "type": "html",
    "server": "https://quant-ux.com",
    "conflict": "overwrite",
    "css": {
        "responsive": true
    }
}
```

The token identifies your prototype. You can optain it the editor on http://v2.quant-ux.com or in the settings page of your prototype.
