const n = 12;

var render = preact.render;
var h = preact.h;

const numToHex = function( number ) {
    number = Math.floor(number);
    if ( number < 16 ) {
        return [ 
            '0', '1', '2', '3', 
            '4', '5', '6', '7', 
            '8', '9', 'a', 'b', 
            'c', 'd', 'e', 'f'
        ][number];
    } else {
        return numToHex(number/16) + numToHex(number%16);
    }
}

const colourToString = function(colour) {
    let result = '#';
    if ( colour.r < 16 ) {
        result = result + '0';
    }
    result = result + numToHex(colour.r);
    if ( colour.g < 16 ) {
        result = result + '0';
    }
    result = result + numToHex(colour.g);
    if ( colour.b < 16 ) {
        result = result + '0';
    }
    result = result + numToHex(colour.b);
    return result;
}

const angleToRGB = function(angle) {

    let colour = {
        r: 0,
        g: 0,
        b: 0
    };

    angle = angle%360;


    let a = ((angle%120)/120)*(Math.PI/2);
    if ( angle < 120 ) {
        colour.r = Math.floor(255*Math.cos(a));
        colour.g = Math.floor(255*Math.sin(a));
    } else if ( angle < 240 ) {
        colour.g = Math.floor(255*Math.cos(a));
        colour.b = Math.floor(255*Math.sin(a));
    } else  {
        colour.b = Math.floor(255*Math.cos(a));
        colour.r = Math.floor(255*Math.sin(a));
    }
    return colour;
}

const colours = function(renderTarget) {

    let elements = [];
    let i = 0;
    let angle = 0;
    for( i = 0 ; i < 360; i += (360/n) ) {
        let obj = {
            class: 'colourBlock',
            style: 'background: '+colourToString(angleToRGB(i))+';'
                };
        elements.push(
            h('span', {class: 'colourSpan'}, [
                h('div', obj, [] ),
                h('textarea', {class: 'colourText'}, [])
            ])
        );
    }

    render(h('div', {}, elements), renderTarget, null);
};

const extractColourWords = function( renderTarget ) {
    const spans = renderTarget.getElementsByClassName('colourSpan');
    let result = [];
    for ( let i = 0 ; i < spans.length; i++ ) {
        result.push( {
            colour: spans[i].firstChild.style.backgroundColor,
            words: spans[i].lastChild.value
        });
    }
    return result;
}

export {colours, extractColourWords };
