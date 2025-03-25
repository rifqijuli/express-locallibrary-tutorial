const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
    first_name: { type: String, required: true, maxLength: 100 },
    family_name: { type: String, required: true, maxLength: 100 },
    date_of_birth: { type: Date },
    date_of_death: { type: Date },
});

// Virtual for author's full name
AuthorSchema.virtual("name").get(function () {
    // To avoid errors in cases where an author does not have either a family name or first name
    // We want to make sure we handle the exception by returning an empty string for that case
    let fullname = "";
    if (this.first_name && this.family_name) {
        fullname = `${this.family_name}, ${this.first_name}`;
    }
    return fullname;
});

// Virtual for author's URL
AuthorSchema.virtual("url").get(function () {
    // We don't use an arrow function as we'll need the this object
    return `/catalog/author/${this._id}`;
});

AuthorSchema.virtual("date_of_birth_formatted").get(function () {
    let dob_return= "";
    if (this.date_of_birth) {
        dob_return = DateTime.fromJSDate(this.date_of_birth).toFormat("yyyy-MM-dd")
    }
    return dob_return;
});

AuthorSchema.virtual("date_of_death_formatted").get(function () {
    let dod_return = "";
    if (this.date_of_death) {
        dod_return = DateTime.fromJSDate(this.date_of_death).toFormat("yyyy-MM-dd")
    }
    return dod_return;
});

AuthorSchema.virtual("lifespan").get(function () {
    let dob_return= "";
    let dod_return = "";
    if (this.date_of_death) {
        dod_return = DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED)
    }
    if (this.date_of_birth) {
        dob_return = DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED)
    }
    return `${dob_return} - ${dod_return}`;
});

// Export model
module.exports = mongoose.models.Author || mongoose.model("Author", AuthorSchema);
