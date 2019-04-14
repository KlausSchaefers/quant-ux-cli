# Quant-UX -CLI


The Quant-UX-CLI tool allwos you to generate code out of your Quant-UX designs. Create a design at http://v2.quant-ux.com and run the cli to generate, CSS, HTML and Vue.js code

## Howto:
You need a .quant-ux.json file in your root directory.

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
    "overwrite": true,
    "css": {
        "responsive": true
    }
}
```

The token identifies your prototype. You can optain it the editor on quant-ux.com.

Then simply run
```
quant-ux
```

## Dev Tips
npm link

npm publish