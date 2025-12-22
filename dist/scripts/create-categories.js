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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_1 = require("../lib/prisma");
var categories = [
    {
        name: "Venues",
        slug: "venues",
        description: "Beautiful spaces for your event",
        icon: "Building2",
        coverImage: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop",
        isFeatured: true,
    },
    {
        name: "Photographers",
        slug: "photographers",
        description: "Capture your precious moments",
        icon: "Camera",
        coverImage: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=600&fit=crop",
        isFeatured: true,
    },
    {
        name: "Caterers",
        slug: "caterers",
        description: "Delicious food for every palate",
        icon: "Utensils",
        coverImage: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=600&fit=crop",
        isFeatured: true,
    },
    {
        name: "Music & DJs",
        slug: "music-djs",
        description: "Set the perfect mood",
        icon: "Music",
        coverImage: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop",
        isFeatured: true,
    },
    {
        name: "Florists",
        slug: "florists",
        description: "Fresh blooms for your celebration",
        icon: "Flower2",
        coverImage: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop",
        isFeatured: true,
    },
    {
        name: "Event Planners",
        slug: "event-planners",
        description: "Expert coordination & planning",
        icon: "Users",
        coverImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
        isFeatured: true,
    },
    {
        name: "Bakers",
        slug: "bakers",
        description: "Custom cakes & desserts",
        icon: "Cake",
        coverImage: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&h=600&fit=crop",
        isFeatured: true,
    },
    {
        name: "Decorators",
        slug: "decorators",
        description: "Transform your venue",
        icon: "Sparkles",
        coverImage: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&h=600&fit=crop",
        isFeatured: true,
    },
    // Add a canonical 'Makeup' category to match onboarding and vendor data
    {
        name: "Makeup",
        slug: "makeup",
        description: "Professional makeup services",
        icon: "Palette",
        coverImage: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&h=600&fit=crop",
        isFeatured: true,
    },
];
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, categories_1, cat;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _i = 0, categories_1 = categories;
                    _a.label = 1;
                case 1:
                    if (!(_i < categories_1.length)) return [3 /*break*/, 4];
                    cat = categories_1[_i];
                    return [4 /*yield*/, prisma_1.prisma.category.upsert({
                            where: { slug: cat.slug },
                            update: cat,
                            create: cat,
                        })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    console.log("Categories created or updated!");
                    return [4 /*yield*/, prisma_1.prisma.$disconnect()];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(function (e) {
    console.error(e);
    process.exit(1);
});
