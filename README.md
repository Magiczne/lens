# lens
[![npm][badge]][0]

Create screenshots of your webpage in different resolutions in a matter of seconds.

By default, **lens** will generate screenshots for some common screen resolutions.
You can find more info by exploring files in the [resolutions][1] directory.

## Prerequisites
- Node.js >= 12

## Installation

```
npm install -g @magiczne/lens
```

```
yarn global add @magiczne/lens
```

## Usage

```
lens --help
  
  Options:
        --help        Show help                                          [boolean]
        --version     Show version number                                [boolean]
    -u, --url         The url from which screenshots will be taken. If you want to
                      create screenshots from multiple urls separate them with a
                      space (e.g. https://example.com https://example.com/page).
                      Remember to include protocol (http:// or https://).  [array]
    -r, --resolution  Custom resolution (e.g. 800x600). If you want to create
                      screenshots for multiple resolutions separate them with a
                      space (e.g. 800x600 1920x1080)                       [array]
    -t, --tag         Custom tag that will be used as a subdirectory for
                      screenshots                           [string] [default: ""]
    -i, --input-dir   Input directory with screenshot rules               [string]
    -o, --output-dir  Output directory for the screenshots                [string]
                      
  Examples:
    lens -u https://example.com
    lens -u https://example.com -r 1280x720
    lens -u https://example.com https://example.com/subpage -r 1920x1080
    lens -u https://example.com -r 800x600 1280x720 -o ./output
    lens -u https://example.com -r 1280x720 -t "custom tag"

  For advanced usage documentation please visit https://github.com/Magiczne/lens
```

## Advanced configuration

**lens** can be configured both locally and globally. When using **lens** globally, you can
configure it in either a `.lens.config.js` or `.lens.config.json` located in your home directory.
When using **lens** locally you can configure it using the same files, but located in your project root directory.

> **WARNING**
> 
> If you pass `-i` or `-o` argument in the CLI the corresponding values from config files will be overridden!

Currently, these are options you can configure:

| Option              | Type               | Default                  | Description                              |
|---------------------|--------------------|--------------------------|------------------------------------------|
| chunkSize           | number             | 5                        | Number of screenshots to be taken at once. You can disable limit by putting 0 zero, but keep in mind it will consume your RAM. |
| directories.input   | string             | './rules'                | Input directory with rule files.         |
| directories.output  | string             | './screenshots'          | Output directory for the screenshots.    |
| puppeteer.headless  | boolean            | true                     | Whether to run browser in headless mode. |
| puppeteer.waitUntil | string \| string[] | ['load', 'networkidle2'] | When to consider navigation succedeed. Refer to the [puppeteer docs][2] for detailed information. |

Example config:

**.lens.config.js**
```javascript
module.exports = {
    chunkSize: 10,
    directories: {
        input: './input',
        output: './output'
    },
    puppeteer: {
        headless: true,
        waitUntil: ['load', 'domcontentloaded', 'networkidle2']
    }
}
```

**.lens.config.json**
```json
{
    "chunkSize": 10,
    "directories": {
        "input": "./input",
        "output": "./output"
    },
    "puppeteer": {
        "headless": true,
        "waitUntil": ["load", "domcontentloaded", "networkidle2"]
    }
}
```

## Rule files

You can create rules file to create more than one set of screenshots at a time. 
Also, you can use `afterPageLoaded` hook to run some code before the screenshot will be taken. 
Look what you can do in the puppeteer `Page` class 
[documentation](https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#class-page).

If input directory contains more than one rule file, each one will be loaded and parsed.

### Ruleset options
| Option              | Type               | Default                  | Description                              |
|---------------------|--------------------|--------------------------|------------------------------------------|
| disable             | boolean            | `false`                  | If set to `true` screenshots for rules defined in this file will not be taken. |
| rules               | array              |                          | **required**. Array of screenshot rules. |

### Rule options
| Option              | Type               | Default                  | Description                              |
|---------------------|--------------------|--------------------------|------------------------------------------|
| url                 | string             |                          | **required**. The url from which screenshots will be taken. |
| tag                 | string             |                          | **required**. Custom tag that will be used as a subdirectory. |
| renderFor           | array              | `['desktop', 'tablet', 'phone']` | Array which can be: <ul><li>a list of keys which correspond to default viewports included with **lens**. Available values are `'desktop'`, `'tablet'` or `'phone'`.</li><li>a set of custom puppeteer [Viewports][3]</ul> **CAUTION!** <br> These options cannot be mixed. Rule parser will throw an error when you do like so. |
| afterPageLoaded     | async function     | `undefined`              | Callback function which takes [`page`][2] as a parameter. It will be executed before the screenshot will be taken. |

### Example rules file
```javascript
module.exports = {
    disable: true,
    rules: [
        // Simplest configuration
        {
            url: 'https://example.com',
            tag: 'few kittens'
        },
        
        // Exclude mobile viewports
        {
            url: 'https://example.com',
            tag: 'several kittens',
            renderFor: ['desktop', 'tablet']
        },
        
        // Specify custom set of viewports
        {
            url: 'https://example.com',
            tag: 'pack of kittens',
            renderFor: [
                { width: 750, height: 1334, deviceScaleFactor: 2, hasTouch: true, isMobile: true },
                { width: 1920, height: 1080 },
                { width: 720, height: 1280, isLandscape: true }
            ]   
        },

        // Use custom callback, which will execute before screenshot
        {
            url: 'https://example.com',
            tag: 'lots of kittens',
            async afterPageLoaded (page) {
                await page.click('#clickable-element')
            }
        },
        
        // All options combined
        {
            url: 'https://example.com',
            tag: 'horde of kittens',
            renderFor: ['desktop'],
            async afterPageLoaded (page) {
                await page.click('#clickable-element')
            }
        }
    ]
}
```

[badge]: https://img.shields.io/badge/dynamic/json?color=blue&label=npm&query=version&style=flat-square&url=https%3A%2F%2Fraw.githubusercontent.com%2FMagiczne%2Flens%2Fmaster%2Fpackage.json
[0]: https://www.npmjs.com/package/@magiczne/lens
[1]: https://github.com/Magiczne/lens/tree/master/src/resolutions
[2]: https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#pagegotourl-options
[3]: https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#pageviewport
