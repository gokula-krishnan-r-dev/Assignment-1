"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const scenarios_1 = __importDefault(require("./router/scenarios"));
const vehicles_1 = __importDefault(require("./router/vehicles"));
const app = (0, express_1.default)();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const cors_1 = __importDefault(require("cors"));
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.use("/scenarios", scenarios_1.default);
app.use("/vehicles", vehicles_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=app.js.map