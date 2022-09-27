const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { default: Stripe } = require("stripe");
dotenv.config();
const port = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.get("/", (req, res) => {
  console.log("server is running");
  res.send("server is running");
});

app.post("/api/payment-intents", async (req, res) => {
  const { amount, description, shipping } = req.body;
  console.log(amount);
  delete shipping.email;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,

      currency: "usd",
      description: "Software development services",
      shipping: {
        name: shipping.name,
        address: {
          line1: shipping.address.line1,
          postal_code: shipping.address.postal_code,
          city: shipping.address.city,
          state: shipping.address.state,
          country: "US",
        },
      },
    });

    res.status(200).send({
      data: paymentIntent.client_secret,
      message: "Successfully payment intent created!",
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.use("*", (req, res) => {
  res.status(404).send({ message: "Method not found!" });
});

app.listen(port, () => {
  console.log(`server is running on ${port} port`);
});
