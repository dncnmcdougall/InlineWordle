import {taboo} from './taboo.js';
const sizeScale = 3;

var render = preact.render;
var h = preact.h;

const lowestSplit = function(text) {
    const vals = [" ",",",".","- ","(",")",":","\"","\n"];
    const min = vals.reduce( (previous, current) => {
        const val = text.indexOf(current);
        if ( val >= 0 ) {
            return Math.min(previous, val);
        }
        return previous;
    }, text.length);

    return {
        'first': text.slice(0, min),
        'div': text[min],
        'second': text.slice(min+1)
    };
};


const addWord = function(word, dictionary, count) {
    word = word.toLowerCase();
    if ( dictionary[word] ) {
        dictionary[word].count++;
    } else {
        dictionary[word] = {
            'word': word,
            'count': 1
        };
    }
    if ( taboo.indexOf(word) !== -1 ) {
        dictionary[word].count = 1;
    }
    count.max = Math.max(dictionary[word].count, count.max);
    count.total++;
}

const renderWord = function(word, colourDictionary, wordCounts, total) {
    const normalWord = word.toLowerCase();
    let count = wordCounts[normalWord];
    let size = 1;
    if ( count ) {
        size = 1+ (count.count/total)*sizeScale;
    } else if ( word === "\n" ) {
        return h('br',{},[]);
    }
    let style = 'font-size:'+ size+'em;';
    if ( normalWord in colourDictionary ) {
        style += 'background:'+colourDictionary[normalWord];
    }
    return h('span', {'style': style}, [word] );
};


const main = function( renderTarget, previous, wordColours, text) {
    let result = [];
    let wordCounts = {};
    let splitObj = lowestSplit(text);
    let word = "";
    let count = {
        total: 0,
        max: 0
    };
    while( splitObj.second.length > 0 ) {
        word =  splitObj['first'];
        if ( word.length > 0 ){
            result.push( word );
            addWord(word, wordCounts, count);
        }
        result.push( splitObj['div']);
        splitObj = lowestSplit(splitObj['second']);
    }
    word =  splitObj['first'];
    if ( word.length > 0 ){
        result.push( word );
        addWord(word, wordCounts, count);
    }
    result.push( splitObj['div']);
    result = result.filter( (value) => value && value.length>0);

    let colourDictionary = {};
    wordColours.forEach( function(colourObj) {
        let words = colourObj.words.split(' ');
        words.forEach( function(word) {
            if ( ! (word in colourDictionary) ) {
                colourDictionary[word] = colourObj.colour;
            }
        });
    });

    var mapRender = function(currentWord) {
        return renderWord(currentWord, colourDictionary, wordCounts, count.max);
    };

    return render( h('div', {}, result.map(mapRender)), renderTarget, previous);
};

export { main };
