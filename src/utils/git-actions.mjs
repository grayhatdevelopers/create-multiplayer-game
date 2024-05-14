import {$} from 'execa';

export const cloneTemplate = async (url, name = "", path = undefined) => {
    if (path) process.chdir(path)
    const cloned = await $`git clone ${url} ${name}`;
    await $`chmod -R 777 ./${name} `;
    return cloned
}

export const addTemplateUpstream = async (url, path = undefined) => {
    if (path) process.chdir(path)
    return await $`git remote add upstream ${url}`;
}

export const isGitDirty = async (path = undefined) => {
    if (path) process.chdir(path)
    const output = await $`git status --porcelain`;
    return !!output
}

export const syncTemplate = async(path = undefined) => {
    if (path) process.chdir(path)
    return await $`git pull upstream main`;
}