const TreeNode = require('./treenode.js');
const CompNodes = require('./comp-nodes.js');
const SubSet = require('./subset.js');

const crypt = require('./crypt.js');
const fs = require('fs');

module.exports = class BTREE {

    constructor() {
        //Help Stack for tree creation
        this.stack = [];
        //All posible subset
        this.allposcomp = [];
        //Root Node
        this.root = null;
        //file name for saved tree
        this.filename = 'tree.txt'
        //stack with all nodes for quick search     
        this.stackofnodes = [];

        //Array of subset struct with subsets
        this.subsets = [];

        //Node varaible for help in recursive functions
        this.mynode = null;
        //Nodes Table for help in recursive functions
        this.rettable = null;
        //List of node from specific level
        this.nodesspecificlevel = [];
    }

    //Create Tree From scratch
    create(numberofusers) {
        this.heigthoftree = 1;
        this.numberofusers = Math.pow(2, this.heigthoftree - 1);
        this.stack = [];
        // find number of users for perfect tree and tree height from number of real users
        while (numberofusers > this.numberofusers) {
            this.heigthoftree++;
            this.numberofusers = Math.pow(2, this.heigthoftree - 1);
        }
        // Create users (leaf of tree) nodes
        var z = 0;
        for (var i = 0; i < 2 * this.numberofusers - 1; i++) {
            var newTreeNode = new TreeNode(i);
            var randomBytes = crypt.CreateLabel();
            newTreeNode.label = randomBytes
            newTreeNode.key = crypt.GM(this.stringToHexArray(newTreeNode.label));
            if (i >= this.numberofusers - 1) {
                newTreeNode.isnode = false;
                newTreeNode.flag = 2;
                z++;
                if (z <= numberofusers) {
                    newTreeNode.fake = false;
                }
            }
            //Make the first node as root node
            if (this.root == null) {
                this.root = newTreeNode;
                this.stack.push(this.root);
                this.stackofnodes.push(this.root);
            }
            else {
                //put node to the tree
                this.insertNode2(newTreeNode);
                this.stackofnodes.push(newTreeNode);
            }
        }

        for (var i = 0; i < this.numberofusers - 1; i++) {
            var mynode = this.stackofnodes[i];
            this.rettable = [];
            for (var z = 0; z < this.stackofnodes.length; z++) {
                this.stackofnodes[z].sublabel = null;
            }
            this.findAllComp(mynode, mynode, mynode, 0);
        }
        // this.allposcomp.forEach(compnode => {
        //console.info("compnode start: " + compnode.startnode.data.toString(10) + " " + this.formatHexToHexbyte(compnode.startnode.data) + " end " + compnode.endnode.data.toString(10) + " " + this.formatHexToHexbyte(compnode.endnode.data) + " sublabel " + compnode.sublabel.toString('hex') + " label " + compnode.label.toString('hex') + "\n");
        //   compnode.path.forEach(p => {
        // console.info(p);
        //   })
        // })

    }

    //Create all possible subset 
    //Create sublabels
    //Create subkeys
    findAllComp(node, prevnode, root, side = 0) {
        root = root;
        if (node != null) {

            if (side != 0) {
                var compnode = new CompNodes(root, node);
                var l;
                if (prevnode == root)
                    l = prevnode.label;
                else
                    l = prevnode.sublabel;
                if (side == 1) {
                    node.sublabel = crypt.GL(this.stringToHexArray(l));
                    compnode.path.push(1);
                    compnode.label = root.label;
                }
                else if (side == 2) {
                    node.sublabel = crypt.GR(this.stringToHexArray(l));
                    compnode.path.push(2);
                    compnode.label = root.label;
                }

                if (node == root)
                    compnode.sublabel = node.label;
                else
                    compnode.sublabel = node.sublabel;
                compnode.parent_sublabel = node.parent.sublabel;
                this.allposcomp.push(compnode)
                //console.info("compnode start: " + compnode.startnode.data + " end " + compnode.endnode.data + " key " + compnode.key + "\n");
            }
            this.findAllComp(node.left, node, root, 1);
            this.findAllComp(node.right, node, root, 2);
        }
    }

    save() {
        //   var treearray = [];
        //   for (var x = 1; x <= this.heigthoftree; x++) {
        //        this.nodeOnArray(this.root, x, treearray);
        //    }
        //Save all node in file
        const fs = require('fs');
        try {
            fs.unlinkSync(this.filename);
        }
        catch (e) { }
        var fd = fs.openSync(this.filename, 'a');
        this.stackofnodes.forEach(value => fs.writeFileSync(fd, `{"data":"${value.data}","isnode":"${value.isnode}","fake":"${value.fake}","flag":"${value.flag}","label":"${value.label.toString('hex')}","key":"${value.key.toString('hex')}"}\n`));
        fs.closeSync(fd);
        //Save all subsets 
        // the araay this.allposcomp have all posible subset
        try {
            fs.unlinkSync("allsubset.txt");
        }
        catch (e) { }
        var fd = fs.openSync("allsubset.txt", 'a');
        this.allposcomp.forEach(compnode => fs.writeFileSync(fd, `{"startnode":{"data":"${compnode.startnode.data}"},"endnode":{"data":"${compnode.endnode.data}"},"key":"${compnode.key}","sublabel":"${compnode.sublabel.toString('hex')}","parent_sublabel":"${compnode.parent_sublabel}"}\n`));
        fs.closeSync(fd);
        //Save a file per user
        // include all subset that a user belong
        for (var z = 15; z <= 30; z++) {
            var usersubset = this.createKeyArrayForEachUser(z);
            try {
                fs.unlinkSync(`user${z}subset.txt`);
            }
            catch (e) { }
            var fd = fs.openSync(`user${z}subset.txt`, 'a');
            //fs.writeFileSync(fd, `{${this.formatHexToHexbyte(this.root.data)},${this.formatlabel(this.root.key)}}`);
            fs.writeFileSync(fd, "\n{");
            usersubset.forEach((line, key, arr) => {
                if (Object.is(arr.length - 1, key))
                    fs.writeFileSync(fd, `${line}\n`)
                else
                    fs.writeFileSync(fd, `${line},\n`)
            });
            fs.writeFileSync(fd, "}\n");
            fs.closeSync(fd);
        }

    }

    createKeyArrayForEachUser(usernode_data) {
        //array with all subset of specific user
        var retval = [];
        var myuser = this.stackofnodes[usernode_data];
        //push to array as first node the  root 
        retval.push(`{${this.formatHexToHexbyte(this.root.data)},${this.formatHexToHexbyte(this.root.data)},${this.formatlabel(this.root.key)}}`);
        //Array with parrents of node
        var adjacent = [];
        while (myuser.parent != null) {
            myuser = myuser.parent;
            adjacent.push(myuser);
        }
        //push to array with user subset 
        //the 
        for (var x = 0; x < adjacent.length; x++) {
            myuser = this.stackofnodes[usernode_data];
            while (myuser.parent != null && myuser != adjacent[x]) {
                if (myuser.parent.left != null && myuser.parent.left != myuser) {
                    var sublabel = this.findSubLabelForSubset(adjacent[x].data, myuser.parent.left.data);
                    if (sublabel != null)
                        retval.push(`{${this.formatHexToHexbyte(adjacent[x].data)},${this.formatHexToHexbyte(myuser.parent.left.data)},${this.formatlabel(sublabel)}}`);


                }
                if (myuser.parent.right != null && myuser.parent.right != myuser) {
                    var sublabel = this.findSubLabelForSubset(adjacent[x].data, myuser.parent.right.data);
                    // if (parent_sublabel != null)
                    retval.push(`{${this.formatHexToHexbyte(adjacent[x].data)},${this.formatHexToHexbyte(myuser.parent.right.data)},${this.formatlabel(sublabel)}}`);
                }
                myuser = myuser.parent;
            }
        }
        return retval;
    }

    //return Parent SubLabel for a specific subset
    findParent_SubLabelForSubset(start_data, end_data) {
        for (var x = 0; x < this.allposcomp.length; x++) {
            if (this.allposcomp[x].startnode.data == start_data && this.allposcomp[x].endnode.data == end_data)
                return this.allposcomp[x].parent_sublabel;
        }
        return null;
    }

    //return SubLabel for a specific subset
    findSubLabelForSubset(start_data, end_data) {
        for (var x = 0; x < this.allposcomp.length; x++) {
            if (this.allposcomp[x].startnode.data == start_data && this.allposcomp[x].endnode.data == end_data)
                return this.allposcomp[x].sublabel;
        }
        return null;
    }

    formatlabel(label) {
        let mylabel = '';
        if (label != null) {
            for (var z = 0; z < label.length; z += 2) {
                mylabel += `0x${label[z].toString(16)}${label[z + 1].toString(16)}`
                if (z < label.length - 2)
                    mylabel += ",";
            }
        }
        return mylabel;
    }

    checkIfItChild(rootnode, cheknode) {
        retval = false;
        while (1) {
            if (rootnode.parent != null) {
                if (rootnode.parent == cheknode)
                    return true;
                else
                    rootnode = rootnode.parent;
            }
            else
                return false;
        }
    }

    formatHexToHexbyte(hex) {
        return `0x${hex < 16 ? '0' : ''}${hex.toString(16)}`
    }

    formatHexToHexbyteStr(hex) {
        return `0x${hex < 16 ? '0' : ''}${hex.toString('hex')}`
    }

    //put the nodes to the tree with the order that coming
    //use for help the Stack array
    insertNode2(newTreeNode) {
        let mynode = this.stack[this.stack.length - 1];
        if (mynode != null) {
            if (mynode.left == null) {
                mynode.left = newTreeNode;
                mynode.left.parent = mynode;
                this.stack.unshift(mynode.left);
            }
            else if (mynode.right == null) {
                mynode.right = newTreeNode;
                mynode.right.parent = mynode;
                this.stack.unshift(mynode.right);
                this.stack.pop();
            }
            return mynode;
        }
    }

    nodeFromSpecificLevel(node, level) {
        if (node != null) {
            if (level == 1) {
                this.nodesspecificlevel.push(node);
            }
            this.nodeFromSpecificLevel(node.left, level - 1);
            this.nodeFromSpecificLevel(node.right, level - 1);
        }
    }

    nodeOnArray(node, level, treearray) {
        if (node == null)
            return treearray;
        if (level == 1) {
            node.notused = false;
            treearray.push(node);
        }
        this.nodeOnArray(node.left, level - 1, treearray);
        this.nodeOnArray(node.right, level - 1, treearray);
    }

    read() {
        this.root = null;
        this.stack = [];
        this.stackofnodes = [];
        const fs = require('fs');
        var options = { encoding: 'utf-8', flag: 'r' };
        var mydata = fs.readFileSync(this.filename, options);
        var stack = mydata.split('\n');
        stack.forEach(line => {
            // console.log(line);
            if (line != "") {
                var myobj = JSON.parse(line)
                var newTreeNode = new TreeNode(myobj.data);
                newTreeNode.isnode = myobj.isnode;
                newTreeNode.fake = myobj.fake;
                newTreeNode.flag = myobj.flag;
                newTreeNode.label = myobj.label;
                newTreeNode.key = myobj.key;
                if (this.root == null) {
                    this.root = newTreeNode;
                    this.stack.push(this.root);
                    this.stackofnodes.push(this.root);
                }
                else {
                    this.insertNode2(newTreeNode);
                    this.stackofnodes.push(newTreeNode);
                }
            }
        });
        this.heigthoftree = Math.log2(stack.length);


        var mycomp = fs.readFileSync("allsubset.txt", options);
        var stackcomp = mycomp.split('\n');
        stackcomp.forEach(line => {
            // console.log(line);
            if (line != "") {
                var myobj = JSON.parse(line)
                var compnode = new CompNodes(myobj.startnode, myobj.endnode);
                compnode.key = myobj.key;
                compnode.sublabel = myobj.sublabel;
                compnode.parent_sublabel = myobj.parent_sublabel;
                this.allposcomp.push(compnode);
            }
        });

    }

    //find a node in the tree
    // returrn the node used (this.mynode) global variable
    searchPostOrder(node, data) {
        if (node != null) {
            if (node.data == data) {
                return this.mynode = node;
            }
            this.searchPostOrder(node.left, data);
            this.searchPostOrder(node.right, data);
        }
    }

    get subset() {
        return this.subsets;
    }

    resetflags(node) {
        if (node != null) {
            this.resetflags(node.left);
            this.resetflags(node.right);
            if (node.isnode == true || node.isnode == "true")
                node.flag = 5;
            else
                node.flag = 2;
        }
    }
    //Get an array with number of revoke users
    //and create the arrray (this.subset) with keys
    getSubsetArray(revokearray) {
        if (revokearray != null && revokearray.length > 0) {
            this.subsets = [];
            this.resetflags(this.root);

            for (var x = this.heigthoftree; x >= 0; x--) {
                var subset = new SubSet();
                this.revokeNodes2(this.root, x, revokearray);
            }
            this.createSubset(this.root);
            for (var x = 0; x < this.subsets.length; x++) {
                if (this.subsets[x].startnode != null && this.subsets[x].endnode == null) {
                    this.subsets[x].endnode = this.root;
                    this.subsets[x].key = crypt.GM(this.stringToHexArray(this.subsets[x].startnode.label));
                    //console.info(this.subsets[x].startnode.data + "  " + this.subsets[x].endnode.data + " " + this.subsets[x].key)
                    continue;
                }
                else if (this.subsets[x].startnode != null && this.subsets[x].endnode != null) {

                    for (var z = 0; z < this.allposcomp.length; z++) {
                        // console.info(this.allposcomp[x].startnode.data + "  " + this.allposcomp[x].endnode.data)

                        if (this.allposcomp[z].startnode.data == this.subsets[x].startnode.data && this.allposcomp[z].endnode.data == this.subsets[x].endnode.data) {
                            this.subsets[x].key = crypt.GM(this.stringToHexArray(this.allposcomp[z].sublabel));
                            this.subsets[x].sublabel = this.allposcomp[z].sublabel;
                            this.subsets[x].parent_sublabel = this.allposcomp[z].parent_sublabel;
                            break;
                        }
                        //  if (this.allposcomp[z].startnode.data == 1 && this.allposcomp[z].endnode.data == 4) {
                        //       console.info("1,4 " + this.allposcomp[z].sublabel);
                        //   }
                        //  if (this.allposcomp[z].startnode.data == 1 && this.allposcomp[z].endnode.data == 10) {
                        //   console.info("1,prev 10  " + this.allposcomp[z].parent_sublabel);
                        //  console.info("1,10 " + this.allposcomp[z].sublabel);
                        //   }
                    }
                    //console.info("getSubsetArray key" + this.subsets[x].startnode.data + "  " + this.subsets[x].endnode.data + " " + this.subsets[x].key)
                    // console.info("getSubsetArray sublabel " + this.subsets[x].startnode.data + "  " + this.subsets[x].endnode.data + " " + this.subsets[x].sublabel)
                    // console.info("getSubsetArray parent_sublabel " + this.subsets[x].startnode.data + "  " + this.subsets[x].endnode.data + " " + this.subsets[x].parent_sublabel)

                }
            }
        }
        else {
            var subset = new SubSet();
            subset.startnode = this.stackofnodes[0];
            subset.endnode = this.stackofnodes[0];
            subset.key = crypt.GM(this.stringToHexArray(this.stackofnodes[0].key));
            subset.sublabel = null;
            subset.parent_sublabel = null;
            this.subsets.push(subset);

        }
    }

    //Create an array (this.subsets) with subset from flag values of nodes
    //return the Global array  (this.subsets) with out keys
    createSubset(node) {
        if (node != null) {
            this.createSubset(node.left);
            this.createSubset(node.right);
            if (node.flag == 0) {
                if (this.subsets.length > 0 && this.subsets[this.subsets.length - 1].startnode == null)
                    var subset = this.subsets.pop();
                var subset = new SubSet();
                subset.endnode = node;
                this.subsets.push(subset);
            }
            else if (node.flag == 4) {
                if (this.subsets.length > 0) {
                    if (this.subsets[this.subsets.length - 1].startnode == null) {
                        var subset = this.subsets.pop();
                        if (subset.startnode != null && subset.startnode.flag == 4) {
                            this.subsets.push(subset);
                        }
                        else {
                            subset.startnode = node;
                            this.subsets.push(subset);
                        }
                    }
                    // else {
                    //     var subset = new SubSet();
                    //     subset.startnode = node;
                    //     this.subsets.push(subset);
                    // }
                }
                else {
                    if (node == this.root) {
                        var subset = new SubSet();
                        subset.startnode = node;
                        this.subsets.push(subset);
                    }

                }
            }
            //print flags after revokenodes2
            // console.info("post  data: " + node.data + " flag " + node.flag + " label: " + node.label + " isnode: " + node.isnode + " fake: " + node.fake + " sublabel: " + node.sublabel + " key: " + node.key + "\n");
        }

    }

    //put values in flag variable for eatch node 
    //from this flag values  will be create subset from createsubset function
    revokeNodes2_old(node, level, data) {
        if (node == null)
            return;
        if (level == 1) {
            //  console.info(node.data);
            if (node.left == null & node.right == null) {
                if (data.find(element => element == node.data)) {
                    node.flag = 0;
                }
            }
            // else if (node.parent != null && node.parent.flag == 4) {
            //     node.flag = 4;
            // }
            else if (node.parent == null) {
                if (node.left.flag >= 4 && node.right.flag >= 4) {
                    node.flag = 5;
                }
                else if (node.left.flag <= 0 && node.right.flag == 1) {
                    node.flag = 5;
                    node.left.flag = 5;
                    node.right.flag = 4;
                }
                else if (node.left.flag == 1 && node.right.flag <= 0) {
                    node.flag = 5;
                    node.left.flag = 4;
                    node.right.flag = 5;
                }
                else if (node.left.flag == 1 && node.right.flag == 2) {
                    node.flag = 4;
                }
                else if (node.left.flag == 2 && node.right.flag == 1) {
                    node.flag = 4;
                }
                else if (node.left.flag == 0 && node.right.flag == 2) {
                    node.flag = 4;
                }
                else if (node.left.flag == 2 && node.right.flag == 0) {
                    node.flag = 4;
                }
                else if (node.left.flag == 2 && node.right.flag == 2) {
                    node.flag = 4;
                }
                else if (node.left.flag == 1 && node.right.flag == 1) {
                    node.flag = 5;
                    node.left.flag = 4;
                    node.right.flag = 4;
                }
                else if (node.left.flag >= 4 && node.right.flag == 1) {
                    node.flag = 5;
                    node.right.flag = 4;
                }
                else if (node.left.flag == 1 && node.right.flag >= 4) {
                    node.flag = 5;
                    node.left.flag = 4;
                }
                else if (node.left.flag == 4 && node.right.flag == 2) {
                    node.flag = 4;
                    //node.right.flag = 3;
                    node.left.flag = 3;
                }
                else if (node.left.flag == 2 && node.right.flag == 4) {
                    node.flag = 4;
                    node.right.flag = 3;
                    //node.left.flag = 3;
                }
                else if (node.left.flag == 5 && node.right.flag == 2) {
                    node.flag = 5;
                    node.right.flag = 4;
                }
                else if (node.left.flag == 2 && node.right.flag == 5) {
                    node.flag = 5;
                    node.left.flag = 4;
                }
            }
            else if (node.left != null && node.right != null) {
                if (node.left.flag == 0 && node.right.flag == 0) {
                    node.flag = 0;
                    node.left.flag = -1;
                    node.right.flag = -1;
                }
                else if (node.left.flag == 1 && node.right.flag == 1) {
                    node.flag = 5;
                    node.left.flag = 4;
                    node.right.flag = 4;
                }
                else if (node.left.flag == 2 && node.right.flag == 2)
                    node.flag = 2;
                else if (node.left.flag == 0 && node.right.flag == 2)
                    node.flag = 1;
                else if (node.left.flag == 2 && node.right.flag == 0)
                    node.flag = 1;
                else if (node.left.flag == 1 && node.right.flag == 2) {
                    node.flag = 4;
                    //node.left.flag = 0;
                }
                else if (node.left.flag == 2 && node.right.flag == 1) {
                    node.flag = 4;
                    // node.right.flag = 0;
                }
                else if (node.left.flag == 1 && node.right.flag == 0) {
                    node.flag = 3;
                    node.left.flag = 4;
                    //node.right.flag = -1;
                }
                else if (node.left.flag == 0 && node.right.flag == 1) {
                    node.flag = 3;
                    node.right.flag = 4;
                    //node.left.flag = -1;
                }
                else if (node.left.flag == 4 && node.right.flag == 2) {
                    node.flag = 4;
                    node.left.flag = 5;
                }
                else if (node.left.flag == 2 && node.right.flag == 4) {
                    node.flag = 4;
                    node.right.flag = 5;
                }
                else if (node.left.flag == 4 && node.right.flag == 0) {
                    node.flag = 4;
                }
                else if (node.left.flag == 0 && node.right.flag == 4) {
                    node.flag = 4;
                }
                else if (node.left.flag == 4 && node.right.flag == 1) {
                    node.flag = 5;
                    if (node.right.right.flag != -1 && node.right.left.flag != -1)
                        node.right.flag = 4;
                }
                else if (node.left.flag == 1 && node.right.flag == 4) {
                    node.flag = 0;
                    if (node.left.right.flag != -1 && node.left.left.flag != -1)
                        node.left.flag = 4;
                }
                else if (node.left.flag == 4 && node.right.flag == -1) {
                    node.flag = 5;
                    node.right.flag = 4;
                }
                else if (node.left.flag == -1 && node.right.flag == 4) {
                    node.right.flag = 5;
                    node.left.flag = 4;
                }
                else if (node.left.flag == 3 && node.right.flag == 1) {
                    node.flag = 5;
                }
                else if (node.left.flag == 1 && node.right.flag == 3) {
                    node.flag = 5;
                }
                else if (node.left.flag == 3 && node.right.flag == 2) {
                    node.flag = 4;
                    node.left.flag = 0;
                }
                else if (node.left.flag == 2 && node.right.flag == 3) {
                    node.flag = 4;
                    node.right.flag = 0;
                }
                else if (node.left.flag >= 4 && node.right.flag >= 4) {
                    node.flag = 5;
                }
            }
            //            console.info(node.data + "  " + node.flag);
        }
        this.revokeNodes2(node.left, level - 1, data);
        this.revokeNodes2(node.right, level - 1, data);
    }

    revokeNodes2(node, level, data) {
        if (node == null)
            return;
        if (level == 1) {
            if (node.left == null & node.right == null) {
                if (data.find(element => element == node.data)) {
                    node.flag = 0;
                }
            }
            else if (node.parent == null && node.left.flag == 0 && node.right.flag == 4) {
                node.flag = 5;
            }
            else if (node.parent == null && node.left.flag == 4 && node.right.flag == 0) {
                node.flag = 5;
            }
            else if (node.parent == null && node.left.flag == 1 && node.right.flag == 2) {
                node.flag = 4;
            }
            else if (node.parent == null && node.left.flag == 2 && node.right.flag == 1) {
                node.flag = 4;
            }
            else if (node.parent == null && node.left.flag == 0 && node.right.flag == 2) {
                node.flag = 4;
            }
            else if (node.parent == null && node.left.flag == 2 && node.right.flag == 0) {
                node.flag = 4;
            }
            // else if (node.parent == null && node.left.flag == 0 && node.right.flag == 1) {
            //     node.flag = 5;
            //     node.right.flag = 4;
            // }
            // else if (node.parent == null && node.left.flag == 1 && node.right.flag == 0) {
            //     node.flag = 5;
            //     node.left.flag = 4;
            // }
            else {
                if (node.left.flag == 0 && node.right.flag == 0) {
                    node.flag = 0;
                    node.left.flag = -1;
                    node.right.flag = -1;
                }
                else if (node.left.flag == 1 && node.right.flag == 1) {
                    node.flag = 0;
                    node.left.flag = 4;
                    node.right.flag = 4;
                }
                else if (node.left.flag == 2 && node.right.flag == 2)
                    node.flag = 2;
                else if (node.left.flag == 0 && node.right.flag == 2)
                    node.flag = 1;
                else if (node.left.flag == 2 && node.right.flag == 0)
                    node.flag = 1;
                else if (node.left.flag == 1 && node.right.flag == 2) {
                    node.flag = 1;
                }
                else if (node.left.flag == 2 && node.right.flag == 1) {
                    node.flag = 1;
                }
                else if (node.left.flag == 1 && node.right.flag == 0) {
                    node.flag = 5;
                    node.left.flag = 4;
                }
                else if (node.left.flag == 0 && node.right.flag == 1) {
                    node.flag = 5;
                    node.right.flag = 4;
                }
                else if (node.left.flag >= 4 && node.right.flag == 2) {
                    node.flag = 4;
                    node.left.flag = 0;
                    node.right.flag = 5;
                }
                else if (node.left.flag == 2 && node.right.flag >= 4) {
                    node.flag = 4;
                    node.right.flag = 0;
                    node.left.flag = 5;
                }
                else if (node.left.flag >= 4 && node.right.flag == 0) {
                    node.flag = 5;
                }
                else if (node.left.flag == 0 && node.right.flag >= 4) {
                    node.flag = 5;
                }
                else if (node.left.flag >= 4 && node.right.flag == 1) {
                    node.flag = 5;
                    node.right.flag = 4;
                }
                else if (node.left.flag == 1 && node.right.flag >= 4) {
                    node.flag = 5;
                    node.left.flag = 4;
                }
                else if (node.left.flag >= 4 && node.right.flag >= 4) {
                    node.flag = 5;
                }
            }
        }
        this.revokeNodes2(node.left, level - 1, data);
        this.revokeNodes2(node.right, level - 1, data);
    }



    stringToHexArray(strinhex) {
        var stringarray = [];
        for (var x = 0; x < strinhex.length; x += 2) {
            stringarray.push("0x" + strinhex[x] + strinhex[x + 1])
        }
        return Buffer(stringarray);
    }

}

