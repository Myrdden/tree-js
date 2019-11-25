function Tree(data, root = null) {
  this.data = data; this.root = root; this.left = null; this.right = null;
  this._swap = swap => {
    console.log('swap');
    console.log(swap);
    let old = new Tree(this.data, this.root);
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
    // delete swap;
  };

  this._treeToAry = tree => {
  this.toAry = () => this._treeToAry(this);
    if (tree === null) { return []; }
    return [...this._treeToAry(tree.left), tree.data, ...this._treeToAry(tree.right)];
  };

  this.insert = (data, compare = null) => {
    this._insert(data, compare);
    let swap = this._balance();
    if (this.data !== swap.data) { this._swap(swap); }
  };
  this._insert = (data, compare = null) => {
    if (this.data === null) { this.data = data; return this; }
    let usingCompare = compare || ((a,b) => a < b ? -1 : (a > b ? 1 : 0));
    if (usingCompare(data, this.data) === -1) {
      if (this.left === null) { this.left = new Tree(data, this); }
      else { this.left._insert(data, compare); }
    } else if (usingCompare(data, this.data) === 1) {
      if (this.right === null) { this.right = new Tree(data, this); }
      else { this.right._insert(data, compare); }
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

if (typeof module !== 'undefined') { module.exports = Tree; }
