const getAllTextNodesInElm = (elm, nodes = []) => {
    const l = elm.childNodes;
    for (let i = 0; i < l.length; i++) {
        const node = l[i];
        
        if (node.nodeType == 3) {
            nodes.push(node);
        } else {
            nodes.push(...getAllTextNodesInElm(node));
        }
    };

    return nodes;
}

module.exports = getAllTextNodesInElm;