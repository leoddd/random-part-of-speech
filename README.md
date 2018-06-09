# random-part-of-speech
Returns one or more random nouns, verbs, adjectives or adverbs, asynchronously through promises.
Each call opens a file exactly once, as a stream. This means that `getAny()` always returns words of the same type in one call.

## Install
```
npm install random-part-of-speech
```

## Usage
```js
const rpos = require('random-part-of-speech');

// Print any single word.
rpos.getAny().then(response => { console.log(response) });
# => ['short wave']

// Print 3 nouns.
rpos.getNouns(3).then(response => { console.log(response) });
# => ['podsolic soil', 'Trichomanes', 'coelenterate']

// Etc.
rpos.getAdjectives(8).then(response => { console.log(response) });
# => ['gilded', 'denigrative', 'spaced-out', 'carinal', 'untempting', 'punishing', 'malevolent', 'short-stemmed']
rpos.getAdverbs(6).then(response => { console.log(response) });
# => ['offstage', 'systematically', 'postoperatively', 'luxuriously', 'over', 'on camera']
rpos.getVerbs(4).then(response => { console.log(response) });
# => ['stagger', 'pollenate', 'dock', 'unclothe']
```