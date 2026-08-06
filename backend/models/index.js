const { sequelize } = require("../config/database");
const User = require("./User");
const Job = require("./Job");
const Application = require("./Application");

// Associations
User.hasMany(Job, { foreignKey: "postedBy", as: "jobs" });
Job.belongsTo(User, { foreignKey: "postedBy", as: "employer" });

User.hasMany(Application, { foreignKey: "applicantId", as: "applications" });
Application.belongsTo(User, { foreignKey: "applicantId", as: "applicant" });

Job.hasMany(Application, { foreignKey: "jobId", as: "applications" });
Application.belongsTo(Job, { foreignKey: "jobId", as: "job" });

module.exports = { sequelize, User, Job, Application };
