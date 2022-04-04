"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCsv = void 0;
const tonweb_1 = __importDefault(require("tonweb"));
function parseCsv(content) {
    const rows = content.split('\n');
    if (rows.length < 1) {
        console.log('Not enough rows in nfts.csv');
        process.exit(1);
    }
    const nfts = [];
    for (const row of rows) {
        const fields = row.split(',');
        if (fields.length !== 1 && fields.length !== 2) {
            throw new Error(`[Parse] Unknown csv fields length ${fields.length}`);
        }
        // First item should be number, second if exists - address
        const nftId = parseInt(fields[0]);
        if (Number.isNaN(nftId) || nftId < 0) {
            throw new Error('[Parse] nftId < 0');
        }
        let owner;
        if (fields.length === 2 && fields[1] && fields[1].length > 1) {
            if (!tonweb_1.default.Address.isValid(fields[1])) {
                throw new Error(`[Parse] Owner address invalid ${fields[1]}`);
            }
            owner = fields[1];
        }
        nfts.push({
            id: nftId,
            owner_address: owner,
        });
    }
    return nfts;
}
exports.parseCsv = parseCsv;
