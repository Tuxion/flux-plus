# API docs FluxPlus.ActionSource

[Back to index](../README.md)

`FluxPlus.ActionSource` is an enum that indicates the source of an action.

Note: in many cases one user interaction will trigger both a client and server actions.
One before and one after the API call.

<!-- MarkdownTOC depth=3 -->

- [Values](#values)
  - [`CLIENT`](#client)
  - [`SERVER`](#server)

<!-- /MarkdownTOC -->

## Values

### `CLIENT`

The action originated from a client event.
For example clicking a button, or a timer on the client has run out.

### `SERVER`

The action originated from the server.
For example an API call response was given or a server message was sent through websockets.
