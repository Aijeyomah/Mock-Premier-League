import rootPath from 'app-root-path';
import development from './development';
import test from './test';
import production from './production';

const {
    MOCK_PREMIER_LEAGUE_PORT: PORT,
    MOCK_PREMIER_LEAGUE_NODE_ENV: NODE_ENV
} = process.env;

const currentEnv = {
    development,
    test,
    production
}[NODE_ENV || 'development'];

export default {
    ...process.env,
    ...currentEnv,
    rootPath,
    PORT,
    NODE_ENV
};