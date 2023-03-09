const router = require('express').Router();
const qr = require('../controllers/qr');

router.post('/qr', qr.createInvoice);
// router.get('/customer/acepted/:id', qr.customerAcept);
// router.get('/customer/active/:id', qr.scanByCustomer);
router.get('/rejected/:id', qr.rejected);
router.post('/report/', qr.avgTime);
router.get('/active/:id', qr.sendingInvoice);
router.get('/acepted/:id', qr.customerAcept);

module.exports = router;
