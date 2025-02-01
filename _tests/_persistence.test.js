import DatabaseManager from "../_persistence/Db.js";
import { Service } from "../_persistence/Service.js";
const db = new DatabaseManager(`mongodb+srv://alterobruteforce:TndNUNUTkFRk1Dhk@hellskitchen.g8bkh.mongodb.net/?retryWrites=true&w=majority&appName=hellskitchen`);
db.connect();
