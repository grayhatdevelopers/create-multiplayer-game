import fs from "fs";

export const getPackageInfo = () => {
    return JSON.parse(fs.readFileSync("./package.json"))
}