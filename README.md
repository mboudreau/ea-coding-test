# EnergyAustralia Coding Test by Michel Boudreau

Hello EA people,

Install the dependencies first by doing `npm install` and you can then run the tests by doing `npm test`.

Start the program by doing `./index.js` which will show you a CLI program that I created as an interface to test out any combinations that you want.  If you wanted to show the output of the third scenario in the coding test, you would run: 

`./index.js list`

All tests are within `*.spec.ts` files.  If you want to change the data like the pricing rules, it's all included in the `db`.  This could have been a real database but figured to keep it simple for the time being.

This is hosted on a private github repo (keep it on the DL) and running on TravisCI on commit/push to make sure there's no issues.
