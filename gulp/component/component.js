const log = require('fancy-log');

const {
    prod,
    source
} = require('../vars');

const glob = require("glob");
const through = require('through2');
const path = require('path');
const fs = require('fs');

const isDirectory = source => fs.lstatSync(source).isDirectory()
const getDirectories = source => fs.readdirSync(source).map(name => path.join(source, name)).filter(isDirectory)

/**
 * Append a file
 * @param {String} filename 
 */
const append = function (filename) {
    var stream = through.obj(function (file, enc, cb) {
        if(fs.existsSync(path.join(path.dirname(file.path), filename))) {
            let comps = `require('${filename}');`;
            file.contents = Buffer.concat([Buffer.from(comps), file.contents]);
        }
        this.push(file);
        cb();
    });
    return stream;
}



const component = function (params = {}) {
    let options = {
        dir: params.dir || `${source}/components/`,
    }
    return through.obj(function (file, enc, cb) {
        // Folder does not exist
        if (!fs.existsSync(`${options.dir}`)) {
            console.error(`${options.dir} does not exist`);
            this.push(file);
            cb();
            return;
        }

        // the file is not a buffer
        if (!file.isBuffer()) {
            this.push(file);
            cb();
            return;
        }
        let regex = /<!-- Component\((.+)\) -->/g;

        let includedComps = [];

        if (fs.existsSync(`${prod}/index.html`)) {
            let html = fs.readFileSync(`${prod}/index.html`, 'utf8');
            includedComps = html.match(regex) || [];
        }

        comps = getDirectories(options.dir).map(folder => {
            let name = folder.split(path.sep);
            name = name.pop();

            // make a settings.json file for all components etc... much better
            let exists = includedComps.indexOf(`<!-- Component(${name}) -->`) > -1;

            if (exists && fs.existsSync(`${options.dir}/${name}/${name}.js`)) {
                return `require('../components/${name}/${name}.js');`
            }
            if (exists && fs.existsSync(`${options.dir}/${name}/index.js`)) {
                return `require('../components/${name}/index.js');`
            }
            
        }).join("\n");

        file.contents = Buffer.concat([file.contents, Buffer.from(comps)]);

        this.push(file);
        cb();
    });
}

module.exports = {
    component,
    append
};