"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const config_1 = require("./config");
const deployer_1 = __importDefault(require("./deployer"));
const parseCsv_1 = require("./parseCsv");
dotenv_1.default.config();
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        const config = yield (0, config_1.getConfig)();
        const nftsString = fs_1.default.readFileSync('nfts.csv', { encoding: 'utf8' });
        const nfts = (0, parseCsv_1.parseCsv)(nftsString);
        const deployer = new deployer_1.default(config, nfts);
        deployer.start();
    });
})();
