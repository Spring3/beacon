const ServerEvents = {
  disconnect: 'disconnect',
  authentication: 'authentication',
  locationUpdate: 'location-update',
  settingsUpdate: 'settings-update',
  visibilityUpdate: 'visibility-update',
  sync: 'sync'
};

const ClientEvents = {
  logout: 'logout',
  locationUpdate: 'location-update',
  settingsUpdate: 'settings-update',
  sync: 'sync'
};

export {
  ServerEvents,
  ClientEvents
};
