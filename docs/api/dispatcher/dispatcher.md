# API docs FluxPlus.Dispatcher

[Back to index](../README.md)

`FluxPlus.Dispatcher` is an extension of `Flux.Dispatcher`.
Instead of accepting any kind of payload, it requires (and validates) instances of
[`FluxPlus.Action`](../actions/action.md) as it's payload.

To see the base functions please refer to: [`Flux.Dispatcher`](https://github.com/facebook/flux/blob/2.0.2/docs/Dispatcher.md)

<!-- MarkdownTOC depth=3 -->

- [Methods](#methods)
  - [`void` dispatch (`FluxPlus.Action` action)](#void-dispatch-fluxplusaction-action)

<!-- /MarkdownTOC -->

## Methods

### `void` dispatch ([`FluxPlus.Action`](../actions/action.md) action)

Validates the Action and then dispatches it.

* Throws [`FluxPlus.errors.InvalidArgumentError`](../errors/invalid-argument-error.md) when
  the action is not an instance of [`FluxPlus.Action`](../actions/action.md).
* Throws [`FluxPlus.errors.ValidationError`](../errors/validation-error.md) when the action
  is invalid. See [`FluxPlus.Action::validate()`](../actions/action.md#void-validate).
