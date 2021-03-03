# Limble Tree

An Angular library for creating highly dynamic drag-and-drop tree structures

## About

### Limble

Limble is a CMMS SaaS company providing great software to customers around the world. See [limblecmms.com](https://limblecmms.com) for more information. The `limble-tree` library is built by the Limble team and used in Limble's web applications.

### Status

This library is currently in **beta** development. It may not be ready for use in a production environment.

### Features

-  Unlimited tree depth
-  Can have a different component rendered for each node in the tree
-  Can drag nodes from one location in the tree to other locations
-  Dragging can be turned off for all or some of the nodes
-  Easy nesting of nodes
-  Nesting can be turned off for all or some of the nodes
-  Nodes can be dropped into other limble trees
-  Supports drag handles
-  Catchable events are fired when the tree renders and when a drop occurs
-  Pagination available for flat trees

### Warning

This library is compiled using Angular IVY, and therefore will not work in applications that do not also use IVY. IVY has been the default compiler for Angular since Angular 9.

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
-  `allowNesting`: Whether to allow "nesting" (placing a node one level deeper than currently exists on the branch) under a node. May be a boolean or a callback function that returns a boolean. If it is a callback, the callback will be called for each node when another node is attempting to nest under it. The parent node (the one which is potentially being nested under) will be passed in to the callback. Defaults to true.
-  `allowDragging`: Whether to allow drag-and-drop functionality. May be a boolean or a callback function that returns a boolean. If it is a callback, the callback will be called for each node when a drag is attempted on it, and that node will be passed in to the callback. Defaults to true.
-  `allowDrop`: A callback that determines whether a sourceNode can be dropped at a particular location. If it returns true, the drop is allowed; if it returns false, the drop is not allowed. This function takes three parameters: the node being dragged, the proposed parent node, and the proposed index under that parent. Defaults to `() => true`.
-  `listMode`: When set to true, list mode will enforce a flat tree structure, meaning there can only be one level of the tree. `allowNesting` is automatically set to `false` and any children will be deleted. This mode can be used when the same dynamic drag and drop functionality of the tree is desired, but the tree structure itself is not necessary. This also opens up the pagination API on the limble-tree-root component. See the pagination section below for details about pagination.

### The LimbleTreeRoot Component

Here are the inputs and outputs of the `<limble-tree-root>` component:

-  input `data` -- a LimbleTreeData array. Required.
-  input `options` -- a LimbleTreeOptions object.
-  input `itemsPerPage` -- A number indicating how many many items to display at a time. See the "Pagination" section below.
-  input `page` -- A number indicating the current page og items. See the "Pagination" section below.
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

### Pagination

When the `listMode` option is set to true, the pagination API is made available. Pagination is accomplished using two of the inputs of the `limble-tree-root` component: the `itemsPerPage` input and the `page` input. These inputs will not do anything unless `listMode` is turned on. When in `listMode`, the list will split into pages, where each page contains `itemsPerPage` number of items. (Note that the last page may have fewer items than the `itemsPerPage` number.) Only one page will be displayed at a time. The `page` input indicates which page to show: When `page` is 1, the first page will display, and so on.

### Demo App

A demo app can be run by following the instructions on our [github repo](https://github.com/LimbleCMMS/limble-tree).

## Issues, Feature Requests, Etc

If you find an issue or you would like to see an improvement, you may create an "issue" or start a "discussion" on our [github repo](https://github.com/LimbleCMMS/limble-tree).

We truly appreciate feedback; but keep in mind that we, the Limble team, built this library for our own needs, and requests from outside our organization may not always be a high priority.
