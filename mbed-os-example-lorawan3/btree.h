
#ifndef BTREE_H_
#define BTREE_H_

#include "mbed.h"
#include <vector>
#define SIZEOFLABEL 20

struct node_t{
	int value;
	node_t *left;
	node_t *right;
	node_t *parent;
	uint8_t *label;
};


class btree {
public:
	btree();
	btree(int num_of_nodes);
	virtual ~btree();
	void insert(int key);
	void putLabel(int value,uint8_t *label);
	void getLabel(int value,uint8_t *label);
	bool isChildOf(int myroot, int mychild);
	uint8_t* calculatesublabel(int myroot, int mychild , uint8_t * (* calcLeft)(uint8_t *prevlabel),uint8_t * (* calcRight)(uint8_t *prevlabel));
	void destroy_tree();
private:
	void destroy_tree(node_t *leaf);
	void insertt(node_t *node);
	node_t* findBinary ( int search_value);
	node_t* getNode( int search_value);
	vector<node_t*> reversePath(int myroot, int mychild);
	void clearAllLabels();
	node_t *root;
	vector<node_t*> stackofnodes;
	vector<node_t*> stack;

};

#endif /* BTREE_H_ */
