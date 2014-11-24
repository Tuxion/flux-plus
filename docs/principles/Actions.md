# Principles for Actions

An action is similar to an event.
It represent one thing the user or the server did.

We believe that stores should **never** be in an inconsistent state after the dispatcher has dispatched an Action.
Therefore Actions will contain _all the relevant data_ for this action.
This may be data that is present in multiple stores and represents multiple domains.

## Example: social medium with a medal system.

When you consider a social medium that awards medals for various reasons,
like creating your 100th post, you can see why Actions contain all relevant data.

Suppose you make your 100th post now.

`POST /api/posts`
```json
{"message": "Hello world!"}
```

This could result in a response like this:

```json
{
  "id":100,
  "message":"Hello world!",
  "awardedMedals":[
    {
      "id":4,
      "title":"Created 100 posts!"
    }
  ]
}
```

However you have two stores.

```
src/stores/post-store
src/stores/medal-store
```

This means your API abstraction layer should split this into two result-sets.
One for the new posts, one for the new medals.

In our Actions this is represented as follows:
    
```js
action = new FluxPlus.Action;
action.name = "CreatePost";

// Indicate that the payload has been provided by the server.
action.source = FluxPlus.ActionSources.SERVER;

// Indicate that these payloads should be merged by ID into the store.
action.entities.posts = FluxPlus.EntityOperations.MERGE;
action.entities.medals = FluxPlus.EntityOperations.MERGE;

// Assuming your API has split the result to a post and a medal object.
action.payload.posts = [result.post];
action.payload.medals = [result.medal];
```

When you dispatch this action, you can rest assured that React will not attempt to render
before both the PostStore and the MedalStore have been updated.
