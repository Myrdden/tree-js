function Tree(data = null, compare = null) {
  this.data = data; this.root = null; this.left = null; this.right = null;
  this.compare = compare || ((a,b) => a < b ? -1 : (a > b ? 1 : 0));
  this._swap = swap => {
    let old = new Tree(this.data, this.compare); old.root = this.root;
    if (this.root !== null) { this.root.left === this ? this.root.left = old : this.root.right = old; }
    old.left = this.left;
    if (this.left !== null) { this.left.root = old; }
    old.right = this.right;
    if (this.right !== null) { this.right.root = old; }
    this.data = swap.data; this.root = swap.root;
    if (swap.root !== null) { swap.root.left === swap ? swap.root.left = this : swap.root.right = this; }
    this.left = swap.left;
    if (swap.left !== null) { swap.left.root = this; }
    this.right = swap.right;
    if (swap.right !== null) { swap.right.root = this; }
  };

  this.toAry = () => this._treeToAry(this);
  this._treeToAry = tree => {
    if (tree === null) { return []; }
    return [...this._treeToAry(tree.left), tree.data, ...this._treeToAry(tree.right)];
  };

  this.push = data => {
    this._push(data);
    let swap = this._balance();
    if (this.data !== swap.data) { this._swap(swap); }
    return this;
  };
  this._push = data => {
    if (this.data === null) { this.data = data; return this; }
    if (this.compare(data, this.data) === -1) {
      if (this.left === null) { this.left = new Tree(data, this.compare); this.left.root = this; }
      else { this.left._push(data); }
    } else if (this.compare(data, this.data) === 1) {
      if (this.right === null) { this.right = new Tree(data, this.compare); this.right.root = this; }
      else { this.right._push(data); }
    } else { return this; }
    return this;
  };

  this._leftTreeHeight = () => this.left !== null ? Math.max(this.left._leftTreeHeight(), this.left._rightTreeHeight()) + 1 : 0;
  this._rightTreeHeight = () => this.right !== null ? Math.max(this.right._leftTreeHeight(), this.right._rightTreeHeight()) + 1 : 0;
  this._calcWeight = () => this._leftTreeHeight() - this._rightTreeHeight();
  this._rotateRight = () => {
    let left = this.left;
    left.root = this.root;
    if (this.root !== null) { this.root.left === this ? this.root.left = left : this.root.right = left; }
    this.root = left;
    this.left = left.right;
    left.right = this;
    return left;
  };
  this._rotateLeft = () => {
    let right = this.right;
    right.root = this.root;
    if (this.root !== null) { this.root.left === this ? this.root.left = right : this.root.right = right; }
    this.root = right;
    this.right = right.left;
    right.left = this;
    return right;
  };
  this._rotateLeftRight = () => {this.left._rotateLeft(); return this._rotateRight();};
  this._rotateRightLeft = () => {this.right._rotateRight(); return this._rotateLeft();};
  this._balance = () => {
    let weight = this._calcWeight();
    let tree = this;
    if (weight > 1) {
      let subWeight = this.left._calcWeight();
      if (subWeight > 0) { tree = this._rotateRight(); }
      else if (subWeight < 0) { tree = this._rotateLeftRight(); }
    } else if (weight < -1) {
      let subWeight = this.right._calcWeight();
      if (subWeight < 0) { tree = this._rotateLeft(); }
      else if (subWeight > 0) { tree = this._rotateRightLeft(); }
    }
    [] = [];
    return tree.root === null ? tree : tree.root._balance();
  };
};

Array.prototype.toTree = function(compare = null) {
  let tree = new Tree(null, compare);
  this.forEach(elem => tree.push(elem));
  return tree;
};

if (typeof module !== 'undefined') { module.exports = Tree; }
