# API docs FluxPlus.BaseStore

[Back to index](../README.md)

The base store is a parent class you can use to create simple stores.
They will register themselves with the dispatcher and handle
[`FluxPlus.Action`](../actions/action.md) payloads.
It also implements [`EventEmitter`](https://github.com/Wolfy87/EventEmitter/blob/master/docs/api.md)
so your ReactJS controller views can listen to `change` events.

Please note you are welcome to extend on these stores for your own application framework.
They are provided as a quick way to handle valid Action payloads.

<!-- MarkdownTOC depth=3 -->

- [Events](#events)
  - [change](#change)
- [Properties](#properties)
  - [`string` elementName](#string-elementname)
- [Methods](#methods)
  - [constructor (`FluxPlus.Dispatcher` dispatcher)](#constructor-fluxplusdispatcher-dispatcher)
  - [`mixed` getActive ()](#mixed-getactive-)
  - [`mixed` getOne (`mixed` id)](#mixed-getone-mixed-id)
  - [`Array` getAll ()](#array-getall-)
  - [`void` handleAction (`FluxPlus.Action` action)](#void-handleaction-fluxplusaction-action)
  - [`mixed` extractId (`object` element)](#mixed-extractid-object-element)
  - [`mixed` extractActive (`FluxPlus.Action` action)](#mixed-extractactive-fluxplusaction-action)

<!-- /MarkdownTOC -->

## Events

### change

Emitted when either the stored entities or the active entity is changed.

See [handleAction](#void-handleaction-fluxplusaction-action) for more details.

## Properties

### `string` elementName

This is the name of the elements to check for.

When implementing a store based on the BaseStore class, you want to override this property with your value.
It acts much like a selector to pick entities from incoming action payloads.

```js
MyStore.prototype.elementName = "users";
```

This will instruct the base store to handle actions that contain `users` entities.
(Yes, action calls them entities, see #6)

## Methods

### constructor ([`FluxPlus.Dispatcher`](../dispatcher/dispatcher.md) dispatcher)

This creates a new BaseStore instance.
The constructor will verify you have set the required property (`elementName`)
and register itself with the provided dispatcher.

Note: you should only use one dispatcher per application.
Do NOT instantiate a new Dispatcher for every store!

```js
// This is a BAD idea!
var myStore = new MyStore(new FluxPlus.Dispatcher());
```

A better idea would be to use Browserify style modules to include your single Dispatcher instance.

```js
// This will create our single Dispatcher instance.
module.exports = new FluxPlus.Dispatcher();
```

Then use this for your stores.

```js
var Dispatcher = require('../the-dispatcher');
var myStore = new MyStore(Dispatcher);
```

### `mixed` getActive ()

Returns the currently active entity.
By default this value is `null` until actions are dispatched that set it to a different value.

### `mixed` getOne (`mixed` id)

Returns a single entity based on the given ID.

If this ID is a scalar value (string, integer, etc.) it is assumed this is the same format
as [`extractId()`](#mixed-extractid-object-element) would return.

However if you provide an `object` the [`extractId()`](#mixed-extractid-object-element) method
will be called to do this for you.
One use-case for this is if you have a composite primary key,
but do not want to expose unique key generation logic to other parts of your code.

```js
// Using composite keys with an obscure format.
MyStore.prototype.extractId = function(element) {
  //Semicolon separator, particular ordering and case-insensitive productKey.
  return element.categoryName + ';' + element.productKey.toLowerCase()
};

// ...

// Fetches "Candy;choco-04" internally.
var product = myStore.getOne( {categoryName:"Candy", productKey:"CHOCO-04"} );

// What we avoided with this: having to know about the format.
var product = myStore.getOne( categoryName + ";" + productKey.toLowerCase() );
```

### `Array` getAll ()

Returns a shallow clone of the entire store contents.
This means you can manipulate the array without affecting the store.
While manipulating the entities it contains would.

### `void` handleAction ([`FluxPlus.Action`](../actions/action.md) action)

The default implementation for handling incoming actions.
This method will be registered on the Dispatcher you provided to the [constructor](#constructor-fluxplusdispatcher-dispatcher).

By default, this will do two things:

1. The active entity may be updated by both [`ActionSource`](../actions/action-source.md) `CLIENT` and `SERVER` actions.
  See [extractActive()](#mixed-extractactive-fluxplusaction-action) for more details.
2. Entity operations will only be performed for `ActionSource.SERVER` actions.

Either of these two will emit a `change` event.

If you would like to implement an optimistic store, for example when building a chat service.
You will want to override this method so you can store data generated on the client,
submit the data to the server and possibly roll back if the server returns an error.

Note: we discourage you from calling this method directly for any other purpose than unit testing.
Use the dispatcher for this.

### `mixed` extractId (`object` element)

This method finds the unique identifier of an entity object.
By default this checks for an `id` property.
If your entities have a different identifier, you should override this method.

```js
// Our primary key is called userId.
MyStore.prototype.extractId = function(element) {
  return element.userId;
};
```

### `mixed` extractActive ([`FluxPlus.Action`](../actions/action.md) action)

This method finds out whether an action contains a new active entity for this store.
By default this checks for an entity in the `FluxPlus.Action.active` property where the key is equal to
the `elementName` of this store.

Since the current implementation of actives is still in drafting stages, feel free to
override this method with your own filtering.

Return value should be `false` if there is no new active entity, any other value will be set as active.
So to unset your active entity, this function should return `null`.

```js
MyStore.prototype.extractActive = function(action) {
  
  // We want to look for specific action names.
  if(action.name == "UserTasks.setActive"){
    
    // And use a non-standard property on the action to store our active user.
    return action.activeUser;
    
  }
  
};
```

If you find yourself overriding this method a lot, please [submit an issue](https://github.com/Tuxion/flux-plus/issues/new)
and tell us about your use-cases. It will help us to find a good default implementation.
