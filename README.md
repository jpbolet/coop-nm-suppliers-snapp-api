# coop-nm-suppliers-snapp-api

SNapp data API, driven off real SNapp website API endpoints

Requires a MongoDB instance on localhost:27017
Install Node.js
Install npm
Run
  npm install
  npm start

In a browser, go to
  http://localhost:4001/snapp/deliveryItems
  http://localhost:4001/snapp/creditItems
  http://localhost:4001/snapp/cutOffTimes
  http://localhost:4001/snapp/altHistoryItems
  http://localhost:4001/snapp/messages
  http://localhost:4001/snapp/claimNos
  http://localhost:4001/snapp/claimNos
  http://localhost:4001/snapp/profileData

Postman requests to the real SNapp endpoints are here (uses basic authentication using store SNapp login credentials)
  ./api/suppliers/SNapp/Co-op SNapp.postman_collection.json
