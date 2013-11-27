/**
 * Model: Permission
 */
var Mongoose = require("mongoose");
var Schema = Mongoose.Schema;
var Types = Schema.Types;

var Permission = new Schema({
    platform : {
        type : String,
        required : true
    },
    service : {
        type : String,
        required : true
    },
    resource : [ String ],
    actions : [ String ],
    effect : {
        type : String,
        enum : [ "Allow", "Deny" ],
        'default' : "Deny"
    },
    owner : {
        type : Types.ObjectId,
        ref : "Tenant",
        required : true
    },
    applicant : {
            type : Types.ObjectId,
            ref : "Subject",
            required : true
    }
});

// Cannonical Name
Permission.virtual("name").get(function() {
    var applicant = this.applicant.name || this.applicant;
    var owner = this.owner.name || this.owner;
    
    var actions = "[" + this.actions.join(",") + "]";
    var resource = this.platform + "::" + this.service + "::" + owner + "::" + this.resource.join("/")
    
    return applicant + actions + "@" + resource + "::" + this.effect;
});

// Validators
Permission.path("actions").validate(function(actions) {
    return !!actions.length;
}, "Permission must specify at lease one action");

// Indices
Permission.index({
    platform : 1,
    service : 1,
    resource : 1
});
Permission.index({
    "applicant.tenant" : 1,
    "applicant.subject" : 1
});

Permission.set("autoIndex", false);
module.exports = Mongoose.model("Permission", Permission);