# lens
Create screenshots of your webpage in different resolutions in a matter of seconds.

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

  Usage: -u <url> -r <resolution>
  
  Options:
        --help        Show help                                          [boolean]
        --version     Show version number                                [boolean]
    -u, --url         The url from which screenshots will be taken. If you want to
                      create screenshots from multiple urls separate them with a
                      space.(e.g. https://example.com https://example.com/subpage)
                                                               [string] [required]
    -r, --resolution  Custom resolution (e.g. 800x600). If you want to create
                      screenshots for multiple resolutions separate them with a
                      space (e.g. 800x600 1920x1080)           [string] [required]
    -t, --tag         Custom tag that will be used as a subdirectory for 
                      screenshots                           [string] [default: ""]
                      
  Examples:
    lens -u https://example.com -r 1280x720
    lens -u "https://example.com https://example.com/subpage" -r 1920x1080
    lens -u https://example.com -r "800x600 1280x720"
    lens -u https://example.com -r 1280x720 -t "custom tag"
```

```lens``` will create a **screenshots** directory in a place where you will run it.
For example if you run it in ```C:\lens\``` it will create ```C:\lens\screenshots``` directory.
