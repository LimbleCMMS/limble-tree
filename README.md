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

## Demo

(requires node and npm)

To view the demo:

1. clone/download this repo
2. run `npm ci`
3. run `npm run start`
4. Open your browser to `localhost:4200`

## Installation and Usage

See [the package README](https://github.com/LimbleCMMS/limble-tree/blob/main/projects/limble-tree/README.md) or the [NPM page](https://www.npmjs.com/package/@limble/limble-tree)

## Development

### Requirements

-  node
-  npm

### Suggested Dev Setup

1. Run `npm ci` to install all the node modules.
2. Run `npm run buildWatch`. This builds the library in watch mode.
3. In a second terminal, run `npm run start`. This builds the demo app in watch mode. It should automatically open the demo app in your browser.

After running these commands, changes in the library or in the demo app will both trigger a live reload so you can immediately view and experiment on your changes.

## Issues, Feature Requests, Etc

If you find an issue or you would like to see an improvement, you may create an "issue" or start a "discussion" here in github.

We truly appreciate feedback; but keep in mind that we, the Limble team, built this library for our own needs, and requests from outside our organization may not always be a high priority.
