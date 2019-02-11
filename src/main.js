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

const renderWord = function(word, words, total) {
    let count = words[word.toLowerCase()];
    let size = 1;
    if ( count ) {
        size = 1+ (count.count/total)*sizeScale;
    } else if ( word === "\n" ) {
        return h('br',{},[]);
    }
    return h('span', {style: 'font-size:'+ size+'em'}, [word] );
};


const main = function( renderTarget, previous, text) {
    let result = [];
    let words = {};
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
            addWord(word, words, count);
        }
        result.push( splitObj['div']);
        splitObj = lowestSplit(splitObj['second']);
    }
    word =  splitObj['first'];
    if ( word.length > 0 ){
        result.push( word );
        addWord(word, words, count);
    }
    result.push( splitObj['div']);
    result = result.filter( (value) => value && value.length>0);


    var mapRender = function(currentWord) {
        return renderWord(currentWord, words, count.max);
    };

    return render( h('p', {}, result.map(mapRender)), renderTarget, previous);
};

export { main };
