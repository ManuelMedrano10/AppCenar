import "./utils/LoadEnvConfiguration.js";
import express from "express";
import { engine } from "express-handlebars";
import { projectRoot } from "./utils/Paths.js";
import path from "path";
import { Equals } from "./utils/helpers/hbs/Compare.js";
import { GetSection } from "./utils/helpers/hbs/Section.js";
import Users from "./models/UserModel.js";
import multer from "multer";
import connectDB from "./utils/MongooseConnection.js";
import session from "express-session";
import flash from "connect-flash";
import Roles from "./utils/enums/Roles.js";
import authRoutes from "./routes/auth-router.js";
import adminRoutes from "./routes/admin/admin-router.js"
import commerceTypesRoutes from "./routes/admin/commerce-type-router.js";
import configurationRoutes from "./routes/admin/configuration-router.js";
import categoryRoutes from "./routes/commerce/category-router.js";
import adminCommercesRoutes from "./routes/admin/commerce-router.js";
import adminDeliveriesRoutes from "./routes/admin/delivery-router.js";
import adminClientRoutes from "./routes/admin/client-router.js";
import adminDashboardRoutes from "./routes/admin/dashboard-router.js";
import productRoutes from "./routes/commerce/product-router.js";
import commerceHomeRouter from "./routes/commerce/home-router.js";
import commerceProfileRouter from "./routes/commerce/profile-router.js";
import clientAddressRouter from "./routes/client/address-router.js";
import clientProfileRouter from "./routes/client/profile-router.js";
import clientHomeRouter from "./routes/client/home-router.js";
import clientOrderRouter from "./routes/client/order-router.js";
import clientMyOrdersRouter from "./routes/client/my-orders-router.js";
import clientFavoritesRotuer from "./routes/client/favorite-router.js";
import deliveryHomeRouter from "./routes/delivery/home-router.js";
import deliveryProfileRouter from "./routes/delivery/profile-router.js";
import MongoStore from "connect-mongo";

const app = express();

//render engine
app.engine('hbs', engine({
    layoutsDir: "views/layouts",
    defaultLayout: "main-layout",
    extname: "hbs",
    helpers: {
        eq: Equals,
        section: GetSection
    }
}));

app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.urlencoded());
app.use(express.static(path.join(projectRoot, "public")));

//Session setup
app.use(session({
    secret: process.env.SESSION_SECRET || "anything",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: "sessions",
        ttl: 1 * 24 * 60 * 60
    })
}));

app.use(flash());

app.use((req, res, next) => {
    if (!req.session) {
        return next();
    }

    if (!req.session.user) {
        return next();
    }

    if (!req.session.isAuthenticated) {
        return next();
    }

    req.user = req.session.user;
    next();
});

//local variables
app.use((req, res, next) => {
    const errors = req.flash("errors");
    const success = req.flash("success");
    res.locals.user = req.user;
    res.locals.hasUser = !!req.user;
    res.locals.isAuthenticated = req.session.isAuthenticated || false;
    res.locals.errors = errors;
    res.locals.hasErrors = errors.length > 0;
    res.locals.success = success;
    res.locals.hasSuccess = success.length > 0;
    next();
})

//routes
app.use(authRoutes);
app.use("/admins", adminRoutes);
app.use("/commerce-types", commerceTypesRoutes);
app.use("/configuration", configurationRoutes);
app.use("/categories", categoryRoutes);
app.use("/commerces", adminCommercesRoutes);
app.use("/deliveries", adminDeliveriesRoutes);
app.use("/clients", adminClientRoutes);
app.use("/dashboard", adminDashboardRoutes);
app.use("/products", productRoutes);
app.use("/commerce-home", commerceHomeRouter);
app.use("/commerce-profile", commerceProfileRouter);
app.use("/addresses", clientAddressRouter);
app.use("/favorites", clientFavoritesRotuer);
app.use("/client-profile", clientProfileRouter);
app.use("/client-home", clientHomeRouter);
app.use("/client-order", clientOrderRouter);
app.use("/client-my-orders", clientMyOrdersRouter);
app.use("/delivery-home", deliveryHomeRouter);
app.use("/delivery-profile", deliveryProfileRouter);

//404
app.use((req, res) => {
    let layoutToUse = "main-layout";

    if (req.session && req.session.isAuthenticated && req.session.user) {
        const userRole = req.session.user.role;

        if(userRole === Roles.CLIENT) {
            layoutToUse = "client-layout";
        } else if(userRole === Roles.DELIVERY) {
            layoutToUse = "delivery-layout";
        } else if(userRole === Roles.COMMERCE) {
            layoutToUse = "commerce-layout";
        } else if(userRole === Roles.ADMIN) {
            layoutToUse = "main-layout";
        }
    }
    return res.status(404).render("404", {
        "page-title": "Page Not Found",
        layout: layoutToUse,
        user: req.session?.user || null
    });
});

//start server
try {
    await connectDB();
    app.listen(process.env.PORT || 5000);
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
} catch (err) {
    console.error("Error setting up the application:", err);
}
