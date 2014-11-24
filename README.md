# FluxPlus - Alpha version

Facebooks Flux principles have not been formalized into a full-stack framework yet.
FluxPlus does not attempt to tackle this problem all at once but instead formalizes
some additional principles and ideas to take you one step closer to a framework.

FluxPlus provides several base classes to work with in addition to the existing
Flux dispatcher. Using this you can quickly implement a skeleton framework of your own.

<!-- MarkdownTOC -->

- [Installing](#installing)
- [Developing](#developing)
- [API documentation](#api-documentation)
- [Principles](#principles)

<!-- /MarkdownTOC -->

## Installing

Add `flux-plus` to your bower dependencies and issue `bower update`.

## Developing

Requires node, npm and bower (globally).

```sh
npm install && bower install
```

Then to develop in real-time, use the default gulp action to do a build and watch.

```sh
./node_modules/.bin/gulp
```

In addition, open a second console with testem to see the unit testing results.

```sh
./node_modules/.bin/testem
```

## API documentation

See [/docs/api](docs/api/README.md)

## Principles

Documentation about why these classes are structured the way they are can be found here.

* [Actions](docs/principles/Actions.md)
