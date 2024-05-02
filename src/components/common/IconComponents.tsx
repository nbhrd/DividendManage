import React from "react";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import AlarmIcon from "@mui/icons-material/Alarm";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import TrainIcon from "@mui/icons-material/Train";
import WorkIcon from "@mui/icons-material/Work";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import SavingsIcon from "@mui/icons-material/Savings";
import { ExpenseCategory, IncomeCategory } from "../../types";

// 削除確認
const IconComponents: Record<IncomeCategory | ExpenseCategory, JSX.Element> = {
  食費: <FastfoodIcon fontSize="small" />,
  日用品: <AlarmIcon fontSize="small" />,
  住居費: <Diversity3Icon fontSize="small" />,
  交際費: <SportsTennisIcon fontSize="small" />,
  娯楽: <TrainIcon fontSize="small" />,
  交通費: <WorkIcon fontSize="small" />,
  給与: <WorkIcon fontSize="small" />,
  副収入: <AddBusinessIcon fontSize="small" />,
  お小遣い: <SavingsIcon fontSize="small" />,
};

export default IconComponents;
