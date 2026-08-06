const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Job = sequelize.define(
  "Job",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fixedSalary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    salaryFrom: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    salaryTo: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    expired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    postedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
  },
  {
    tableName: "jobs",
    timestamps: true,
  }
);

module.exports = Job;
