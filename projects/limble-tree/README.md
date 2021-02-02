# Limble Tree

An Angular library for creating highly dynamic drag-and-drop tree structures

## About

### Limble

Limble is a CMMS SaaS company providing great software to customers around the world. The `limble-tree` library is built by the Limble team and used in Limble's web applications.

### Status

This library is currently in **beta** development. It may not be ready for use in a production environment.

### Versioning

To the best of our ability, this library follows the [Semantic Versioning](https://semver.org/) standard.

## Installation

`npm install @limble/limble-tree`

## Usage

### Basic Setup

1. Add the `LimbleTreeModule` to the `imports` array of one of your own modules.

2. Create an array where each element in the array represents an item in the tree (called a "node"). Children can be assigned to a node via the "nodes" property:

```typescript
const treeData: LimbleTreeData = [
   {
      myValue: "abc",
      mySecondValue: 10,
      nodes: [
         { myValue: "def", mySecondValue: 20 },
         {
            myValue: "ghi",
            mySecondValue: 30,
            nodes: [
               { myValue: "jkl", mySecondValue: 40 },
               { myOtherValue: { prop1: "mno", prop2: "pqr" } }
            ]
         }
      ]
   },
   { myOtherValue: { prop1: "stu", prop2: "vwx" } }
];
```

3. Create an object describing the tree's options.

```typescript
const treeOptions: LimbleTreeOptions = {
   defaultComponent: {
      class: MyComponentClass,
      bindings: { binding1: value1, binding2: value2 }
   },
   indent: 60
};
```

4. Add a `<limble-tree-root>` component to one of your components' templates and pass it the data array and the options object:

```html
<limble-tree-root [data]="treeData" [options]="treeOptions"></limble-tree-root>
```

This should render the tree, producing an instance of `MyComponentClass` for each node in the tree data.

### The LimbleTreeData Array

The LimbleTreeData array can have objects of any configuration. There are two properties that the library looks for on these objects:

-  `nodes`: This property is an array of objects just like LimbleTreeData. Objects in this array are considered children of that object, and will cause a component to be rendered for each element in the array. The children will be rendered on a new branch "under" the parent.
-  `component`: This property is an object in the form of `{class: <ComponentClass>, bindings: {bindingName: bindingValue, ...}}`. It is optional as long as there is a `defaultComponent` declared in the tree options object. If this property is found on a node, it will be used instead of the `defaultComponent` for rendering that node. See the `defaultComponent` option below for more information.

### The LimbleTreeOptions Object

The LimbleTreeOptions object is used to configure the tree's general settings. Options include:

-  `defaultComponent`: This property is an object in the form of `{class: <ComponentClass>, bindings: {bindingName: bindingValue, ...}}`. For each node in the data array, the component described by this object will be rendered. The tree node object will be passed in to the component as an input called `nodeData`. The component's inputs and outputs will be initialized using the bindings object. If a tree node contains a `component` property, that component information will be used instead of the `defaultComponent`. An error will be thrown if (1) the `defaultComponent` is not defined; and (2) the library encounters a tree node that does not have a `component` property.
-  `indent`: The number of pixels to indent for each level of the tree. Defaults to 45.
-  `allowNesting`: Whether to allow "nesting" (placing a node one level deeper than currently exists on the branch) when dragging a node. May be a boolean or a callback function that returns a boolean. If it is a callback, the callback will be called for each node and the node will be passed in to the callback. Defaults to true.
-  `allowDragging`: Whether to allow drag-and-drop functionality. May be a boolean or a callback function that returns a boolean. If it is a callback, the callback will be called for each node and the node will be passed in to the callback. Defaults to true.

### The LimbleTreeRoot Component

Here are the inputs and outputs of the `<limble-tree-root>` component:

-  input `data` -- a LimbleTreeData array.
-  input `options` -- a LimbleTreeOptions object.
-  output `treeChange` -- an event that fires whenever the tree is rendered or re-rendered.
-  output `treeDrop` -- an event that fires after a node is dropped in the tree. The event contains data described by the TreeDrop interface, given here:

```typescript
export interface TreeDrop {
   /** The node that was dropped */
   target: LimbleTreeNode;
   /** the target's parent before the drag and drop, or null if it was a top-level node */
   oldParent: LimbleTreeNode | null;
   /** the index of the node before the drag and drop relative to its old siblings */
   oldIndex: number;
   /** the target's parent after the drag and drop, or null if it is now a top-level node */
   newParent: LimbleTreeNode | null;
   /** the index of the node after the drag and drop relative to its new siblings */
   newIndex: number;
}
```

### Drag Handles

Adding the `limble-tree-handle` css class to an element in a node component will designate that element as the drag handle, making it so the node can only be dragged by clicking on that element.

### Demo App

A demo app can be run by following the instructions on our [github repo](https://github.com/LimbleCMMS/limble-tree).

## Issues, Feature Requests, Etc

If you find an issue or you would like to see an improvement, you may create an "issue" or start a "discussion" on our [github repo](https://github.com/LimbleCMMS/limble-tree).

We truly appreciate feedback; but keep in mind that we, the Limble team, built this library for our own needs, and requests from outside our organization may not always be a high priority.
