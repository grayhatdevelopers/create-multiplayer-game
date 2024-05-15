import packageJson from '../../../package.json' with { type: "json" };

export const getPackageInfo = () => {
    return packageJson
}