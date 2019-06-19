const express = require('express');
const mongoose = require('mongoose');
const envalid = require("envalid");
const router = express.Router();
const axios = require("axios");

// Get environment variables
const env = envalid.cleanEnv(process.env, {
    SNAPP_CLIENT_ID: envalid.str(),
    SNAPP_CLIENT_SECRET: envalid.str(),
    SNAPP_ENDPOINT: envalid.url({default: "https://www.snapponline.co.uk/retapp/"})
});

var snappAxiosBasicAuth = 'Basic ' + Buffer.from(env.SNAPP_CLIENT_ID + ':' + env.SNAPP_CLIENT_SECRET).toString('base64');

const snappAxios = axios.create({
  baseURL: env.SNAPP_ENDPOINT,
  timeout: 20000,
  headers: {'Authorization': snappAxiosBasicAuth}
});

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1;
var yyyy = today.getFullYear();
if(dd<10)
{
    dd='0'+dd;
}
if(mm<10)
{
    mm='0'+mm;
}
var today = yyyy + '-' + mm + '-' + dd;

mongoose.connect('mongodb://localhost:27017/coop-nm', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("Supplier Data MongoDB database connection established successfully");
})

let SupplierData = require('../model/supplierData.model');

router.route('/').get(function(req, res) {
    SupplierData.find(function(err, SupplierData) {
        if (err) {
            console.log(err);
        } else {
            res.json(SupplierData);
        }
    });
});

router.route('/deliveryItems').get(function(req, res) {
  snappAxios.get("DeliverySet(Customer='" + env.SNAPP_CLIENT_ID + "',Date='" + today + "')")
    .then(function (response) {
      // handle success
      response.data.d.DeliveryItems = eval('(' + response.data.d.DeliveryItems + ')');
      response.data = response.data.d;
      console.log(response.data);
      res.json(response.data);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      res.json("{error: {code: 'DeliverySet', message: {lang: 'en', value: 'SNapp DeliverySet call failed'}");
    });
});

router.route('/creditItems').get(function(req, res) {
  snappAxios.get("CreditSet(Customer='" + env.SNAPP_CLIENT_ID + "',Date='" + today + "')")
    .then(function (response) {
      // handle success
      response.data.d.CreditItems = eval('(' + response.data.d.CreditItems + ')');
      response.data = response.data.d;
      console.log(response.data);
      res.json(response.data);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
});

router.route('/cutOffTimes').get(function(req, res) {
  snappAxios.get("ClaimCutOffSet(Date='2019-06-14')")
    .then(function (response) {
      // handle success
      response.data.d.CutOffTimes = eval('(' + response.data.d.CutOffTimes + ')');
      response.data = response.data.d;
      console.log(response.data);
      res.json(response.data);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
});

router.route('/altHistoryItems').get(function(req, res) {
  snappAxios.get("AlterationHistorySet(Customer='" + env.SNAPP_CLIENT_ID + "')")
    .then(function (response) {
      // handle success
      response.data.d.AltHistoryItems = eval('(' + response.data.d.AltHistoryItems + ')');
      response.data = response.data.d;
      console.log(response.data);
      res.json(response.data);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
});

router.route('/messages').get(function(req, res) {
  snappAxios.get("CustomerMessagesSet(Customer='" + env.SNAPP_CLIENT_ID + "',MessageNo='0')")
    .then(function (response) {
      // handle success
      response.data.d.Messages = eval('(' + response.data.d.Messages + ')');
      response.data = response.data.d;
      console.log(response.data);
      res.json(response.data);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
});

router.route('/claimNos').get(function(req, res) {
  snappAxios.get("ClaimNumbersSet(Customer='" + env.SNAPP_CLIENT_ID + "',ClaimType='DEL')")
    .then(function (response) {
      // handle success
      response.data.d.ClaimNos = eval('(' + response.data.d.ClaimNos + ')');
      response.data = response.data.d;
      console.log(response.data);
      res.json(response.data);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
});

router.route('/recallItems').get(function(req, res) {
  snappAxios.get("RecallSet(Customer='" + env.SNAPP_CLIENT_ID + "',Date='" + today + "')")
    .then(function (response) {
      // handle success
      response.data.d.RecallItems = eval('(' + response.data.d.RecallItems + ')');
      response.data = response.data.d;
      console.log(response.data);
      res.json(response.data);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
});

router.route('/profileData').get(function(req, res) {
  snappAxios.get("MyProfileSet(Customer='" + env.SNAPP_CLIENT_ID + "')")
    .then(function (response) {
      // handle success
      response.data.d.ProfileData = eval('(' + response.data.d.ProfileData + ')');
      response.data = response.data.d;
      console.log(response.data);
      res.json(response.data);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
});

router.route('/:id').get(function(req, res) {
    let id = req.params.id;
    SupplierData.findById(id, function(err, SupplierData) {
        res.json(SupplierData);
    });
});

router.route('/SupplierDataId/:SupplierData_id').get(function(req, res) {
    try {
        let SupplierData_id = req.params.SupplierData_id;
        SupplierData.findOne({'SupplierData_id': SupplierData_id}, function(err, SupplierData){
            res.json(SupplierData);
        });
    } catch (error) {
        console.log('Error while getting SupplierData by SupplierData_id:' + error);
        res.json(null);
    }
});

router.route('/update/:id').post(function(req, res) {
    SupplierData.findById(req.params.id, function(err, SupplierData) {
        if (!SupplierData)
            res.status(404).send("data is not found");
        else
            SupplierData.timestamp = req.body.timestamp;
            SupplierData.info_id = req.body.info_id;
            //SupplierData.SupplierData_id = req.body.SupplierData_id;
            SupplierData.SupplierData_type = req.body.SupplierData_type;
            SupplierData.display_name = req.body.display_name;
            SupplierData.currency = req.body.currency;
            SupplierData.SupplierData_number = req.body.SupplierData_number;
            SupplierData.provider = req.body.provider;
            SupplierData.amount = req.body.amount;

            SupplierData.save().then(SupplierData => {
                res.json('SupplierData updated!');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

router.route('/upsert').post(function(req, res) {
    SupplierData.findOne({'SupplierData_id': req.body.SupplierData_id}, function(err, SupplierData){
        if (!SupplierData) {
            SupplierData = new SupplierData(req.body);
            SupplierData.save()
                .then(SupplierData => {
                    res.status(200).json({'SupplierData': 'SupplierData added successfully'});
                })
                .catch(err => {
                    res.status(400).send('adding new SupplierData failed');
                });
        } else {
            // update
            SupplierData.timestamp = req.body.timestamp;
            SupplierData.info_id = req.body.info_id;
            SupplierData.SupplierData_type = req.body.SupplierData_type;
            SupplierData.display_name = req.body.display_name;
            SupplierData.currency = req.body.currency;
            SupplierData.SupplierData_number = req.body.SupplierData_number;
            SupplierData.provider = req.body.provider;
            SupplierData.amount = req.body.amount;

            SupplierData.save().then(SupplierData => {
                res.json('SupplierData updated!');
            })
            .catch(err => {
                res.status(400).send("Upsert not possible");
            });
        }
    });
});

router.route('/add').post(function(req, res) {
    let SupplierData = new SupplierData(req.body);
    SupplierData.save()
        .then(SupplierData => {
            res.status(200).json({'SupplierData': 'SupplierData added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new SupplierData failed');
        });
});

module.exports = router;
