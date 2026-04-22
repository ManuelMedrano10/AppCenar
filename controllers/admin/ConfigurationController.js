import Configurations from "../../models/ConfigurationModel.js";

export async function GetIndex(req, res) {
    try {
        const configurations = await Configurations.find().lean();

        res.render("admin/configuration/index", {
            configurationList: configurations,
            hasConfigurations: configurations.length > 0,
            "page-title": "Configurations"
        })
    } catch (err) {
        req.flash("errors", "Error fetching configurations.");
        console.error("Error fetching configurations:", err);
    }
}

export async function GetEdit(req, res) {
    try {
        const id = req.params.ConfigurationId;
        const configuration = await Configurations.findOne({ _id: id }).lean();

        if (!configuration) {
            return res.redirect("/configuration/index");
        }

        res.render("admin/configuration/save", {
            configuration,
            "page-title": `Edit Configuration`,
        });

    } catch (err) {
        req.flash("errors", "Error fetching configurations.");
        console.error("Error fetching configurations:", err);
    }
}

export async function PostEdit(req, res) {
    try {
        const { ITBIS, ConfigurationId } = req.body;
        const configuration = await Configurations.findOne({ _id: ConfigurationId }).lean();

        if (!configuration) {
            return res.redirect("/configuration/index");
        }

        await Configurations.findByIdAndUpdate(ConfigurationId, {
            ITBIS: ITBIS
        });

        req.flash("success", "Configurations updated successfully.");
        return res.redirect("/configuration/index");
    } catch (err) {
        console.error("Error updating configurations:", err);
        req.flash("errors", "Error updating configuration.");
    }
}