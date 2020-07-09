const log = require('fancy-log');
const through = require('through2');
const path = require('path');
const HTMLparser = require('simple-html-parser');
const fs = require('fs');
const Vinyl = require('vinyl');
//const HTMLTESTParser = require('./HTMLParser');
/**
 * wrap publin
 * @param {String} tag 
 */
const wrap = tag => ({
    _transform: (file, enc, cb) => {
        file.contents = Buffer.from(`<${tag}>${file.contents.toString()}</${tag}>`, enc);
        cb();
    }
});
/**
 * Components
 */
const componentTagName = 'A-';
const components = (level = 0, componentNames = []) => ({
    _transform: (file, enc, cb) => {
        let content = file.contents.toString();
        let arr = {
            style: [],
            template: [],
            script: []
        };
        const html = HTMLparser(content);

        ['style', 'template', 'script'].forEach(tag => {
            arr[tag].push(...html.getElementsByTagName(tag).map(item => item.outerHTML));
        });

        let componentsFound = Object.keys(html._tagElements).filter(item => {
            return item.indexOf(componentTagName) == 0 && componentNames.indexOf(item) < 0;
        });

        if (componentsFound == undefined || componentsFound.length < 1) {
            return cb();
        }
        /**
         * For each component name
         */
        componentNames.push(...componentsFound);
        const parser = components(++level, componentNames);
        componentsFound.forEach(tagName => {
            const name = tagName.slice(componentTagName.length).toLowerCase();

            // Vinyl file for the component
            const filename = path.join(file.base, `components/${name}/${name}.awesome`);
            if (!fs.existsSync(filename)) {
                return cb({
                    message: `Component ${name} does not exist, (${filename})`
                });
            }

            const componentFile = new Vinyl({
                cwd: file.cwd,
                base: file.base,
                path: filename,
                contents: Buffer.from(fs.readFileSync(filename, enc).toString())
            });

            parser._transform(componentFile, enc, names => {

            });

            let htmlfile = HTMLparser(componentFile.contents.toString());

            if (componentNames.indexOf(tagName) > -1) {
                componentNames.push(tagName);
                // add styles once per unique component name
                let styles = htmlfile.getElementsByTagName('STYLE');
                arr.style.push(...styles.map(style => `<style lang="${style.attributes.lang || 'scss'}" path="${path.dirname(filename)}" name="${tagName}">${style.innerHTML}</style>`));
                // add scripts once per unique component name
                let scripts = htmlfile.getElementsByTagName('SCRIPT');
                arr.script.push(...scripts.map(script => `<script lang="${script.attributes.lang || 'js'}" path="${path.dirname(filename)}" name="${tagName}">${script.innerHTML}</script>`));
            }


            /**
             * For each induvidual component
             */
            arr.template.forEach((string, id) => {
                const templateTag = HTMLparser(string);
                const componentTags = templateTag.getElementsByTagName(tagName);

                componentTags.forEach(componentTag => {
                    let variables = componentTag.attributes;
                    variables.content = componentTag.innerHTML.trim();

                    // set vars
                    let variables_placed = htmlfile.getElementsByTagName('TEMPLATE').map(obj => {
                        variables = Object.assign(obj.attributes, variables);
                        return obj.innerHTML.replace(new RegExp('{{(([^}][^}]?|[^}]}?)*)}}', 'g'), (string, variable) => variables[variable]).trim();
                    }).join("\n");

                    const componentFile = new Vinyl({
                        tagName,
                        cwd: file.cwd,
                        base: file.base,
                        path: filename,
                        contents: Buffer.from(variables_placed.trim())
                    });

                    arr.template[id] = arr.template[id].replace(componentTag.outerHTML, componentFile.contents.toString());
                });

            });

        });

        file.contents = Buffer.from(Object.values(arr).flat().join("\n"), enc);
        cb(componentNames);
    }
});

const changeExt = (pathname, ext) => path.join(path.dirname(pathname), path.basename(pathname, path.extname(pathname)) + `.${ext}`);

/**
 * Roadmap
 * 
 * 
 * Combine all style tags before compile. 
 * make all imports relative from the source file
 * 
 * combile all script tags before compile
 * make all require paths relative from the surce file
 * 
 * https://www.npmjs.com/package/htmlparser2 ??
 * skriv en med parser combinators?
 * 
 * @param {Object} options 
 */

const AwesomeParser = options => {
    // Options
    options.inline = true; // does nothing
    options.errors = true;
    options.ext = options.ext || 'html';
    options.template = options.template || [];

    // Wrap style in style tags
    options.style = options.style || [];
    options.style.push();

    // wrap script i script tags
    options.script = options.script || [];
    options.script.push();

    return through.obj(function (source, enc, cb) {

        let arr = {
            style: [],
            template: [],
            script: []
        };
        let files = 0;
        let completed = 0;


        let componentParser = components();
        componentParser._transform(source, enc, err => {

            /**
             * Check if there was any errors with the componets
             */
            if (err && err.message) {
                log.error(err.message);
                return;
            }

            const content = source.contents.toString();
            const html = HTMLparser(content);

            let tags = ['style', 'template', 'script'].flatMap(tag => {
                let elms = html.getElementsByTagName(tag);
                files += elms.length;
                return elms;
            });


            /**
             * Nothing to combile
             */
            if (tags.length < 1) {
                this.push(source);
                return cb();
            }

            tags.forEach(tag => {
                const tagName = tag.tagName.toLowerCase();
                const string = tag.innerHTML;
                const attributes = tag.attributes;

                // Change current tags filename to the right ext, in case some plugins use that
                const ext = attributes.lang || {
                    style: 'css',
                    script: 'js',
                    template: 'html'
                } [tagName || 'template'];

                //log(tagName, attributes, source.path);

                // Vinyl file
                let componentPath = attributes.path == undefined ? changeExt(source.path, ext) : path.join(attributes.path, `/${tagName}.${ext}`);
                //log(attributes, componentPath);
                const file = new Vinyl({
                    cwd: source.cwd,
                    base: source.base,
                    path: componentPath,
                    contents: Buffer.from(string, enc)
                });

                const push = () => {
                    arr[tagName].push(file.contents);
                    if (++completed >= files) {

                        let data = [];
                        if (arr.style) {
                            data.push(`<style>${arr.style.join("\n")}</style>`);
                        }
                        if (arr.template.length > 0) {
                            data.push(arr.template.join("\n"));
                        }
                        if (arr.script) {
                            data.push(`<script>${arr.script.join("\n")}</script>`);
                        }

                        source.contents = Buffer.from(data.join("\n"), enc);
                        source.basename = changeExt(source.basename, options.ext);
                        this.push(source);
                        return cb();
                    }
                }

                const tranformation_loop = iteration => {
                    const callback = options[tagName][iteration];
                    if (callback && callback._transform) {
                        callback._transform(file, enc, (err, chunk) => {
                            if (err && err.message && options.errors) {
                                log.error(err.message);
                            }

                            options[tagName][++iteration] ? tranformation_loop(iteration) : push();
                        });
                    } else {
                        push();
                    }
                }

                // If the tag has a transformer, transfrom it else push contents;
                options[tagName] ? tranformation_loop(0) : push();
            });
        });
    });
}

module.exports = {
    AwesomeParser
};