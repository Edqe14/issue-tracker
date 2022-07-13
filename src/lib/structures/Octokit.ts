import CLIENT_CONFIG from '@/config';
import { App } from 'octokit';

const app = new App({
  appId: CLIENT_CONFIG.github.clientId,
  privateKey: CLIENT_CONFIG.github.clientSecret
});

export default app;
