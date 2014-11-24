# API docs FluxPlus.EntityOperation

[Back to index](../README.md)

`FluxPlus.EntityOperation` is an enum that indicates what operation to perform on an entity.

<!-- MarkdownTOC depth=3 -->

- [Values](#values)
  - [`REPLACE`](#replace)
  - [`MERGE`](#merge)
  - [`DELETE`](#delete)

<!-- /MarkdownTOC -->

## Values

### `REPLACE`

This indicates stores should discard all entities they previously had and should keep the new entities only.

### `MERGE`

This indicates that all entities should be added to the currently stored entities.
If an entity already exists, it should be replaced with the new value.

### `DELETE`

This indicates all the entities provided should be removed from the stores.
