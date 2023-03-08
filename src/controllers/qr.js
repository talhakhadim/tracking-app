const invoiceQr = require('../models/invoice-qr');
const verification = require('../models/verification');
const customerverification = require('../models/customerverification');
const path = require('path');
const QRCode = require('qrcode');
const fs = require('fs');
const baseUrl = 'http://192.168.1.112:5000/'
module.exports = {
    createInvoice: async (req, res) => {
        if (!req.body.invoiceId) {
            return res.json({ message: 'No invoice id found' });
        }
        const checkInvoice = await invoiceQr.findOne({
            where: { invoiceId: req.body.invoiceId }
        })
        if (checkInvoice) {
            return res.json({ message: 'Invoice already exists' });
        }
        // const checkInvoice = await youInvoiceModel.findByPk(req.body.invoiceId);
        // if (!checkInvoice) {
        //     return res.json({ message: 'No invoice found' });
        // }
        // Use the above commented code accordingly
        const uniqueId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        const invoice = {
            invoiceId: req.body.invoiceId,
            qrCode: `${req.body.invoiceId}_${uniqueId}_invoice.png`,
            userId: req.body.userId,
            uniqueKey: uniqueId,
            customerId: req.body.customerId,
        };
        const invoiceData = baseUrl + 'invoice/admin/active/' + uniqueId;
        const invoiceAr = await invoiceQr.create(invoice);
        if (invoiceAr) {

            const folderPath = path.join(__dirname, 'temp');
            const fileName = path.join(folderPath, `${req.body.invoiceId}_${uniqueId}_invoice.png`);
            QRCode.toFile(fileName, invoiceData, function (err) {
                if (err) throw err;
                console.log('QR code saved as ' + fileName);
                // res.sendFile(fileName, { root: __dirname });
                return res.json(invoiceAr);
            });
        }

    },
    templateSecurity: async (req, res) => {
        try {
            if (!req.params.id) {
                return res.json({ message: 'No id found' });
            }
            const qrCode = req.params.id;
            // const emailCode = Math.random().toString(36).substring(2, 8) + Date.now();
            let emailCode = '123';
            const verificationCode = await verification.update(
                {
                    qrcode: qrCode,
                    code: emailCode,
                },
                {
                    where: {}
                }
            );
            if (!verificationCode) {

                return res.json({ message: 'Something Went Wrong, Please try again' });
            }
            // Email needs to sent here
            // Note : Sent email to abhai0548@gmail.com just sent verification code

            res.sendFile(__dirname + '/index.html');
        } catch (error) {
            return res.json({ message: error.message });
        }
    },
    sendingInvoice: async (req, res) => {

        // Verification
        const verify = await verification.findOne({
            where: { code: req.body.code, qrcode: req.body.barcode }
        })
        if (!verify) {
            return res.json({
                status: false,
                message: 'Invalid Code'
            })
        }
        await verification.update({ qrcode: null, code: null, }, {
            where: {}
        });

        // Fetching Invoice Information
        let invoiceDetails = await invoiceQr.findOne({
            where: { uniqueKey: req.body.barcode }
        })

        invoiceDetails = JSON.parse(JSON.stringify(invoiceDetails));
        console.log(invoiceDetails);
        if (!invoiceDetails) {
            return res.json({ status: false, message: 'Invoice not found, Please double check manually' })
        }
        const uniqueId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        const invoice = {
            invoiceId: invoiceDetails.id,
            qrcode: `${invoiceDetails.id}_${invoiceDetails.userId}_${uniqueId}_invoice.png`,
            employeeId: invoiceDetails.userId,
            customerId: invoiceDetails.customerId,
            uniqueKey: uniqueId,
            status: 'active'
        };
        console.log("Invoice=====>", invoice);
        const invoiceData = baseUrl + '/invoice/customer/active/' + uniqueId;
        const invoiceAr = await customerverification.create(invoice);
        if (invoiceAr) {
            const folderPath = path.join(__dirname, 'customers');
            const fileName = path.join(folderPath, `${invoiceDetails.id}_${uniqueId}_invoice.png`);
            QRCode.toFile(fileName, invoiceData, function (err) {
                if (err) throw err
                // Email needs to be sent here
                // Note: Sent email to customer, just sent a Qr Code as an image
                return res.json({ status: true, message: 'Invoice sent to client successfully and timer is activated' })

            });
        }
    },
    scanByCustomer: async (req, res) => {
        res.sendFile(__dirname + '/customer.html');
    },
    customerAcept: async (req, res) => {
        const qrCode = req.params.id;
        const customerVerification = await customerverification.findOne({
            where: { uniqueKey: qrCode }
        });
        if (!customerVerification) {
            return res.json({ message: 'Invalid Code' })
        }
        await customerVerification.update({ status: 'Acepted' });
        return res.json({ message: 'Invoice Acepted' });

        // Sent an email to abhai0548@gmail.com, that Invoice is acepted
    },
    avgTime: async (req, res) => {
        let employeeData;
        if (req.body.employeeId) {
            if (!req.body.date) {
                employeeData = await customerverification.findAll({
                    where: { employeeId: req.body.employeeId }
                });
            }
            else {
                const start = new Date(req.body.date.start);
                const end = new Date(req.body.date.end);
                employeeData = await customerverification.findAll({
                    where: {
                        employeeId: req.body.employeeId,
                        createdAt: {
                            [Op.between]: [start, end]
                        },
                    }
                });
            }
            if (!employeeData) {
                return res.json({ message: 'No data found' })
            }
            let totalTime = 0;

            for (let i = 0; i < employeeData.length; i++) {
                const createdAt = new Date(records[i].createdAt);
                const updatedAt = new Date(records[i].updatedAt);
                const timeDiff = updatedAt.getTime() - createdAt.getTime();
                totalTime += timeDiff;
            }
            const avgTime = totalTime / records.length;
            return res.json(avgTime);
        }
        else {
            return res.json({ message: 'Please enter an employee ID' })
        }
    }
}