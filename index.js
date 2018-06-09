//////////////////////////////
// Package that returns random parts of speech using a pre-parsed and dumbed down version of the WordNet word database.
/////
// To fetch an array of random words, simply use the exported getX(amount) functions, where X is the desired part of speech and amount is the amount of words.
// Returns a Promise that will resolve to an array of words, even if only one word is requested.
//
// Examples:
//	getVerbs();
//	getNouns();
//	getAverbs(3);
//	getAdjectives(2);
//	getAny();
//
// Note that getAny() always returns words of the same time, so as to not open more than one data file.


const fs = require('fs');
const seekableStream = require('fs-readstream-seek');


const VERB = "verb", NOUN = "noun", ADVERB = "adverb", ADJECTIVE = "adjective", ANY = "any";

// Exposed functions.
module.exports = {
	getVerbs: (amount = 1) => getWord(VERB, amount),
	getNouns: (amount = 1) => getWord(NOUN, amount),
	getAdverbs: (amount = 1) => getWord(ADVERB, amount),
	getAdjectives: (amount = 1) => getWord(ADJECTIVE, amount),
	getAny: (amount = 1) => getWord(ANY, amount),
};


// Produces a data file path.
function getPathOfType(type) {
	if(type === ANY) {
		type = [NOUN, VERB, ADVERB, ADJECTIVE][randomInt(0, 3)];
	}

	return `${__dirname}/word_files/${type}s.words`;
}

// Returns a random word
function getWord(type, amount) {
	return new Promise((resolveMain, rejectMain) => {
		if(amount <= 0) {
			resolveMain([]);
			return;
		}

		try {
			// Open the desired file as a stream to freely seek around it.
			const data_path = getPathOfType(type);
			const file_size = fs.stat(data_path, (err, stats) => {
				if(err) {
					rejectMain(err);
					return;
				}

				var data_stream = new seekableStream(data_path);
				data_stream.setEncoding('utf8');

				// Grab a random word from the stream `amount` times.
				var promise_array = [];
				for (var i = amount - 1; i >= 0; i--) {

					promise_array.push(
						() => new Promise((resolve, reject) => {
							data_stream.seek(randomInt(0, stats.size - 1));
							data_stream.on('data', chunk => {
								chunk = chunk.split("\n");
								if(chunk.length < 2) {
									// If the chunk has no actual full word line (this means it ended up on the LAST word), return and let this run once more.
									data_stream.seek(randomInt(0, stats.size));
									return;
								}

								data_stream.removeAllListeners('data');
								resolve(chunk[1]);
								return;
							});
						})
					);

				}

				promise_array.reduce((chain, nextPromiseFunc) => {
					return chain.then(word_array => {
						return nextPromiseFunc().then(last_word => {
							return [...word_array, last_word];
						});
					});
				}, Promise.resolve([]))
				.then(word_array => {
					data_stream.destroy();
					resolveMain(word_array);
				});

			});

		} catch(err) {
			rejectMain(err);
			return;
		}

	});
}


// Return a random whole number.
function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}