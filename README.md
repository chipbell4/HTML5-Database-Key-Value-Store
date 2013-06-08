HTML5-Database-Key-Value-Store
==============================

An interface to the HTML5 WebSQL database, to store a simple set of key value pairs.
The purpose was to circumvent the state loss that comes with PhoneGap. PhoneGap loses
application state when leaving the app, so using a WebSQL database should hopefully
force the state to persist.
