import {$} from 'execa';

export const cloneTemplate = async (url, name = "", path = ".") => {
    const cloned = await $`git clone ${url} ${name}`;
    const permissions = await $`chmod -R 777 ./${name} `;
}

export const addTemplateUpstream = async (url, path = ".") => {
    const branch = await $`git remote add upstream ${url}`;
}

export const isGitDirty = async (path = ".") => {
    const output = await $`git status --porcelain`;
    return !!output
}

export const syncTemplate = async(path = ".") => {
    return await $`git pull upstream main`;
}