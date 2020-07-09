const log = console.log;
const {
    createObject,
    string,
    bool,
    Enum,
    callback
} = require('../Controllers/TypeController');
class Cue {

    constructor(host, webservice, name) {
        this.pubname = name;
        this.host = host;
        this.cue = `http://${host}/cue-web`;
        this.webservice = `http://${webservice}/webservice`;
    }

    generateID() {
        return '_' + new Date().getTime();
    }

    getSections(name) {
        if (typeof name == 'number') return name;

        const sections = {
            'forsiden': 1649,
            'trøndelag': 22821,
            'pluss kultur': 12354,
            'kultur': 1659,
            'pluss +': 12147,
            'trondheim': 1913
        }

        return sections[name] == undefined ? sections.forsiden : sections[name];
    }

    getHomeSectionUrl(section) {
        return `${this.webservice}/escenic/section/${this.getSections(section)}`;
    }

    getContentType(type) {
        const contentTypes = ['news'];

        if (contentTypes.indexOf(type) < 0) {
            console.warning(`content type ${type} is not a valid content type`);
            type = contentTypes[0];
        }

        return `${this.getPubnameURI()}/model/content-type/${type}`;
    }

    getPubnameURI() {
        return `${this.webservice}/escenic/publication/${this.pubname}`;
    }

    open(url) {
        let win = window.open(url, '_blank');
        win.focus();
    }

    create(type = 'news') {
        let article = createObject({}, [
            callback('open', title => {
                if (title) article.title = title
                this.open(this.get(article, article.section || 'forsiden', type));
            }).const,
            Enum('type', type, ['news', 'html']).const,
            string('title'),
            string('kicker'),
            string('leadtext'),
            string('body'),
            bool('paywall', true)
        ], 'Article');

        return article;
    }


    get(data = {}, section = 'forsiden', type = 'news') {
        const id = this.generateID();
        const mimetype = `x-ece/new-content; type=story`;

        const json = {
            "modelURI": {
                "string": this.getContentType(type),
                "$class": "URI"
            },
            "homeSectionUri": this.getHomeSectionUrl(section),
            "homePublication": {
                "name": this.pubname,
                "uri": {
                    "string": this.getPubnameURI(),
                    "$class": "URI"
                }
            },
            "values": {
                "kicker": data.kicker || undefined,
                "title": data.title || undefined,
                "leadtext": data.lead || undefined,
                "body": data.body || undefined,
                "paywall": data.paywall || false,
            }
        }

        const params = {
            uri: id,
            mimetype,
            extra: JSON.stringify(json)
        }

        const paramString = Object.entries(params).reduce((prev, [key, value]) => {
            prev.push(`${key}=${encodeURIComponent(value)}`)
            return prev;
        }, []).join('&');

        return this.url = `${this.cue}/#/main?${paramString}`
    }

}

module.exports = Cue;