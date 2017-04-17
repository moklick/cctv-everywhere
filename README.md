CCTV Everywhere
===============

A creepy CCTV Widget for your website. **Demo:** [http://moklick.github.io/cctv-everywhere/](http://moklick.github.io/cctv-everywhere/)

## Installation

```
$ npm install --save cctv-everywhere
```

## Usage

```js

/**
* Starts the cctv camera at the position and in the color of your choice.
* For the lazy: Just do cctv.watch();
*/
const cctv = require('cctv-everywhere');

cctv.watch({
  side: 'left', // default 'left'
  top: '50px',  // default '75px'
  color: 'rgba(0,0,0,.8)' // default '#303030'
});
    
```
