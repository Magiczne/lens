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

  Usage: -u <url>
  
  Options:
        --help        Show help                                          [boolean]
        --version     Show version number                                [boolean]
    -u, --url         The url from which screenshots will be taken. If you want to
                      create screenshots from multiple urls separate them with a
                      space.(e.g. https://example.com https://example.com/subpage)
                                                               [string] [required]
    -r, --resolution  Custom resolution (e.g. 800x600). If you want to create
                      screenshots for multiple resolutions separate them with a
                      space (e.g. 800x600 1920x1080)                      [string]
    -t, --tag         Custom tag that will be used as a subdirectory for 
                      screenshots                           [string] [default: ""]
                      
  Examples:
    lens -u https://example.com
    lens -u https://example.com -r 1280x720
    lens -u "https://example.com https://example.com/subpage" -r 1920x1080
    lens -u https://example.com -r "800x600 1280x720"
    lens -u https://example.com -r 1280x720 -t "custom tag"
```

```lens``` will create a **screenshots** directory in a place where you will run it.
For example if you run it in ```C:\lens\``` it will create ```C:\lens\screenshots``` directory.

## Advanced configuration

```lens``` can be configured both locally and globally. When using ```lens``` globally, you can
configure it in either a ```.lens.config.js``` or ```.lens.config.json``` located in your home directory.
When using ```lens``` locally you can configure it using the same files, but located in your project directory.

Currently, these are options you can configure:

| Option              | Type               | Default                  | Description                              |
|---------------------|--------------------|--------------------------|------------------------------------------|
| puppeteer.headless  | boolean            | true                     | Whether to run browser in headless mode. |
| puppeteer.waitUntil | string \| string[] | ['load', 'networkidle2'] | When to consider navigation succedeed. Refer to the [puppeteer docs](https://github.com/puppeteer/puppeteer/blob/v5.3.0/docs/api.md#pagegotourl-options) for detailed information. |
