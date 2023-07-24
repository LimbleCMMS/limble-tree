# Limble Tree

An Angular library for building visual tree structures. Built and used by the team at [Limble](https://limblecmms.com/);

## Features

-  Allows any number of different components to be rendered in the same tree.
-  Collapsible tree branches
-  Move branches around both programmatically and with built-in drag-and-drop.
-  Branches can be moved between trees.
-  No limit on tree depth or size.
-  Recently redesigned to allow better performance with large/complex trees.

## Compatibility Table

| limble-tree | Angular         | RxJs  |
| ----------- | --------------- | ----- |
| 1.0.0       | 14.2.0 - 14.x.x | 7.x.x |
| 2.0.0       | 15.x.x          | 7.x.x |

## Installation

```bash
   npm install @limble/limble-tree
```

## Basic Usage

A basic tree is very easy to set up.

### Step 1

Import the limble-tree module into your own Angular module or standalone component.

```typescript
import { NgModule } from "@angular/core";
import { LimbleTreeModule } from "@limble/limble-tree";

@NgModule({
   imports: [LimbleTreeModule]
})
export class AppModule {}
```

or

```typescript
import { Component } from "@angular/core";
import { LimbleTreeModule } from "@limble/limble-tree";

@Component({
   standalone: true,
   imports: [LimbleTreeModule],
   template: `<div></div>`
})
export class MyComponent {}
```

### Step 2

Add a template variable to the HTML element in which the tree should be rendered.

```html
<div #treeContainer></div>
```

### Step 3

Use `@ViewChild` to get the `ViewContainerRef` of that element.

```typescript
@ViewChild("treeContainer", { read: ViewContainerRef }) treeContainer?: ViewContainerRef;
```

### Step 4

Inject TreeService into your component.

```typescript
constructor(private readonly treeService: TreeService) {}
```

### Step 5

In the `ngAfterViewInit` lifecycle hook, call `createEmptyTree()`, passing in the ViewContainerRef obtained in step 3.

```typescript
protected tree?: TreeRoot<MyTreeContentComponent>;

public ngAfterViewInit(): void {
   this.tree = this.treeService.createEmptyTree<MyTreeContentComponent>(this.treeContainer);
}
```

### Step 6

Render components in the tree by calling `grow()`.

```typescript
//Renders four instances of the MyTreeContentComponent; the fourth is nested under the third.
const branch1 = this.tree.grow(MyTreeContentComponent);
const branch2 = this.tree.grow(MyTreeContentComponent);
const branch3 = this.tree.grow(MyTreeContentComponent);
const branch3a = branch3.grow(MyTreContentComponent);
```

### Step 7

That's it, you've built your first limble-tree. Here is the full component code we just built:

```typescript
import {
   Component,
   AfterViewInit,
   ViewChild,
   ViewContainerRef
} from "@angular/core";
import { LimbleTreeModule, TreeRoot } from "@limble/limble-tree";
import { MyTreeContentComponent } from "somewhere in your filesystem";

@Component({
   standalone: true,
   imports: [LimbleTreeModule],
   template: `<div #treeContainer></div>`
})
export class MyComponent implements AfterViewInit {
   @ViewChild("treeContainer", { read: ViewContainerRef })
   treeContainer?: ViewContainerRef;

   protected tree?: TreeRoot<MyTreeContentComponent>;

   public constructor(private readonly treeService: TreeService) {}

   public ngAfterViewInit(): void {
      this.tree = this.treeService.createEmptyTree<MyTreeContentComponent>(
         this.treeContainer
      );
      // Renders four instances of the MyTreeContentComponent;
      // the fourth is nested under the third.
      const branch1 = this.tree.grow(MyTreeContentComponent);
      const branch2 = this.tree.grow(MyTreeContentComponent);
      const branch3 = this.tree.grow(MyTreeContentComponent);
      const branch3a = branch3.grow(MyTreContentComponent);
   }
}
```

## Communicating With Your Components

### Inputs and Outputs

If the components passed to `grow()` require inputs, or if you want to watch for output events, you can pass those things into the optional second parameter.

```typescript
tree.grow(MyTreeContentComponent, {
   inputBindings: { myInput1: "hello world", myInput2: 1000 },
   outputBindings: {
      myOutput: (event) => {
         /* Do stuff */
      }
   }
});
```

The inputBindings object tells the tree to pass "hello world" into the component field named `myInput1`. Similarly, the tree will pass 1000 into the component field named "myInput2".

The outputBindings object works similarly, but instead of passing values, it registers callbacks to run when the specified outputs emit events. In the example, the arrow function will be run each time the field named `myOutput` emits a value.

### Special `treeBranch` Input

No matter what you decide to pass through inputs, if anything, the tree will always automatically pass a TreeBranch object into the component. That object can be accessed within the component by declaring a `treeBranch` Input property.

```typescript
@Input() treeBranch?: TreeBranch<MyTreeContentComponent>;
```

This treeBranch object can be very useful for determining things like where the component lives in the tree, if it has any child branches, etc. It is also used for many of the more advanced features described elsewhere in this document.

### Passing Custom Data Through The `treeBranch` Input Using `meta`

If desired, you can add custom data to the treeBranch object associated with your rendered components. You can do this using another property of the second parameter of `grow()`, called `meta`.

```typescript
tree.grow(MyTreeContentComponent, {
   meta: { myCustomDataField: "Hello World!" }
});
```

The value of `meta` can be accessed within your rendered component by calling `this.treeBranch.meta()`.

```typescript
@Input() treeBranch?: TreeBranch<MyTreeContentComponent>;

public ngOnInit(): void {
   console.log(this.treeBranch?.meta()) // outputs `{ myCustomDataField: "Hello World!" }`
}
```

## Indentation

By default, each level of the tree beyond the first will be indented an additional 16px. This value is configurable:

```typescript
treeService.createEmptyTree(this.treeContainer, { indentation: 32 });
```

## Collapsing Branches

Tree branches which have descendant branches can be collapsed, temporarily removing its descendants from the tree. The descendants can be grafted back into the tree later, as if they were never removed.

To collapse a branch, simply inject the TreeCollapseService into your component and call `collapse()`, passing in the branch to be collapsed. To restore the hidden branches, call `expand()`, passing in the same branch that was passed to `collapse()`

```typescript
constructor(private readonly collapseService: TreeCollapseService) {}

public ngAfterViewInit(): void {
   this.tree = this.treeService.createEmptyTree<MyTreeContentComponent>(
      this.treeContainer
   );
   // Renders four instances of the MyTreeContentComponent;
   // the fourth is nested under the third.
   const branch1 = this.tree.grow(MyTreeContentComponent);
   const branch2 = this.tree.grow(MyTreeContentComponent);
   const branch3 = this.tree.grow(MyTreeContentComponent);
   const branch3a = branch3.grow(MyTreContentComponent);

   //Hides the fourth branch
   this.collapseService.collapse(branch3);

   //restores the fourth branch to its original place after 2 seconds have passed.
   setTimeout(() => {
      this.collapseService.expand(branch3);
   }, 2000);
}
```

A branch can be configured to be collapsed by default, which means that any children grown onto it will not be visible until `expand()` is called.

```typescript
constructor(private readonly collapseService: TreeCollapseService) {}

public ngAfterViewInit(): void {
   this.tree = this.treeService.createEmptyTree<MyTreeContentComponent>(
      this.treeContainer
   );
   // Renders four instances of the MyTreeContentComponent;
   // the fourth is nested under the third.
   const branch1 = this.tree.grow(MyTreeContentComponent);
   const branch2 = this.tree.grow(MyTreeContentComponent);
   const branch3 = this.tree.grow(MyTreeContentComponent, {defaultCollapsed: true});
   const branch3a = branch3.grow(MyTreContentComponent); // this branch will be created but not rendered

   //renders the fourth branch after 2 seconds have passed.
   setTimeout(() => {
      this.collapseService.expand(branch3);
   }, 2000);
}
```

You can check if a branch can be expanded using the collapse service's `isCollapsed()` method.

## Moving Branches Programmatically

Branches can be moved around, both within a single tree and between different trees.

```typescript
public ngAfterViewInit(): void {
   this.tree1 = this.treeService.createEmptyTree<MyTreeContentComponent>(
      this.treeContainer1
   );
   // Renders four instances of the MyTreeContentComponent;
   // the fourth is nested under the third.
   const branch1 = this.tree1.grow(MyTreeContentComponent);
   const branch2 = this.tree1.grow(MyTreeContentComponent);
   const branch3 = this.tree1.grow(MyTreeContentComponent);
   const branch3a = branch3.grow(MyTreContentComponent);

   setTimeout(() => {
      //moves branch1 so it is now the second child of branch3
      branch1.graftTo(branch3);
   }, 2000);

   setTimeout(() => {
      // moves branch1 back to its original position.
      branch1.graftTo(this.tree1, 0);
   }, 4000);

   setTimeout(() => {
      this.tree2 = this.treeService.createEmptyTree<MyTreeContentComponent>(
         this.treeContainer2
      );
      // moves branch1 to a different tree
      branch1.graftTo(this.tree2);
   }, 8000);
}
```

A branch can also be removed from a tree without immediately grafting it to a new position.

```typescript
public ngAfterViewInit(): void {
   this.tree = this.treeService.createEmptyTree<MyTreeContentComponent>(
      this.treeContainer
   );
   // Renders four instances of the MyTreeContentComponent;
   // the fourth is nested under the third.
   const branch1 = this.tree.grow(MyTreeContentComponent);
   const branch2 = this.tree.grow(MyTreeContentComponent);
   const branch3 = this.tree.grow(MyTreeContentComponent);
   const branch3a = branch3.grow(MyTreContentComponent);

   //removes branch1 from the tree after 2 seconds
   setTimeout(() => {
      branch1.prune();
   }, 2000);

   //restores branch1 to its original position after an additional 2 seconds
   setTimeout(() => {
      branch1.graftTo(this.tree, 0);
   }, 4000);
```

Both the `prune()` and `graftTo()` methods will include all of the children of the branch as well. For example, pruning a branch that has 3 child branches will remove the parent as well as all three children; grafting the parent back into a tree will also graft the children into that tree, retaining their position as children of the moved parent.

Note: use `destroy()` rather than `prune()` when you wish to completely delete a branch. See "Destroying Trees and Branches" below.

## Moving Branches With Drag-And-Drop

Drag and drop functionality is easy to use. Simply add the `[limbleTreeDraggable]` directive to an element of your rendered component, and pass it that component's associated TreeBranch. When the user clicks and drags the element, the branch will be pruned from the tree and dragged with the mouse.

```html
<div [limbleTreeDraggable]="treeBranch">Drag Me!</div>
```

As the user drags the branch over other branches of the tree, dropzones will appear to indicate where the dragged branch may be placed. Dropping into a dropzone will graft the dragged branch at that location.

### Dragging Into Empty Trees

Dropzones appear automatically as a branch is dragged over other branches. But what if the target tree has no other branches? In this case, a dropzone will not appear automatically. You will have to manually tell the tree when to render its dropzone using the `TreeDragAndDropService`.

### Configurable Restrictions For Drag-And-Drop

A tree can be configured to disallow certain branches from...

1. being dragged at all
2. being dropped at specific locations in the tree

When calling `createEmptyTree()`, there are three options that can be passed to the second parameter to control these restrictions. There are no restrictions by default.

```typescript
public ngAfterViewInit(): void {
   this.tree = this.treeService.createEmptyTree<MyTreeContentComponent>(
      this.treeContainer,
      {
         // Prevents dragging branches which have less than three children
         allowDragging: (treeBranch) => treeBranch.branches().length < 3,
         // Prevents drops on first-level branches
         allowDrop: (source, parent, index) => parent.parent() !== undefined,
         // Does not allow any branches to be dropped under a branch whose metaData property `noChildren` is set to `false`
         allowNesting: (treeBranch) => treeBranch.meta().noChildren === false
      }
   );
```

These options only apply to drag-and-drop functionality. They do not restrict programmatic movement of branches, such as when using the `prune()` or `graftTo()` methods.

More details about these configuration options can be found in `tree-options.interface.ts`.

## Watching For Tree Events

Both the TreeBranch and TreeRoot objects will emit information when certain events occur. These events can be captured by subscribing to the observable returned by the `events()` method.

```typescript
public ngAfterViewInit(): void {
   this.tree = this.treeService.createEmptyTree<MyTreeContentComponent>(
      this.treeContainer
   );
   this.tree.events().subscribe((event) => {
      console.log(event.type());
   });
   const branch1 = this.tree.grow(MyTreeContentComponent); // will output "graft"
   const branch2 = this.tree.grow(MyTreeContentComponent); // will output "graft"
   const branch3 = branch2.grow(MyTreeContentComponent); //will output "graft"
   this.tree.destroy(); //will output "destruction" four times; one for each branch, and one for the root.
}
```

Events bubble up the tree. So subscribing to the root's `events()` observable will capture all tree events for that tree. Subscribing to the `events()` observable of a branch will capture all tree events for that branch and its descendants.

Below is a list of event types that are currently emitted by the tree.

-  drag start
-  drop
-  drag end
-  prune
-  graft
-  destruction

Each event contains applicable information about the event, such as the nodes involved, position in the tree, etc.

## Traversing The Tree

### Parents and Children

Trees are doubly-linked, meaning that each node in the tree holds a pointer to its parent and a pointer to each of its children. These pointers are accessed using the `parent()` and `branches()` methods, respectively. The order of child branches is maintained. The `getBranch()` method takes an index as an argument and returns the branch at that index. A branch's position relative to its siblings is obtained using the `index()` method.

Unlike TreeBranch instances, a TreeRoot does not have a `parent()` or `index()` method, but it does have a `branches()` and `getBranch()` methods.

TreeBranch instances have a method `root()`, which returns the root of their current tree. TreeRoot instances also have this method, and in that case it always returns itself.

```typescript
public ngAfterViewInit(): void {
   this.tree = this.treeService.createEmptyTree<MyTreeContentComponent>(
      this.treeContainer
   );
   this.tree.events().subscribe((event) => {
      console.log(event.type());
   });
   const branch1 = this.tree.grow(MyTreeContentComponent);
   const branch2 = this.tree.grow(MyTreeContentComponent);
   const branch2a = branch2.grow(MyTreeContentComponent);
   const branch2b = branch2.grow(MyTreeContentComponent);
   const branch2a1 = branch2a.grow(MyTreeContentComponent);
   const branch2a1 = branch2a.grow(MyTreeContentComponent);

   //All of these expressions are true
   assert(branch2b.parent() === branch2);
   assert(branch2b.index() === 1);
   assert(branch2.branches()[1] === branch2b);
   assert(branch2a1.branches().length === 0);
   assert(branch1.parent() === this.tree);
   assert(this.tree.getBranch(2) === branch2);
   assert(branch2a1.root() === this.tree);
}
```

### Traversal Utility Methods

There are a couple other methods used to traverse the tree.

-  `traverse()` traverses the tree in [depth-first pre-order](https://en.wikipedia.org/wiki/Tree_traversal#Pre-order,_NLR) and executes a provided callback on each node.
-  `plot()` traverses the tree and returns a many-dimensional [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)representing the shape of the tree.

### Get Branch's Current Location in the Tree

You can call `position()` on a TreeBranch to get an array of indexes, indicating the path from the root to that branch.

Example: If `position()` returns [2, 2, 4], that means the branch is a great-grandchild of the root (three elements == three levels deep), and the branch could be accessed like so:

```typescript
root.getBranch(2).getBranch(2).getBranch(4);
```

## Destroying Trees And Branches

The `destroy()` method must be called on a TreeRoot in order for its resources to be properly released. Failing to do so will cause memory leaks and other performance problems.

Branches also have a `destroy()` method. Calling `destroy()` on the TreeRoot will automatically call the `destroy()` method of each branch in the tree, including branches that have been collapsed.

Branches that have been otherwise pruned are not part of any tree; their `destroy()` method must be called manually in order to release their resources. Calling a branch's `destroy()` method will automatically call the `destroy()` method of each descendant branch, including descendants that are collapsed.

Destroyed roots and branches have very limited functionality. Many methods will simply throw an error if the instance has been previously destroyed. You can check if a node is destroyed with the `isDestroyed()` method.

## Accessing Underlying Structures

There are methods on TreeBranch and TreeRoot instances which grant access to underlying structures. We recommend only using these in advanced scenarios. They are not fully documented here at this time.

-  detectChanges()
-  dispatch()
-  getBranchesContainer()
-  getComponentInstance()
-  getHostView()
-  getNativeElement()
-  getUserlandComponentRef()

## Development and Contributions

See the readme in our [Github repository](https://github.com/LimbleCMMS/limble-tree).
