'use strict';

const Homey = require('homey');
const Utils = require('../../utils');

module.exports = class DirigeraOutletDriver extends Homey.Driver {

  /**
   * onInit is called when the driver is initialized.
   */
  async onInit() {
    this.log('IKEA Dirigera Outlet Driver has been initialized');
  }

  updateCapabilities(device) {
    for (const device of this.getDevices()) {
      if (device.getData().id === device.instanceId) {
        device.updateCapabilities(device);
      }
    }
  }

  /**
   * onPairListDevices is called when a user is adding a device
   * and the 'list_devices' view is called.
   * This should return an array with the data of devices that are available for pairing.
   */
  async onPairListDevices() {
    if (!this.homey.app.isGatewayConnected()) {
      throw new Error('First go to Settings -> Apps -> IKEA DIRIGERA Gateway to configure.');
    }

    const devices = await this.homey.app.getDevices();
    const outlets = [];
    for (const device of devices) {
      if (device.type !== 'outlet') {
        continue;
      }

      const capabilities = [];
      if (device.capabilities.canReceive.includes('isOn')) {
        capabilities.push('onoff');
      }
      outlets.push({
        data: {
          id: device.id,
        },
        capabilities,
        name: (device['attributes'].customName !== '' ? device['attributes'].customName : device['attributes'].model),
      });
    }
    return outlets.sort(Utils._compareHomeyDevice);
  }

};