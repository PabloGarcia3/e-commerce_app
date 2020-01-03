const User = require('../models/user');
const braintree = require('braintree');
require('dotenv').config();

const gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: 'jb2yy24nf6cnvz7b',
    publicKey: 'zvm9kjkqf9g3chfk',
    privateKey: '559ffd2d2c1087e6e6d2a6e3f9ccd512'
});

exports.generateToken = (req, res) => {
    gateway.clientToken.generate({}, function(err, response) {
        if(err) {
            res.status(500).send(err);
        } else {
            res.send(response);
        }
    });
}

exports.processPayment = (req, res) => {
    let nonceFromTheClient = req.body.paymentMethodNonce;
    let amountFromTheClient = req.body.amount;
    // charge
    let newTransaction = gateway.transaction.sale(
        {
            amount: amountFromTheClient,
            paymentMethodNonce: nonceFromTheClient,
            options: {
                submitForSettlement: true
            }
        }, 
        (error, result) => {
            if(error) {
                res.status(500).json(error);
            } else {
                res.json(result);
            }
        }
    );
};