
#include "btree.h"

btree::btree() {
	root = NULL;

}

btree::btree(int num_of_nodes) {
	root = NULL;
    for(int x=0;x<num_of_nodes;x++){
    	insert(x);
    }
    stack.clear();
}


btree::~btree() {
	destroy_tree();
}

void btree::destroy_tree(node_t *leaf){
	if(leaf != NULL){
		destroy_tree(leaf->left);
		destroy_tree(leaf->right);
		delete leaf;
		//free(leaf);
	}
}

void btree::putLabel(int value,uint8_t *label){
	memcpy(stackofnodes[value]->label,label,sizeof(stackofnodes[value]->label));
}

void btree::getLabel(int value,uint8_t *label){
	memcpy(label,stackofnodes[value]->label,sizeof(stackofnodes[value]->label));
}

bool btree::isChildOf(int myroot, int mychild){
	if(reversePath(myroot,mychild).empty())
		return false;
	else
		return true;
}

vector<node_t*> btree::reversePath(int myroot, int mychild){
	vector<node_t*> retpath;
	node_t *mynode=stackofnodes[mychild];
	bool ischild=false;
	while(myroot<=mynode->value && mynode->parent!=NULL ){
		retpath.push_back(mynode);
		if(mynode->value==myroot){
			ischild=true;
			break;
		}
		mynode=mynode->parent;
	}
	if(ischild)
		return retpath;
	else{
		retpath.clear();
		return retpath;
	}
}

uint8_t* btree::calculatesublabel(int myroot, int mychild , uint8_t * (* calcLeft)(uint8_t *prevlabel),uint8_t * (* calcRight)(uint8_t *prevlabel)){
	clearAllLabels();
	vector<node_t*> reversvector=reversePath(myroot, mychild);
	node_t *mynode;
	while(!reversvector.empty()){
		mynode=reversvector.back();
		reversvector.pop_back();
		if(mynode->left->value==reversvector.back()->value){
			memcpy(mynode->left->label,calcLeft((uint8_t*)mynode->label),sizeof(mynode->left->label));
		}
		else{
			memcpy(mynode->right->label,calcRight((uint8_t*)mynode->label),sizeof(mynode->right->label));
		}
	}
	return mynode->label;
}

void btree::clearAllLabels(){
	for(int x=0 ;x<stackofnodes.size();x++){
		memset(stackofnodes[x]->label,0,sizeof(stackofnodes[x]->label));
	}
}

void btree::insertt(node_t *node){
	if(!stack.empty()){
		node_t *mynode= stack.back();
    	//stack.pop_back();
	    if (mynode->left == NULL) {
            mynode->left = node;
            mynode->left->parent = mynode;
          //  stack.push_back(tmp);
            stack.insert(stack.begin(), mynode->left);
        }
        else if (mynode->right == NULL) {
            mynode->right = node;
            mynode->right->parent = mynode;
            stack.insert(stack.begin(), mynode->right);
        	stack.pop_back();
        }
	    stackofnodes.push_back(node);
    }
}

node_t* btree:: getNode( int search_value){

    return stackofnodes[search_value];
}

node_t* btree::findBinary ( int search_value){
	int l=0;
	int r=stackofnodes.size();
	while (l <= r) {
	        int m = l + (r - l) / 2;
	        if (stackofnodes[m]->value == search_value)
	            return stackofnodes[m];
	        if (stackofnodes[m]->value <search_value)
	            l = m + 1;
	        else
	            r = m - 1;
	    }
    return NULL;
}

void btree::insert(int key){
	if(root != NULL){
		node_t *node = new node_t;
		//node_t *node=(node_t*)malloc(sizeof(node_t));
		node->value = key;
		node->left = NULL;
		node->right = NULL;
		insertt(node);
	}else{
		root = new node_t;
		//root=(node_t*)malloc(sizeof(node_t));
		root->value = key;
		root->left = NULL;
		root->right = NULL;
		stack.push_back(root);
		stackofnodes.push_back(root);
	}
}

void btree::destroy_tree(){
	destroy_tree(root);
}
