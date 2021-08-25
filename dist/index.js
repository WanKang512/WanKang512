"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const app = express_1.default();
app.use(express_1.default.json());
dotenv_1.default.config({ path: path_1.default.join(__dirname, '..', '.env') });
app.post('/', (req, res) => {
    console.log(req.body);
    res.json({ status: 'success', code: '200', message: 'complete!' });
});
app.listen('3003', () => {
    console.log('233333');
});
const PORT = process.env.PORT || 3003;
app.listen(PORT);
//# sourceMappingURL=index.js.map