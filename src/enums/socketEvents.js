const ServerEvents = {
  disconnect: 'disconnect',
  authentication: 'authentication',
  locationUpdate: 'location-update',
  settingsUpdate: 'settings-update',
  visibilityUpdate: 'visibility-update',
  organizationUnits: 'organization-units',
  sync: 'sync'
};

const ClientEvents = {
  logout: 'logout',
  locationUpdate: 'location-update',
  settingsUpdate: 'settings-update',
  organizationUnits: 'organization-units',
  sync: 'sync'
};

export {
  ServerEvents,
  ClientEvents
};
