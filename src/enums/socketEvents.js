const ServerEvents = {
  disconnect: 'disconnect',
  authentication: 'authentication',
  locationUpdate: 'location-update',
  settingsUpdate: 'settings-update',
  visibilityUpdate: 'visibility-update'
};

const ClientEvents = {
  logout: 'logout',
  locationUpdate: 'location-update',
  settingsUpdate: 'settings-update',
};

export {
  ServerEvents,
  ClientEvents
};
