const router = require('express').Router();
const qr = require('../controllers/qr');

router.post('/qr', qr.createInvoice);
// router.get('/customer/acepted/:id', qr.customerAcept);
router.get('/image/:id', qr.returnImage);
router.get('/rejected/:id', qr.rejected);
router.post('/report/', qr.avgTime);
router.get('/active/:id', qr.sendingInvoice);
router.get('/acepted/:id', qr.customerAcept);
router.put('/update/:id', qr.updateInvoice);

module.exports = router;
