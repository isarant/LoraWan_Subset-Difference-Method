//struct of subset from all possible subset
module.exports = class CompNodes {
    constructor(startnode, endnode) {
        this.startnode = startnode;
        this.endnode = endnode;
        //this.key = null;
        this.sublabel = null;
        this.parent_sublabel = null;
        this.label = null;
        this.path = [];
    }
}
