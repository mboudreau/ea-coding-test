# EnergyAustralia Coding Test by Michel Boudreau

Hello EA people,

Install the dependencies first by doing `npm install` and you can then run the tests by doing `npm test`.

Start the program by doing `npm start` which will run a CLI program that lists the cars in a grouped alphabetical order based on the make. 

All tests are within `*.spec.ts` files.

This is hosted on a private github repo (if you want to get access, please give me your github username) and running on TravisCI on commit/push to make sure there's no issues.

## Analysis/Decisions

The problem itself seems simply enough, but is worded in a weird way and depending on an individual's interpretation, could result in a wrong outcome.  The example given also doesn't clarify what is the make vs the model, and which should explicitly be alphabetized.  In a normal situation, I would request to clarify further.

From a code perspective, the main issue is to eliminate/merge any data duplicates and to reduce the amount of loops through the data as it will get exponentially more costly as data increases.  From a professional aspect, if this was asked of me to be done on the front-end, I would push back and ask/implement it on the backend instead as this feels like this logic should belong on the backend as it can be optimized further there than in a browser.

As a retrospective, I'm not particularly happy with how the code ended because it feels more complicated than it needs to and I constantly have a nagging voice at the back of my head screaming "WHHHHHYYYYYYYY", since I do now know the purpose or use of this data for an end user.  There are probably more loops than needed, but reducing the amount of loops would decrease it's legibility for the next developer.

### API

I've decided to [generate the typescript API](http://editor.swagger.io/) (`swagger/api.ts`) based on the swagger.json that I could find within the javascript for the coding site (saved to `swagger/swagger.json`) instead of creating my own service as this would be closer to the 'truth'.  This could easily be regenerated automatically based on the swagger.json when it gets updated, but I didn't get the time to add this functionality in.

### Tests

Using mocha with chai as a testing framework since it works very well with Promises/async.  I use the standard of using `*.spec.ts` files to denote they are tests.

A few tests are lacking as I ran out of time to work on this, like testing for an API error (HTTP code 400), or what happens when some of the data is missing, or if an empty list is returned.

### Build

I didn't have enough time to create a proper build system and opted to use `ts-node` to compile & run quickly.  I would normally spend the time to implement a gulp/webpack build process to watch files while I develop, with a release task to compile and minify the javascript before being packaged and deploy.

### CI/Deployment

I've added a simple travis file that simply runs the tests on commit/push.  For front-end project, I tend to use a tag to note deployment should happen, which I would normally suggest to deploy to an S3 Website that's being Cloudfront.

