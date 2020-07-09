const server = 'https://spesial.adressa.no/';

let dir = __dirname.split('\\');
if (dir.length == 1) dir = __dirname.split('/');
const project_name = 'korona/overview';
const url = server + project_name + '/';
//const url = '';

const source = 'src';
const prod = 'prod';
const dist = 'dist';

module.exports = {
    source,
    prod,
    dist,
    server,
    project_name,
    url,
    sizes: [32, 360, 640, 768, 1024, 1280, 1600, 1920],
    sizesDist: [360, 640, 768, 1024, 1280, 1600, 1920],
    watch: {
        scss: `${source}/**/*.scss`,
        js: `${source}/**/*.js`,
        js_components: `${source}/components/**/*.js`,
        html: `${source}/**/*.html`,
        images: `${source}/images/*.{jpg,png,svg}`,
        aml: `${source}/data/*.aml`
    }
}