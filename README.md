# Planner

## Goodies

- [ ] hide login errors on next input change
- [ ] Checkbox to show password as you type
- [ ] Style logout button signup / sign in forms
- [ ] Tell the user the email is taken already

## Next up

- [ ] Add `withSession` helper and clean all that up
- [ ] add projects to user
- [ ] add tasks to project
- [ ] add notes to project

## May 4

- [x] add dark theme
- [x] Create sessions table
- [x] Create sign up page
  - [x] Create user
  - [x] Create db session
  - [x] Put db session id in cookie
- [x] Update `requireUser`
  - [x] get session id from cookie
  - [x] look up session in db
- [x] Update login page
  - [x] put required form stuff back
  - [x] compare hashed passwords
  - [x] create db session
  - [x] Redirect to requested page (use sergio's redirectBack?)
  - [x] check for user session first
    - [x] redirect if found
- [x] Create logout button
