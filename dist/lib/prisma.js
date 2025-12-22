"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
require("dotenv/config");
var client_1 = require("@prisma/client");
var adapter_pg_1 = require("@prisma/adapter-pg");
var pg_1 = require("pg");
var globalForPrisma = global;
var prismaClientSingleton = function () {
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL environment variable is not set");
    }
    var pool = new pg_1.Pool({
        connectionString: process.env.DATABASE_URL,
    });
    return new client_1.PrismaClient({
        adapter: new adapter_pg_1.PrismaPg(pool),
        // log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
};
exports.prisma = (_a = globalForPrisma.prisma) !== null && _a !== void 0 ? _a : prismaClientSingleton();
if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = exports.prisma;
