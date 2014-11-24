# API docs FluxPlus.Action

[Back to index](../README.md)

`FluxPlus.Action` is a class that represents an atomic action.
You can find out more about the principles behind an action [here](../../principles/Actions.md).

<!-- MarkdownTOC depth=3 -->

- [Properties](#properties)
  - [`string` name](#string-name)
  - [`ActionSource` source](#actionsource-source)
  - [`object` entities](#object-entities)
  - [`object` payload](#object-payload)
  - [`object` active](#object-active)
- [Methods](#methods)
  - [`void` validate](#void-validate)

<!-- /MarkdownTOC -->

## Properties

### `string` name

The name of the action. You can define your own standards here.

```js
myAction.name = "UserTasks.loadUsers";
```

### [`ActionSource`](action-source.md) source

The source of the action.

```js
myAction.source = ActionSource.CLIENT;
```

This will indicate the source of the action was a client generated event.

### `object` entities

Key value pairs containing [`EntityOperation`](entity-operation.md)
to indicate the operation to perform on this entity.

```js
myAction.entities.users = EnityOperation.MERGE;
```

This will merge the users in the payload with the current list of users.

### `object` payload

Key value pairs to provide an array of objects per entity.

```js
myAction.payload.users = [
  {id:1, username:"root"},
  {id:2, username:"tuxion"},
  ...
];
```

This is a payload that contains two `users` entities.
What should be done with them is set by the entity operation for this entity.
See the [`entities`](#object-entities) property.

### `object` active

Key value pairs of the store entity and the currently active object.

```js
myAction.active.users = {id:1, username:"root"};
```

This will set the active `users` entity to "root".
(We recommend you do this by reference, not a clone of your objects)

Note: active entities are kept separately from the stored entities.
If you want the entity to be available with methods such as `BaseStore.getOne(id)` be sure
to also provide this entity in the payload.

## Methods

### `void` validate

Validates that the action is properly formatted.
Currently this verifies the `name`, `source`, `payload` and `entities` properties.
The `active` property is still in it's drafting stages and so is not validated.

Note: you most likely do not need to call this method yourself.
The [FluxPlus.Dispatcher](../dispatcher/dispatcher.md) does this on dispatch.

* Throws [`FluxPlus.errors.ValidationError`](../errors/validation-error.md) when the action is invalid.
