const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();
const saltRounds = 5;
app.set('view engine', 'ejs');



mongoose.connect("mongodb+srv://kushagra:kushagra@clusterbakery.rtyaf.mongodb.net/bakery", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


let db = mongoose.connection;
db.once("open", () =>
    console.log("Connected to MongoDB"));
db.on("error", (err) =>
    console.log(err));


const userSchema = mongoose.Schema({
    name: String,
    password: String,
    email: String,
});


const userPlans = mongoose.Schema({
    email: String,
    plans: [{
        name: String,
        desc: String,
        rate: Number,
        img: String,
    }, ],
});

const userOrder = mongoose.Schema({
    name: String,
    email: String,
    pno: String,
    address: String,
    pin: String,
    item: String,
    price: String,
    amount: String
});

const userFeedback = mongoose.Schema({
    name: String,
    email: String,
    item: String,
    feedback: String
});



app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const User = new mongoose.model("users", userSchema);
const planDetails = new mongoose.model("plans", userPlans);
const UserOrder = new mongoose.model("orders", userOrder);
const UserFeedback = new mongoose.model("feedback", userFeedback);



app.post("/signup", (req, res) => {
    console.log("hello");
    let plainTextPass = req.body.psw;
    bcrypt.hash(plainTextPass, saltRounds, (err, hashedPass) => {
        if (err) throw err;
        signupDetails = {
            name: req.body.name,
            email: req.body.email,
            password: hashedPass,
        };
        User.create(signupDetails, (err, response) => {
            if (err) {
                res.status(500).send();
            } else {
                res.redirect("/success");
            }
        });
        userPlanDetails = {
            email: req.body.email,
            plans: [],
        };
        planDetails.create(userPlanDetails, (err, response) => {
            if (err) {
                res.status(500).send();
                throw err;
            }
        });
    });
});

app.post("/order", (req, res) => {
    console.log("order-Route called");
    console.log(req.body);
    const order = {
        name: req.body.name,
        email: req.body.email,
        pno: req.body.ph,
        address: req.body.add,
        pin: req.body.pin,
        item: req.body.item,
        price: req.body.price,
        amount: req.body.amount
    }
    UserOrder.create(order, (err, response) => {
        if (err) {
            res.status(500).send();
            throw err;
        }
    });
    console.log("order placed");
    res.redirect("success2.html");
});

app.post("/feedback", (req, res) => {
    console.log("feedback-Route called");
    console.log(req.body);
    const feedback = {
        name: req.body.name,
        email: req.body.email,
        item: req.body.item,
        feedback: req.body.feedback
    }
    UserFeedback.create(feedback, (err, response) => {
        if (err) {
            res.status(500).send();
            throw err;
        }
    });
    console.log("feedback Submitted");
    res.redirect("success3.html");
});



app.get("/plan1", (req, res) => {
    plan = {
        name: "Plan 1",
        desc: "Strawberry-Cheese-cake",
        rate: 999,
        img: "img/plan1.png",
    };
    planDetails.updateOne({ email: req.cookies.userEmail }, { $push: { plans: plan } }, (err, response) => {
        if (err) throw err;
        else {
            res.redirect("/safeadd");
        }
    });
});



app.get("/plan2", (req, res) => {
    plan = {
        name: "Plan 2",
        desc: "Nutella-chocolate",
        rate: 1299,
        img: "img/plan2.png",
    };
    planDetails.updateOne({ email: req.cookies.userEmail }, { $push: { plans: plan } }, (err, response) => {
        if (err) throw err;
        else {
            res.redirect("/safeadd");
        }
    });
});


app.get("/plan3", (req, res) => {
    plan = {
        name: "Plan 3",
        desc: "Black-forest-cake",
        rate: 999,
        img: "img/plan3.png",
    };
    planDetails.updateOne({ email: req.cookies.userEmail }, { $push: { plans: plan } }, (err, response) => {
        if (err) throw err;
        else {
            res.redirect("/safeadd");
        }
    });
});


app.get("/plan4", (req, res) => {
    plan = {
        name: "Plan 4",
        desc: "Strawberry Muffin",
        rate: 499,
        img: "img/cupacke1.jpg",
    };
    planDetails.updateOne({ email: req.cookies.userEmail }, { $push: { plans: plan } }, (err, response) => {
        if (err) throw err;
        else {
            res.redirect("/safeadd");
        }
    });
});



app.get("/plan5", (req, res) => {
    plan = {
        name: "Plan 5",
        desc: "Ferro-Choco-Muffin",
        rate: 499,
        img: "img/cupacke3.jpg",
    };
    planDetails.updateOne({ email: req.cookies.userEmail }, { $push: { plans: plan } }, (err, response) => {
        if (err) throw err;
        else {
            res.redirect("/safeadd");
        }
    });
});



app.get("/plan6", (req, res) => {
    plan = {
        name: "Plan 6",
        desc: "Butter Muffin",
        rate: 999,
        img: "img/cupcake2.jpg",
    };
    planDetails.updateOne({ email: req.cookies.userEmail }, { $push: { plans: plan } }, (err, response) => {
        if (err) throw err;
        else {
            res.redirect("/safeadd");
        }
    });
});



app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
    //res.render("index");
});
app.get("/safeadd", (req, res) => {
    planDetails.find({ email: req.cookies.userEmail }, (err, response) => {
        if (err) throw err;
        else {
            var data = response[0];
            res.render("myplans", { data: data });
        }
    });
});



app.get("/notFound", (req, res) => {
    res.sendFile(path.join(__dirname, "notfound.html"));
});

app.get("/success", (req, res) => {
    res.sendFile(path.join(__dirname, "login.html"));
});


app.post("/login", (req, res) => {
    const loginDetails = {
        email: req.body.email,
        password: req.body.psw,
    };
    User.find({ email: loginDetails.email }, (err, response) => {
        if (err) throw err;
        else {
            if (Object.entries(response).length === 0) {
                res.redirect("/notFound");
            } else {
                bcrypt.compare(loginDetails.password, response[0].password, (error, resp) => {
                    if (error) throw error;
                    if (resp === true) {
                        //res.redirect("/successLogin");
                        res.cookie("userEmail", loginDetails.email);
                        //console.log(loginDetails.email+" has logged in.");
                        res.sendFile(path.join(__dirname, "success.html"));
                    } else {
                        //res.redirect("/wrongPass");
                        res.sendFile(path.join(__dirname, "wrongpass.html"));
                    }
                });
            }
        }
    });
});


app.get("/myplans", (req, res) => {
    planDetails.find({ email: req.cookies.userEmail }, (err, response) => {
        if (err) throw err;
        else {
            var data = response[0];
            res.render("myplans", { data: data });
        }
    });
});



app.get("/successLogin", (req, res) => {
    res.cookie("userEmail", loginDetails.email);
    //console.log(loginDetails.email+" has logged in.");
    res.sendFile(path.join(__dirname, "success.html"));
});
app.get("/wrongPass", (req, res) => {
    res.sendFile(path.join(__dirname, "wrongpass.html"));
});
app.get("/logout", (req, res) => {
    //console.log(req.cookies);
    res.clearCookie("userEmail");
    res.sendFile(path.join(__dirname, "login.html"));
});


app.use(express.static(path.join(__dirname, )));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
    console.log(`Server started on PORT ${PORT}`)
);