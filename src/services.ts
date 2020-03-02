import config from '../config';

export function getService(userEmail = '') {
  return OAuth2.createService("ServiceAccount" + userEmail)
    .setTokenUrl(config.serviceAccount.token_uri)
    .setPrivateKey(config.serviceAccount.private_key)
    .setIssuer(config.serviceAccount.client_email)
    .setSubject(userEmail)
    .setPropertyStore(PropertiesService.getScriptProperties())
    .setCache(CacheService.getScriptCache())
    .setLock(LockService.getScriptLock())
    .setParam('access_type', 'offline')
    .setScope(config.serviceAccount.scopes.join(' '));
}
