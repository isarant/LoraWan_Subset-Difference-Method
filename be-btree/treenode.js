//strun of tree node
module.exports = class TreeNode {
    constructor(data) {
        this.data = data; // name of Node
        this.isnode = true; //true is is Node False is leaf
        this.fake = true; // False correspond with real user True is fake to fill the Tree
        this.parent = null;// Parent Node
        this.flag = 5;  // 2 not revoke user , 0 revoke user (end pair), 1 one of child is revoke,4 start pair, 5 ther is child 4 
        this.label = null; //random label for labeling
        this.sublabel = null;
        this.key = null;
        this.left = null;
        this.right = null;
        this.path = [];
    }
}

