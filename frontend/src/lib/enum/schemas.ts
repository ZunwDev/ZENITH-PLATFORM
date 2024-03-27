// Field creation functions
const numberField = (label, placeholder, suffix = null) => ({
  label,
  type: "number",
  suffix,
  placeholder,
});

const selectField = (label, attributeTypeId = null, data = null) => ({
  label,
  type: "select",
  attributeTypeId,
  data,
});

const textField = (label, placeholder = null, suffix = null) => ({
  label,
  type: "text",
  placeholder,
  suffix,
});

const checkboxField = (label) => ({
  label,
  type: "checkbox",
});

// Reusable section definitions
const storage = {
  section: "Storage",
  fields: {
    StorageType: selectField("Storage Type", 3),
    SSDCapacity: numberField("SSD Capacity", "512", "GB"),
    HDDCapacity: numberField("HDD Capacity", "1024", "GB"),
  },
};

const dimensionsAndWeight = {
  section: "Dimensions & Weight",
  fields: {
    Depth: numberField("Depth", "9.25", "inch"),
    Height: numberField("Height", "0.7", "inch"),
    Width: numberField("Width", "14.15", "inch"),
    Weight: numberField("Weight", "3.3", "lbs."),
  },
};

const operatingSystem = {
  section: "Operating System",
  fields: {
    OperatingSystem: selectField("Operating System", 2),
  },
};

const baseProcessorFields = {
  CPUType: selectField("Processor Type", 4),
  ProcessorCoreGen: textField("Processor Core Generation", "Raptor Lake (Gen 13)"),
  ProcessorModelNumber: textField("Processor Model Number", "Intel Core i5 13420H Raptor Lake"),
  ProcessorSpeed: numberField("Processor Speed", "2.2", "Ghz"),
  ProcessorSpeedUpTo: textField("Processor Speed Up To", "2 to 3", "Ghz"),
  ProcessorCores: numberField("Number of Processor Cores", "8"),
  CPUCacheSize: numberField("CPU Cache Size", "5", "MB"),
};

const baseMemoryFields = {
  InstalledRAM: numberField("Installed RAM", "16", "GB"),
  MemoryType: selectField("Memory Type", 13),
  MemorySpeed: numberField("Memory Speed", "3333", "MHz"),
};

const baseGraphicsFields = {
  GraphicCardType: selectField("Graphic Card Type", null, ["Gaming", "Integrated", "Dedicated"]),
  GraphicProcessor: selectField("Graphics Processor", 12),
};

const baseConnectivityPorts = {
  DVIPorts: numberField("DVI Ports", "0"),
  DPPorts: numberField("DP Ports", "1"),
  HDMIPorts: numberField("HDMI Ports", "2"),
  USBPorts: numberField("USB Ports", "2"),
};

// Form fields
export const FormFields = {
  laptop: {
    categoryId: 1,
    sections: [
      {
        section: "Key Information",
        fields: {
          RAM: textField("Installed RAM"),
          OperatingSystem: textField("Operating System"),
          ProcessorType: textField("Processor Type"),
          Resolution: textField("Resolution"),
          StorageType: textField("Storage Type"),
          SSDCapacity: textField("SSD Capacity"),
          HDDCapacity: textField("HDD Capacity"),
          BatteryLife: textField("Battery Life"),
          Weight: textField("Weight"),
        },
      },
      {
        section: "Display",
        fields: {
          DisplayRefreshRate: numberField("Refresh Rate", "60", "Hz"),
          AspectRatio: selectField("Aspect Ratio", null, ["16:9", "16:10", "3:2", "4:3", "21:9"]),
          Resolution: selectField("Resolution", 9),
          PanelType: selectField("Panel Type", 10),
          DisplayType: selectField("Display Type", 16),
          Luminosity: numberField("Luminosity", "200", "Nits"),
        },
      },
      dimensionsAndWeight,
      {
        section: "Battery",
        fields: {
          BatteryType: selectField("Battery Type", 5),
          BatteryLife: numberField("Battery Life", "8.5", "+h"),
          BatteryCapacity: numberField("Battery Capacity", "56", "Wh"),
          ChargingPower: numberField("Charging Power", "65", "W"),
          ChargingConnector: textField("Charging Connector", "USB-C"),
        },
      },
      {
        section: "Connectivity",
        fields: {
          NetworkCard: selectField("Network Card", 7),
          WirelessConnectivity: selectField("Wireless Connectivity", 8),
          ...baseConnectivityPorts,
          VideoOutputPorts: numberField("Video Output Ports", "1"),
        },
      },
      {
        section: "Processor",
        fields: {
          ...baseProcessorFields,
        },
      },
      storage,
      {
        section: "Memory",
        fields: {
          ...baseMemoryFields,
        },
      },
      {
        section: "Graphics",
        fields: {
          ...baseGraphicsFields,
          LaptopVideoGraphics: textField("Laptop Video Graphics", "Intel Iris Xe Graphics"),
        },
      },
      {
        section: "Features",
        fields: {
          "2-in-1": checkboxField("2-in-1"),
          BacklitKeyboard: checkboxField("Backlit Keyboard"),
          FingerPrintReader: checkboxField("Finger Print Reader"),
          TouchScreen: checkboxField("Touch Screen"),
          VoiceAssistant: checkboxField("Voice Assistant"),
          NumericKeyboard: checkboxField("Numeric Keyboard"),
          StylusSupport: checkboxField("Stylus Support"),
          WindowsHello: checkboxField("Windows Hello"),
          Bluetooth: checkboxField("Bluetooth"),
          Webcam: checkboxField("Webcam"),
        },
      },
      {
        section: "Construction",
        fields: {
          Detachable: checkboxField("Detachable"),
          Reflexive: checkboxField("Reflexive"),
          "Rigid (Classic)": checkboxField("Rigid (Classic)"),
          ConstructionMaterial: selectField("Construction Material", null, [
            "All-metal",
            "Metal + Plastic",
            "Metal + Carbon Fiber",
            "Metal + Glass",
            "Metal + Magnesium",
            "Plastic",
            "Plastic + Glass",
            "Plastic + Carbon Fiber",
            "Plastic + Magnesium",
            "Carbon Fiber",
          ]),
        },
      },
      {
        section: "Additional",
        fields: {
          Color: selectField("Color", 15),
          ComputerUse: selectField("Computer Use", null, ["Home & Office", "Business", "Gaming", "Multimedia"]),
          FamilyModel: textField("Family Model", "15IRU8"),
          SeriesOrCollection: textField("Series or Collection", "IdeaPad Slim 3"),
          LaptopStyle: selectField("Laptop Style", null, ["Chromebook", "Notebook", "Mobile Workstation"]),
          Refurbished: { label: "Laptop Refurbished?", type: "checkbox" },
          Warranty: textField("Warranty", "1 year limited warranty"),
          IncludedAccessories: textField("Included Accessories", "Power adapter, user manual"),
        },
      },
      operatingSystem,
      {
        section: "Certifications",
        fields: {
          EnergyStar: checkboxField("Energy Star"),
          EPEAT: checkboxField("EPEAT"),
          RoHS: checkboxField("RoHS"),
          FCC: checkboxField("FCC"),
          CE: checkboxField("CE"),
        },
      },
    ],
  },
  "desktop computer": {
    categoryId: 1,
    sections: [
      {
        section: "Key Information",
        fields: {
          RAM: textField("Installed RAM"),
          OperatingSystem: textField("Operating System"),
          ProcessorType: textField("Processor Type"),
          Resolution: textField("Resolution"),
          StorageType: textField("Storage Type"),
          SSDCapacity: textField("SSD Capacity"),
          HDDCapacity: textField("HDD Capacity"),
          Weight: textField("Weight"),
        },
      },
      dimensionsAndWeight,
      {
        section: "Connectivity",
        fields: {
          DesktopLANDataTransferRate: textField("Desktop LAN Data Transfer Rate", "10/100/1000", "Mbps"),
          NetworkCard: selectField("Network Card", 7),
          WirelessConnectivity: selectField("Wireless Connectivity", 8),
          PCISlots: numberField("PCI Slots", "2"),
          ...baseConnectivityPorts,
          VideoOutputPorts: numberField("Video Output Ports", "1"),
        },
      },
      {
        section: "Processor",
        fields: {
          ...baseProcessorFields,
          maxTDP: numberField("Max TDP", "125", "W"),
        },
      },
      storage,
      {
        section: "Memory",
        fields: {
          ...baseMemoryFields,
          NumberOfRAMSlots: numberField("Number of RAM Slots", "4", "pcs."),
          NumberOfInstalledSlots: numberField("Number of installed Slots", "2", "pcs."),
        },
      },
      {
        section: "Graphics",
        fields: {
          ...baseGraphicsFields,
          GraphicsCardMemory: numberField("Graphics Card Memory", "16", "GB"),
        },
      },
      {
        section: "PSU",
        fields: {
          PSU: numberField("PSU", "700", "W"),
        },
      },
      {
        section: "Features",
        fields: {
          AllInOne: checkboxField("All in One Desktop"),
          DesktopIncludesMonitor: checkboxField("Desktop Includes Monitor"),
          Bluetooth: checkboxField("Bluetooth"),
          WiFi: checkboxField("WiFi"),
        },
      },
      {
        section: "Outputs",
        fields: {
          USB2: numberField("USB 2.0", "4", "pcs."),
          USB3: numberField("USB 3.2 Gen 2", "2", "pcs."),
          Graphics: textField("Graphics", "HDMI 2.1, Display Port 1.4"),
          Other: textField("Other", "PS/2, RJ-45 (LAN) 2.5Gbps, Jack"),
          OpticalDrive: checkboxField("Optical Drive"),
        },
      },
      {
        section: "Construction",
        fields: {
          FormFactor: selectField("Form Factor", null, ["Small Form Factor", "Mini Tower", "Mid Tower", "Full Tower"]),
          FrontPanelLocation: selectField("Front Panel Location", null, ["Left", "Right", "Top"]),
          Sidewalls: selectField("Sidewalls", null, ["Opaque", "Fully Transparent", "Partially Transparent"]),
          SidePanelMaterial: selectField("Side Panel Material", null, ["Tempered Glass", "Acrylic", "Steel", "Aluminum"]),
        },
      },
      {
        section: "Additional",
        fields: {
          Color: selectField("Color", 15),
          ComputerUse: selectField("Computer Use", null, ["Home & Office", "Business", "Gaming", "Multimedia"]),
          FamilyModel: textField("Family Model", "15IRU8"),
          SeriesOrCollection: textField("Series or Collection", "IdeaPad Slim 3"),
          Refurbished: checkboxField("Desktop Refurbished?"),
          Warranty: textField("Warranty", "1 year limited warranty"),
          IncludedAccessories: textField("Included Accessories", "Keyboard, mouse, user manual"),
        },
      },
    ],
  },
};
