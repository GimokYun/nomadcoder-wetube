import bcrypt from "bcrypt";
import session from "express-session";
import fetch from "node-fetch";
import User from "../models/User";
import Video from "../models/Video";

export const getJoin = (req, res) => {
    return res.render("join", {pageTitle: "Join"});
};

export const postJoin = async (req, res) => {
    const { name, username, email, password, password2, location} = req.body;
    const pageTitle = "Join";
    const userExists = await User.exists({$or: [{username}, {email}]});
    if (userExists) {
        return res.status(400).render("join", {pageTitle, errorMessage: "This username/email is already taken."});
    }
    if (password !== password2) {
        return res.status(400).render("join", {pageTitle, errorMessage: "Password confirmation does not match."});
    }
    try {
        await User.create({
            name, 
            username, 
            email, 
            password, 
            location,
        });
    } catch(error) {
        return res.status(400).render("join", {pageTitle, errorMessage: error._message,});
    }
    req.flash("success", "Log in with your new account");
    return res.redirect("/login");
};

export const getLogin = (req, res) => {
    return res.render("login", {pageTitle: "Login"});
};

export const postLogin = async (req, res) => {
    const {username, password} = req.body;
    const pageTitle = "Login";
    const user = await User.findOne({username, githubLoginOnly: false});
    if (!user) {
        return res.status(400).render("login", {pageTitle, errorMessage: "An account with this username does not exist."});
    }
    const match = await bcrypt.compare(password, user.password);
    if(!match) {
        return res.status(400).render("login", {pageTitle, errorMessage: "Wrong password."});
    }
    req.session.loggedIn = true;
    req.session.user = user;
    req.flash("success", "Welcome back!");
    return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id : process.env.GH_CLIENT,
        allow_signup : false,
        scope : "read:user user:email",
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id : process.env.GH_CLIENT,
        client_secret : process.env.GH_SECRET,
        code : req.query.code,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await (
        await fetch(finalUrl, {
        method: "POST",
        headers: {
            Accept: "application/json",
        },
    })).json();
    if ("access_token" in tokenRequest) {
        const { access_token } = tokenRequest;
        const apiUrl = "https://api.github.com";
        const userData = await (
            await fetch(`${apiUrl}/user`, {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();
        const emailData = await (
            await fetch(`${apiUrl}/user/emails`, {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();
        const emailObj = emailData.find((email) => email.verified === true && email.primary === true);
        if (!emailObj) {
            return res.redirect("/login");
        }
        let user = await User.findOne({ email: emailObj.email });
        if (!user) {
            user = await User.create({
                name: (userData.name === null) ? userData.login : userData.name, 
                username: userData.login, 
                email: emailObj.email, 
                location: userData.location,
                githubLoginOnly: true,
                password:"",
            });
        } 
        req.session.loggedIn = true;
        req.session.user = user;
        req.flash("success", "Welcome back!");
        return res.redirect("/");
    } else {
        return res.redirect("/login");
    }
};

export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
};

export const getEdit = (req, res) => {
    return res.render("edit-profile", {pageTitle: "Edit Profile"});
}

export const postEdit = async (req, res) => {
    const {
        session: {
            user: { _id, avatarUrl }, 
        },
        body: {
            name, username, email, location
        },
        file,
    } = req;
    let existOption = [];
    if (req.session.user.username !== username) {
        existOption.push({username});
    } 
    if (req.session.user.email !== email) {
        existOption.push({email});
    }
    if (existOption.length > 0) {
        const existedUser = await User.findOne({$or: existOption});
        if (existedUser && existedUser._id.toString() !== _id) {
            return res.status(400).render("edit-profile", {pageTitle: "Edit Profile", errorMessage: "This username/email is already taken."});
        }
    }
    const updatedUser = await User.findByIdAndUpdate(_id, {
        avatarUrl: file ? file.path : avatarUrl,
        name, 
        username, 
        email, 
        location
    }, {new: true});
    req.session.user = updatedUser;
    req.flash("success", "Profile updated");
    return res.redirect("/users/edit");
};

export const getChangePassword = (req, res) => {
    if (req.session.user.githubLoginOnly) {
        req.flash("error", "Can't change password");
        return res.redirect("/");
    }
    return res.render("change-password", {pageTitle: "Change Password"});
};

export const postChangePassword = async (req, res) => {
    const {
        session: {
            user: { _id }, 
        },
        body: {
            oldPassword, newPassword, newPassword2
        },
    } = req;
    const user = await User.findById(_id);
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
        return res.status(400).render("change-password", {pageTitle: "Change Password", errorMessage: "Current password is incorrect."}); 
    }
    if (newPassword !== newPassword2) {
        return res.status(400).render("change-password", {pageTitle: "Change Password", errorMessage: "New password confirmation does not match."});
    }
    user.password = newPassword;
    await user.save();
    req.session.user.password = user.password;
    req.flash("success", "Log in with your new password");
    return res.redirect("/users/logout");
};

export const see = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).populate({
        path: "videos",
        populate: {
            path: "owner",
            model: "User",
        },
    });
    if (!user) {
        return res.status(404).render("404", {pageTitle: "Page Not Found"});
    }
    return res.render("profile", {pageTitle: user.name, user});
};

