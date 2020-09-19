# lens
[![npm](https://img.shields.io/badge/dynamic/json?color=blue&label=npm&query=version&style=flat-square&url=https%3A%2F%2Fraw.githubusercontent.com%2FMagiczne%2Flens%2Fmaster%2Fpackage.json)](https://www.npmjs.com/package/@magiczne/lens)

Create screenshots of your webpage in different resolutions in a matter of seconds.

By default, **lens** will generate screenshots for some common screen resolutions.
You can find more info by exploring files in the [resolutions](https://github.com/Magiczne/lens/tree/master/src/resolutions) directory.

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

  Usage: lens -u <url>
  
  Options:
        --help        Show help                                          [boolean]
        --version     Show version number                                [boolean]
    -u, --url         The url from which screenshots will be taken. If you want to
                      create screenshots from multiple urls separate them with a
                      space (e.g. "https://example.com https://example.com/page").
                      Remember to include protocol (http:// or https://).
                                                               [string] [required]
    -r, --resolution  Custom resolution (e.g. 800x600). If you want to create
                      screenshots for multiple resolutions separate them with a
                      space (e.g. "800x600 1920x1080")                    [string]
    -t, --tag         Custom tag that will be used as a subdirectory for 
                      screenshots                           [string] [default: ""]
    -o, --output-dir  Output directory for the screenshots                [string]
                      
  Examples:
    lens -u https://example.com
    lens -u https://example.com -r 1280x720
    lens -u "https://example.com https://example.com/subpage" -r 1920x1080
    lens -u https://example.com -r "800x600 1280x720" -o ./output
    lens -u https://example.com -r 1280x720 -t "custom tag"
```

## Advanced configuration

```lens``` can be configured both locally and globally. When using ```lens``` globally, you can
configure it in either a ```.lens.config.js``` or ```.lens.config.json``` located in your home directory.
When using ```lens``` locally you can configure it using the same files, but located in your project directory.

Currently, these are options you can configure:

| Option              | Type               | Default                  | Description                              |
|---------------------|--------------------|--------------------------|------------------------------------------|
| chunkSize           | number             | 5                        | Number of screenshots to be taken at once. You can disable limit by putting 0 zero, but keep in mind it will consume your RAM. |
| directories.output  | string             | './screenshots'          | Output directory for the screenshots.    |
| puppeteer.headless  | boolean            | true                     | Whether to run browser in headless mode. |
| puppeteer.waitUntil | string \| string[] | ['load', 'networkidle2'] | When to consider navigation succedeed. Refer to the [puppeteer docs](https://github.com/puppeteer/puppeteer/blob/v5.3.0/docs/api.md#pagegotourl-options) for detailed information. |

Example config:

**.lens.config.js**
```javascript
module.exports = {
    chunkSize: 10,
    directories: {
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
        "output": "./output"
    },
    "puppeteer": {
        "headless": true,
        "waitUntil": ["load", "domcontentloaded", "networkidle2"]
    }
}
```
