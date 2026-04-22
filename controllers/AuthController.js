import Users from "../models/UserModel.js";
import { sendEmail } from "../services/EmailService.js";
import bcrypt from "bcrypt";
import { promisify } from "util";
import { randomBytes } from "crypto";
import Roles from "../utils/enums/Roles.js";
import path from "path";
import CommerceTypes from "../models/CommerceTypeModel.js";
import DeliveryStatus from "../utils/enums/DeliveryStatus.js";

export function GetLogin(req, res) {
    res.render("auth/login", {
        "page-title": "Login",
        layout: "anonymous-layout"
    });
}

export async function PostLogin(req, res) {
    const { Email, Password } = req.body;

    try {
        const user = await Users.findOne({ email: Email });

        if (!user) {
            req.flash("errors", "No user found with this email.");
            return res.redirect("/");
        }

        if (!user.isActive) {
            req.flash("errors", "Your account is nos active. Please check your email for activation instructions.");
            return res.redirect("/");
        }

        const isPasswordValid = await bcrypt.compare(Password, user.password);
        if (!isPasswordValid) {
            req.flash("errors", "Invalid password.");
            return res.redirect("/");
        }

        req.session.isAuthenticated = true;
        req.session.user = {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role
        }

        req.session.save((err) => {
            if (err) {
                console.error("Session save error:", err);
                req.flash("errors", "An error ocurred while logging in.");
                return res.redirect("/");
            }

            if (user.role === Roles.CLIENT) {
                return res.redirect("/client-home/home");
            } else if (user.role === Roles.DELIVERY) {
                return res.redirect("/delivery-home/home");
            } else if (user.role === Roles.COMMERCE) {
                return res.redirect("/commerce-home/home");
            } else {
                return res.redirect("/dashboard/index");
            }
        });
    } catch (err) {
        console.error(err);
        req.flash("errors", "An error occurred while logging in.");
        return res.redirect("/");
    }
}

export async function Logout(req, res) {
    const user = Users.findOne({ _id: req.session.user._id });

    req.session.destroy((err) => {
        if (err) {
            console.error("Session destroy error:", err);
            req.flash("errors", "An error occurred while logging out.");

            if (user.role === Roles.CLIENT) {
                return res.redirect("/client-home/home");
            } else if (user.role === Roles.DELIVERY) {
                return res.redirect("/delivery-home/home");
            } else if (user.role === Roles.COMMERCE) {
                return res.redirect("/commerce-home/home");
            } else {
                return res.redirect("/dashboard/index");
            }
        }
        res.redirect("/");
    });
}

export function GetRegisterClientDelivery(req, res) {
    return res.render("auth/register-client-delivery", {
        "page-title": "Register user",
        RolesList: Roles,
        layout: "anonymous-layout",
    });
}

export async function GetRegisterCommerce(req, res) {
    const commerceTypes = await CommerceTypes.find().lean();
    return res.render("auth/register-commerce", {
        "page-title": "Register commerce",
        commerceTypesList: commerceTypes,
        layout: "anonymous-layout",
    });
}

export async function PostRegisterClientDelivery(req, res) {
    try {
        const { Name, Lastname, Phone, Email, Username, Role, Password, ConfirmPassword } = req.body;
        const Photo = req.file;
        const PhotoPath = "\\" + path.relative("public", Photo.path);

        if (Password !== ConfirmPassword) {
            req.flash("errors", "Passwords do not match.");
            return res.redirect("/user/register-client-delivery");
        }

        const existingEmailClient = await Users.findOne({ email: Email, role: Roles.CLIENT });
        if (existingEmailClient) {
            req.flash("errors", "User already exists with this email.");
            return res.redirect("/user/register-client-delivery");
        }

        const existingEmailDelivery = await Users.findOne({ email: Email, role: Roles.DELIVERY });
        if (existingEmailDelivery) {
            req.flash("errors", "User already exists with this email.");
            return res.redirect("/user/register-client-delivery");
        }

        const existingUsername = await Users.findOne({ username: Username });
        if (existingUsername) {
            req.flash("errors", "User already exists with this username.");
            return res.redirect("/user/register-client-delivery");
        }

        const randomBytesAsync = promisify(randomBytes);
        const buffer = await randomBytesAsync(32);
        const token = buffer.toString("hex");

        const hashedPassword = await bcrypt.hash(Password, 10);

        if (Number(Role) === Roles.DELIVERY) {
            await Users.create({
                name: Name,
                lastname: Lastname,
                phone: Phone,
                email: Email,
                username: Username,
                photo: PhotoPath,
                role: Role,
                deliveryStatus: DeliveryStatus.AVAILABLE,
                password: hashedPassword,
                isActive: false,
                ActivationToken: token
            });
        } else {
            await Users.create({
                name: Name,
                lastname: Lastname,
                phone: Phone,
                email: Email,
                username: Username,
                photo: PhotoPath,
                role: Role,
                password: hashedPassword,
                isActive: false,
                ActivationToken: token
            });
        }

        req.flash("success", "User registered successfully.");

        await sendEmail({
            to: Email,
            subject: "Welcome to AppCenar",
            html: `<p>Dear ${Name} ${Lastname},</p>
                   <p>Thank you for registering. Please check the link below to activate your account:</p>
                   <p><a href="${process.env.APP_URL}/user/activate/${token}"</a> Activate Account</p>
                   <p>If you did not register, please ignore this email.</p>`
        });

        return res.redirect("/");
    } catch (err) {
        console.error(err);
        req.flash("errors", "An error occurred while registering the user.");
        return res.redirect("/user/register-client-delivery");
    }
}

export async function PostRegisterCommerce(req, res) {
    const { Name, Phone, Email, OpeningHour, ClosingHour, CommerceTypeId, Password, ConfirmPassword } = req.body;
    const Logo = req.file;
    const LogoPath = "\\" + path.relative("public", Logo.path);

    try {
        if (Password !== ConfirmPassword) {
            req.flash("errors", "Passwords do not match.");
            return res.redirect("/user/register-commerce");
        }

        const existingEmail = await Users.findOne({ email: Email, role: Roles.COMMERCE });
        if (existingEmail) {
            req.flash("errors", "User already exists with this email.");
            return res.redirect("/user/register-commerce");
        }

        const randomBytesAsync = promisify(randomBytes);
        const buffer = await randomBytesAsync(32);
        const token = buffer.toString("hex");

        const hashedPassword = await bcrypt.hash(Password, 10);

        await Users.create({
            name: Name,
            phone: Phone,
            email: Email,
            photo: LogoPath,
            role: Roles.COMMERCE,
            openingHour: OpeningHour,
            closingHour: ClosingHour,
            commerceTypeId: CommerceTypeId,
            password: hashedPassword,
            isActive: false,
            ActivationToken: token
        });

        req.flash("success", "User registered successfully.");

        await sendEmail({
            to: Email,
            subject: "Welcome to AppCenar",
            html: `<p>Dear ${Name}},</p>
                   <p>Thank you for registering your commerce. Please check the link below to activate your account:</p>
                   <p><a href="${process.env.APP_URL}/user/activate/${token}</a>Activate Account</p>
                   <p>If you did not register, please ignore this email.</p>`
        });
        return res.redirect("/");
    } catch (err) {
        console.error(err);
        req.flash("errors", "An error occurred while registering the user.");
        return res.redirect("/");
    }
}

export async function GetActivate(req, res) {
    const { token } = req.params;

    if (!token) {
        req.flash("errors", "Invalid activation token.");
        return res.redirect("/");
    }

    try {
        const user = await Users.findOne({ ActivationToken: token });

        if (!user) {
            req.flash("errors", "Invalid activation token.");
            return res.redirect("/");
        }

        user.isActive = true;
        user.ActivationToken = null;
        await user.save();

        req.flash("success", "Account activated successfully. You can now log in.");
        return res.redirect("/");
    } catch (err) {
        console.error(err);
        req.flash("errors", "An error ocurred while activating your account.");
        return res.redirect("/");
    }
}

export function GetForgot(req, res) {
    res.render("auth/forgot", {
        "page-title": "Forgot password",
        layout: "anonymous-layout"
    });
}

export async function PostForgot(req, res) {
    const { Email } = req.body;

    try {
        const randomBytesAsync = promisify(randomBytes);
        const buffer = await randomBytesAsync(32);
        const token = buffer.toString("hex");

        const user = await Users.findOne({ email: Email });

        if (!user) {
            req.flash("errors", "No user found with this email.");
            return res.redirect("/user/forgot");
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        const result = await user.save();

        if (!result) {
            req.flash("errors", "An error occurred while saving the reset token.");
            return res.redirect("/user/forgot");
        }

        await sendEmail({
            to: Email,
            subject: "Password Reset Request",
            html: `<p>Dear ${user.name},</p>
                   <p>Your requested a password reset. Please check the link below to reset your password:</p>
                   <p><a href="${process.env.APP_URL}/user/reset/${token}">Reset Account</a></p>
                   <p>If you did not register, please ignore this email.</p>`
        });

        req.flash("success", "Password reset link sent to your email.");
        return res.redirect("/");
    } catch (err) {
        console.error(err);
        req.flash("errors", "An error ocurred while processing your request.");
        return res.redirect("/user/forgot");
    }
}

export async function GetReset(req, res) {
    const { token } = req.params;

    if (!token) {
        req.flash("errors", "Invalid or expired token.");
        return res.redirect("/user/forgot");
    }

    try {
        const user = await Users.findOne({
            resetToken: token,
            resetTokenExpiration: { $gte: Date.now() }
        });

        if (!user) {
            req.flash("errors", "Invalid or expired token.");
            return res.redirect("/user/forgot");
        }

        res.render("auth/reset", {
            "page-title": "Reset Password",
            layout: "anonymous-layout",
            passwordToken: token,
            userId: user._id.toString()
        });
    } catch (err) {
        console.error(err);
        req.flash("errors", "An error ocurred while processing your request.");
        return res.redirect("/user/forgot");
    }
}

export async function PostReset(req, res) {
    const { PasswordToken, UserId, Password, ConfirmPassword } = req.body;

    if (Password !== ConfirmPassword) {
        req.flash("errors", "Passwords do not match.");
        return res.redirect(`/user/reset/${PasswordToken}`);
    }

    try {
        const user = await Users.findOne({
            _id: UserId,
            resetToken: PasswordToken,
            resetTokenExpiration: { $gte: Date.now() }
        });

        if (!user) {
            req.flash("errors", "Invalid or expired token.");
            return res.redirect("/user/forgot");
        }

        const hashedPassword = await bcrypt.hash(Password, 10);
        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpiration = null;

        await user.save();

        req.flash("success", "Password reset successfully. You can now log in.");
        return res.redirect("/");
    } catch (err) {
        console.error(err);
        req.flash("errors", "An error ocurred while processing your request.");
        return res.redirect("/user/forgot");
    }
}