const router = require('express').Router();
const qr = require('../controllers/qr');

router.post('/qr', qr.createInvoice);
router.get('/customer/acepted/:id', qr.customerAcept);
router.get('/customer/active/:id', qr.scanByCustomer);
router.get('/admin/active/:id', qr.templateSecurity);
// router.post('/admin/active/', qr.templateSecurity);
router.post('/admin/verify/:id', qr.sendingInvoice);

module.exports = router;
