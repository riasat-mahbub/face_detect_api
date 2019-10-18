REST api functions:

    function | send  | returns           | changes

1)  sign in  | POST  | success/failure   | change users signed in var as true,
change GLOBAL signed in var as true

2)  sign out | POST  | success/failure   | change users signed in var as false,change GLOBAL signed in var as true

3)  register | POST  | user info         | change users signed in var as true,change GLOBAL signed in var as true, add user to database

4)  profile  | GET   | user info         | NONE

5)  image    | PUT   | user info         | updates user rank


POST:
/signin, /signout, /register

GET:
/:email

PUT:
/:email