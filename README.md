# Twig Prune

## Table of Contents
- [About](#about)
- [Installation](#installation)
- [Setup](#setup)
- [Usage](#usage)
- [Documentation](#documentation)

## About
Twig Prune scans a given directory, identifies unused Twig templates, and exposes the option to remove them.

## Installation
```
npm install twig-prune
```

## Setup
`twig-prune` does not require any additional setup.

## Usage
After installation, import the `twigPrune` function as follows:

```
var twigPrune = require( 'twig-prune' );
```

To scan a directory in 'dry run' mode, invoke the `twigPrune()` function as follows:

```
twigPrune( {
    entryDir: 'path/to/repo/dir',
    viewsDir: 'path/to/twig/views/dir',
} );
```

Note that 'dry run' mode will log out any unused/unreferenced Twig templates, but *will not* remove them from the file system.

In order to identify *and* remove unused/unreferenced templates, invoke `twigPrune()` as follows:

```
twigPrune( {
    entryDir: 'path/to/repo/dir',
    viewsDir: 'path/to/twig/views/dir',
    force: true,
} );
```

## Documentation
Currently, Twig Prune does not include any external documentation.

For an overview of the project's evolution, please consult the CHANGELOG.
