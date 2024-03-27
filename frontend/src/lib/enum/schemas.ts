export const FormFields = {
  Laptop: {
    categoryId: 1,
    sections: [
      {
        section: "Key Information",
        fields: {
          RAM: { label: "Installed RAM" },
          OperatingSystem: { label: "Operating System" },
          ProcessorType: { label: "Processor Type" },
          Resolution: { label: "Resolution" },
          StorageType: { label: "Storage Type" },
          BatteryLife: { label: "Battery Life" },
          Weight: { label: "Weight" },
        },
      },
      {
        section: "Display",
        fields: {
          DisplayRefreshRate: { label: "Refresh Rate", type: "number", suffix: "Hz", placeholder: "60" },
          AspectRatio: { label: "Aspect Ratio", type: "select", data: ["16:9", "16:10", "3:2", "4:3", "21:9"] },
          Resolution: { label: "Resolution", type: "select", attributeTypeId: 9 },
          PanelType: { label: "Panel Type", type: "select", attributeTypeId: 10 },
          DisplayType: { label: "Display Type", type: "select", attributeTypeId: 16 },
          Luminosity: { label: "Luminosity", type: "number", suffix: "Nits", placeholder: "200" },
        },
      },
      {
        section: "Dimensions & Weight",
        fields: {
          Depth: { label: "Depth", type: "number", suffix: "inch", placeholder: "9.25" },
          Height: { label: "Height", type: "number", suffix: "inch", placeholder: "0.7" },
          Width: { label: "Width", type: "number", suffix: "inch", placeholder: "14.15" },
          Weight: { label: "Weight", type: "number", suffix: "lbs.", placeholder: "3.3" },
        },
      },
      {
        section: "Battery",
        fields: {
          BatteryType: { label: "Battery Type", type: "select", attributeTypeId: 5 },
          BatteryLife: { label: "Battery Life", type: "number", suffix: "+h", placeholder: "8.5" },
          BatteryCapacity: { label: "Battery Capacity", type: "number", placeholder: "56", suffix: "Wh" },
          ChargingPower: { label: "Charging Power", type: "number", placeholder: "65", suffix: "W" },
          ChargingConnector: { label: "Charging Connnector", type: "text", placeholder: "USB-C" },
        },
      },
      {
        section: "Connectivity",
        fields: {
          NetworkCard: { label: "Network Card", type: "select", attributeTypeId: 7 },
          DVIPorts: { label: "DVI Ports", type: "number", placeholder: "0" },
          DPPorts: { label: "DP Ports", type: "number", placeholder: "1" },
          HDMIPorts: { label: "HDMI Ports", type: "number", placeholder: "2" },
          USBPorts: { label: "USB Ports", type: "number", placeholder: "2" },
          VideoOutputPorts: { label: "Video Output Ports", type: "number", placeholder: "1" },
          WirelessConnectivity: { label: "Wireless Connectivity", type: "select", attributeTypeId: 8 },
        },
      },
      {
        section: "Processor",
        fields: {
          CPUType: { label: "Processor Type", type: "select", attributeTypeId: 4 },
          ProcessorCoreGen: { label: "Processor Core Generation", type: "text", placeholder: "Raptor Lake (Gen 13)" },
          ProcessorModelNumber: {
            label: "Processor Model Number",
            type: "text",
            placeholder: "Intel Core i5 13420H Raptor Lake",
          },
          ProcessorSpeed: { label: "Processor Speed", type: "number", suffix: "Ghz", placeholder: "2.2" },
          ProcessorSpeedUpTo: { label: "Processor Speed Up To", type: "text", suffix: "Ghz", placeholder: "2 to 3" },
          ProcessorCores: { label: "Number of Processor Cores", type: "number", placeholder: "8" },
          CPUCacheSize: { label: "CPU Cache Size", type: "number", suffix: "MB", placeholder: "5" },
        },
      },
      {
        section: "Storage",
        fields: {
          StorageType: { label: "Storage Type", type: "select", attributeTypeId: 3 },
          SSDCapacity: { label: "SSD Capacity", type: "number", suffix: "GB", placeholder: "512" },
          HDDCapacity: { label: "HDD Capacity", type: "number", suffix: "TB", placeholder: "1024" },
        },
      },
      {
        section: "Memory",
        fields: {
          InstalledRAM: { label: "Installed RAM", type: "number", suffix: "GB", placeholder: "16" },
          MemoryType: { label: "Memory Type", type: "select", attributeTypeId: 13 },
          MemorySpeed: { label: "Memory Speed", type: "number", placeholder: "3333", suffix: "MHz" },
        },
      },
      {
        section: "Graphics",
        fields: {
          GraphicCardType: { label: "Graphic Card Type", type: "select", data: ["Gaming", "Integrated", "Dedicated"] },
          GraphicProcessor: { label: "Graphics Processor", type: "select", attributeTypeId: 11 },
          LaptopVideoGraphics: { label: "Laptop Video Graphics", type: "text", placeholder: "Intel Iris Xe Graphics" },
        },
      },
      {
        section: "Features",
        fields: {
          "2-in-1": { label: "2-in-1", type: "checkbox" },
          BacklitKeyboard: { label: "Backlit Keyboard", type: "checkbox" },
          FingerPrintReader: { label: "Finger Print Reader", type: "checkbox" },
          TouchScreen: { label: "Touch Screen", type: "checkbox" },
          VoiceAssistant: { label: "Voice Assistant", type: "checkbox" },
          NumericKeyboard: { label: "Numeric Keyboard", type: "checkbox" },
          StylusSupport: { label: "Stylus Support", type: "checkbox" },
          WindowsHello: { label: "Windows Hello", type: "checkbox" },
          Bluetooth: { label: "Bluetooth", type: "checkbox" },
          Webcam: { label: "Webcam", type: "checkbox" },
        },
      },
      {
        section: "Construction",
        fields: {
          Detachable: { label: "Detachable", type: "checkbox" },
          Reflexive: { label: "Reflexive", type: "checkbox" },
          "Rigid (Classic)": { label: "Rigid (Classic)", type: "checkbox" },
          ConstructionMaterial: {
            label: "Construction Material",
            type: "select",
            data: [
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
            ],
          },
        },
      },
      {
        section: "Additional",
        fields: {
          Color: { label: "Color", type: "select", attributeTypeId: 15 },
          ComputerUse: { label: "Computer Use", type: "select", data: ["Home & Office", "Business", "Gaming", "Multimedia"] },
          FamilyModel: { label: "Family Model", type: "text", placeholder: "15IRU8" },
          SeriesOrCollection: { label: "Series or Collection", type: "text", placeholder: "IdeaPad Slim 3" },
          LaptopStyle: { label: "Laptop Style", type: "select", data: ["Chromebook", "Notebook", "Mobile Workstation"] },
          Refurbished: { label: "Laptop Refurbished?", type: "checkbox" },
          Warranty: { label: "Warranty", type: "text", placeholder: "1 year limited warranty" },
          IncludedAccessories: { label: "Included Accessories", type: "text", placeholder: "Power adapter, user manual" },
        },
      },
      {
        section: "Operating System",
        fields: {
          OperatingSystem: { label: "Operating System", type: "select", attributeTypeId: 2 },
        },
      },
      {
        section: "Certifications",
        fields: {
          EnergyStar: { label: "Energy Star", type: "checkbox" },
          EPEAT: { label: "EPEAT", type: "checkbox" },
          RoHS: { label: "RoHS", type: "checkbox" },
          FCC: { label: "FCC", type: "checkbox" },
          CE: { label: "CE", type: "checkbox" },
        },
      },
    ],
  },
};
