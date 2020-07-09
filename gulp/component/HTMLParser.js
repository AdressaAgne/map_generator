const log = console.log;
const {
    str,
    sequenceOf,
    letters,
    digits,
    letter,
    many,
    many1,
    choice,
    between,
    anyOfString,
    whitespace,
    optionalWhitespace,
    char,
    recursiveParser,
    everythingUntil
} = require('arcsecond');



const TagWrapper = between(char('<'))(char('>'));

const TagChars = sequenceOf([letter, many(choice([letters, digits]))]).map(result => result.flat().join(''));

const TagStart = TagWrapper(TagChars);

let tagIndex = 0;

const Parser = recursiveParser(() => many(choice([letters, TagParser])));

const TagParser = TagStart.chain(tagName => {
    return sequenceOf([everythingUntil(choice([Parser, str(`</${tagName}>`)])), str(`</${tagName}>`)]).map(item => {
        return {
            tagName,
            innerHTML: item,
            tagIndex: ++tagIndex,
        }
    });
});

module.exports = html => {
    const result = Parser.run(`<root>${html}</root>`)

    return result;
}