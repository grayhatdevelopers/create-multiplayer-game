import fs from 'fs';

export const DEFAULT_CONFIG_NAME = "create-multiplayer-game.config.json";

export const loadCmgConfig = () => {

    const content = fs.readFileSync(DEFAULT_CONFIG_NAME, 'utf-8');

    return JSON.parse(content)
}

