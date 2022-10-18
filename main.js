const express = require('express')
const app = express()
const cors = require('cors')
var bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));

const Raffle = require("./models/rifa")
const Number = require("./models/numero");
const { Op } = require('sequelize');
const Customer = require('./models/comprador');
// parse application/json
app.use(bodyParser.json())

app.use(cors())
const port = 8080

app.get('/', async (req, res) => {
    let raffle = await Raffle.findAll();
    res.send(raffle);
})
app.get('/:idRaffle', async (req, res) => {
    let idRaffle = req.params.idRaffle;
    let raffle = await Raffle.findOne({ where: { id: idRaffle }, nest: true, raw: true })
    if (!raffle) {
        res.status(404).send({ message: "Not found" });
    }
    let numbers = await Number.findAll({ where: { idRaffle: idRaffle }, nest: true, raw: true })
    console.log(raffle);
    numbers = await Promise.all(numbers.map(async (number) => {
        let customer = await Customer.findOne({ where: { idNumber: number.id, active: true } })
        if (customer) {
            number.customer = customer;
        }
        return number;
    }))
    raffle.numbers = numbers
    res.status(200).send(raffle);
})
app.post('/', async (req, res) => {
    try {
        n = 100;
        console.log(req.body);
        let temp = req.body
        let raffle = await Raffle.create(temp)
        console.log(raffle);
        for (let a = 1; a <= n; a++) {
            let number = await Number.create({
                idRaffle: raffle.id,
                number: a
            });
            console.log(number.number);
        }
        res.status(200).send(raffle)
    } catch (err) {
        console.log(err);
    }
})
app.post('/billingNumber', async (req, res) => {
    try {
        let promisseMy = req.body.numbers.map(async (element) => {
            let number = await Number.findOne({ where: { idRaffle: req.body.idRaffle, number: element }, nest: true, raw: true });
            let customer = await Customer.findOne({ where: { idNumber: number.id, active: true } })
            if (customer) {
                return { message: "Numero já comprado", error: true, number: element };
            }
            let customerData = req.body.customer;
            customerData.idNumber = number.id;
            let data = await Customer.create(customerData)
            return { message: "Numero comprado com sucesso", error: false, number: element };
        })
        promisseMy = await Promise.all(promisseMy);
        res.status(200).send(promisseMy)
    } catch (err) {
        console.log(err);
        res.status(400).send({ message: err.message })
    }
})
app.post('/customer/:id/:status', async (req, res) => {
    try {
        let status = req.params.status == 'active' ? 1 : 0
        let customer = await Customer.findOne({ where: { id: req.params.id, active: { [Op.ne]: status } } })
        if (!customer) {
            return res.status(200).send({});
        }
        customer.active = status
        await customer.save();
        return res.status(200).send({ message: "atualizado com sucesso " })
    } catch (err) {
        console.log(err);
        res.status(400).send({ message: err.message })
    }
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})