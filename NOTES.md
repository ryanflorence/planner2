- Deploy anywhere

  - npm init remix w/ architect
  - deploy immediately
  - you own your server

- Switch to fly.io app

  - Open up `root.tsx`
  - Remix gives you control
  - add global styles
  - add font from google

- What's Outlet?

  - index routes
  - we'll see outlet/index again soon
  - styles gross, add index.css
  - links function!

- Make a nav

  - `<header><nav><NavLink>`
  - 404!
  - add the route
  - error! (need export)
    - error boundary
  - back to links
    - watch css load/unload
    - remix blocks to avoid FOUC

- Make projects page

  - ```
    section > nav > NavLink
                  > form
    ```
  - hardcode projects in the component
  - move to loader
  - bring in prisma
  - db query is empty! how to add records?

- Actions

  - What do you normally do next?
  - fake the non-remix way
  - make an action
  - side-bar on fetch api
  - write to prisma

- Nested Routes

  - add `projects/$id`
  - params

- Add tasks

  - Add type w/ include
  - We aren't even using JS
  - stop rendering js
  - redirect to project
  - HTML + HTTP, fundamentals
  - Why did we stop?
    - Annoying to have to go focus the input to add new things
    - Clicking the checkboxes
    - Scroll positions in sidebar (our docs)
    - pending indication

- use `<Form>`

  - clear out input with useRef
  - feels junky, slow it down
  - disable it?
    - can't type the next
    - messes up a11y
  - need optimistic/pending UI!
  - still works w/o JS

- implement checkboxes

  - useSubmit
  - put
  - bouncy thing
  - set default value

- Add counts to sidebar

  - Data diff fetching
    - don't need client side caches when your framework knows what to fetch
  - Mutations refetch
    - what browser/web have always done
    - easier to do and think about
  - disable js
    - slower by 10x-100x!

- So much more we didn't cover
