//stuck for subset
module.exports = class SubSet {
    constructor() {
        this.startnode = null; // start node of pair include recievers
        this.endnode = null;//end node include revoke
        this.sublabel = null //sublabel of endnode for this subset
        this.key = null;// key of sub set producto from labeling
        this.parent_sublabel = null;
    }
}