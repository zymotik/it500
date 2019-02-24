# Salus iT500 to MQTT

This node app is designed to get your temperature information from you Salus iT500 device and broadcast it on your MQTT network.

To get started:

* Clone this repo to your device.
* Run `npm install` to get all node module on your device
* Copy `settings.sample.json` to `settings.json` and setup with your configuration. To get your device id, login to your Salus iT500 console at https://salus-it500.com and select your device in the list. You'll notice your device id after `devId=` in the url.
* Run `npm run start` to login in to the console and broadcast the temperatures on your MQTT network.

I'm using this node app with Home Assitant. I've configured a sensor using something like the following:

```
sensor:
    - platform: mqtt
      name: 'Downstairs temperature'
      icon: mdi:temperature-celsius
      state_topic: 'tele/it500'
      unit_of_measurement: '°C'
      expire_after: 120
      value_template: '{{ value_json.Zone1Temperature }}'

    - platform: mqtt
      name: 'Upstairs temperature'
      icon: mdi:temperature-celsius
      state_topic: 'tele/it500'
      unit_of_measurement: '°C'
      expire_after: 120
      value_template: '{{ value_json.Zone2Temperature }}'
```

### Setting up as a service on a RaspberryPi

Install forever and forever-service on the RaspberryPi

`sudo npm install forever -g`

`sudo npm install forever-service -g`

Then run in the source directory (where this `readme.md` file is):

`sudo npm run service-install`

And to remove:

`sudo npm run service-remove`

To view service logs use the command:

`sudo npm run view-log`
