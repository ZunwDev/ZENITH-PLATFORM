// Field creation functions
const numberField = (label: string, placeholder: string, suffix = null) => ({
  [label]: { label, type: "number", suffix, placeholder },
});

const textField = (label: string, placeholder = null, suffix = null) => ({
  [label]: { label, type: "text", placeholder, suffix },
});

const selectField = (label: string, attributeTypeId = null, data = null) => ({
  [label]: { label, type: "select", attributeTypeId, data },
});

const checkboxField = (label: string) => ({
  [label]: { label, type: "checkbox" },
});

const createSection = (sectionName: string, fields: Record<string, any>) => ({
  section: sectionName,
  fields: fields,
});

// Function to create text field group, only with labels = used only for key information
const textFieldGroup = (arrayOfLabels: string[]) => {
  const fields: Record<string, any> = {};
  arrayOfLabels.forEach((label) => {
    Object.assign(fields, textField(label, null, null));
  });
  return fields;
};

// Function to create checkbox field group
const checkboxFieldGroup = (arrayOfLabels: string[]) => {
  const fields: Record<string, any> = {};
  arrayOfLabels.forEach((label) => {
    Object.assign(fields, checkboxField(label));
  });
  return fields;
};

// Reusable section definitions
const storage = createSection("Storage", {
  ...selectField("Storage Type", 3),
  ...numberField("SSD Capacity", "512", "GB"),
  ...numberField("HDD Capacity", "1024", "GB"),
});

const dimensionsAndWeight = {
  ...createSection("Dimensions & Weight", {
    ...numberField("Depth", "9.25", "inch"),
    ...numberField("Height", "0.7", "inch"),
    ...numberField("Width", "14.15", "inch"),
    ...numberField("Weight", "3.3", "lbs."),
  }),
};

const operatingSystem = {
  ...createSection("Operating System", selectField("Operating System", 2)),
};

const battery = {
  ...createSection("Battery", {
    ...selectField("Battery Type", 5),
    ...numberField("Battery Life", "8.5", "+h"),
    ...numberField("Battery Capacity", "56", "Wh"),
    ...numberField("Charging Power", "65", "W"),
    ...textField("Charging Connector", "USB-C"),
  }),
};

const camera = {
  ...createSection("Camera", {
    ...selectField("Camera Lens Type", null, ["Macro", "Telephoto", "Wide Angle", "Ultra Wide"]),
    ...numberField("Front Camera", "10", "MP"),
    ...numberField("Number Of Cameras", "5"),
    ...numberField("Rear Camera", "50", "MP"),
    ...selectField("Video Capture Resolution", null, ["360p", "480p", "720p", "1080p", "4K", "UHD 8K"]),
  }),
};

const display = {
  ...createSection("Display", {
    ...numberField("Refresh Rate", "60", "Hz"),
    ...selectField("Aspect Ratio", null, ["16:9", "16:10", "3:2", "4:3", "21:9"]),
    ...selectField("Resolution", 9),
    ...selectField("Panel Type", 10),
    ...selectField("Display Type", 16),
    ...numberField("Display Size", "14", "inch"),
    ...numberField("Luminosity", "200", "Nits"),
  }),
};

const baseProcessorFields = {
  ...selectField("Processor Type", 4),
  ...textField("Processor Core Generation", "Raptor Lake (Gen 13)"),
  ...textField("Processor Model Number", "Intel Core i5 13420H Raptor Lake"),
  ...numberField("Processor Speed", "2.2", "Ghz"),
  ...textField("Processor Speed Up To", "2 to 3", "Ghz"),
  ...numberField("Number of Processor Cores", "8"),
  ...numberField("CPU Cache Size", "5", "MB"),
};

const baseMemoryFields = {
  ...numberField("Installed RAM", "16", "GB"),
  ...selectField("Memory Type", 13),
  ...numberField("Memory Speed", "3333", "MHz"),
};

const baseGraphicsFields = {
  ...selectField("Graphic Card Type", null, ["Gaming", "Integrated", "Dedicated"]),
  ...selectField("Graphics Processor", 12),
};

const baseConnectivityPorts = {
  ...numberField("DVI Ports", "0"),
  ...numberField("DP Ports", "1"),
  ...numberField("HDMI Ports", "2"),
  ...numberField("USB Ports", "2"),
};

// Form fields
export const FormFields = {
  laptop: {
    categoryId: 1,
    sections: [
      createSection(
        "Key Information",
        textFieldGroup([
          "Installed RAM",
          "Operating System",
          "Processor Type",
          "Resolution",
          "Storage Type",
          "SSD Capacity",
          "HDD Capacity",
          "Battery Life",
          "Weight",
        ])
      ),
      display,
      dimensionsAndWeight,
      battery,
      createSection("Connectivity", {
        ...selectField("Network Card", 7),
        ...selectField("Wireless Connectivity", 8),
        ...baseConnectivityPorts,
        ...numberField("Video Output Ports", "1"),
      }),
      createSection("Processor", {
        ...baseProcessorFields,
      }),
      storage,
      createSection("Memory", {
        ...baseMemoryFields,
      }),
      createSection("Graphics", {
        ...baseGraphicsFields,
        ...textField("Laptop Video Graphics", "Intel Iris Xe Graphics"),
      }),
      createSection("Features", {
        ...checkboxFieldGroup([
          "2-in-1",
          "Backlit Keyboard",
          "Finger Print Reader",
          "Touch Screen",
          "Voice Assistant",
          "Numeric Keyboard",
          "Stylus Support",
          "Windows Hello",
          "Bluetooth",
          "Webcam",
        ]),
      }),
      createSection("Construction", {
        ...checkboxFieldGroup(["Detachable", "Reflexive", "Rigid (Classic)"]),
        ...selectField("Construction Material", null, [
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
      }),
      createSection("Additional", {
        ...selectField("Color", 15),
        ...selectField("Computer Use", null, ["Home & Office", "Business", "Gaming", "Multimedia"]),
        ...textField("Family Model", "15IRU8"),
        ...textField("Series or Collection", "IdeaPad Slim 3"),
        ...selectField("Laptop Style", null, ["Chromebook", "Notebook", "Mobile Workstation"]),
        ...checkboxField("Laptop Refurbished?"),
        ...textField("Warranty", "1 year limited warranty"),
        ...textField("Included Accessories", "Power adapter, user manual"),
      }),
      operatingSystem,
      createSection("Certifications", {
        ...checkboxFieldGroup(["Energy Star", "EPEAT", "RoHS", "FCC", "CE"]),
      }),
    ],
  },
  "desktop computer": {
    categoryId: 1,
    sections: [
      createSection("Key Information", {
        ...textFieldGroup([
          "Installed RAM",
          "Operating System",
          "Processor Type",
          "Storage Type",
          "SSD Capacity",
          "HDD Capacity",
        ]),
      }),
      dimensionsAndWeight,
      createSection("Connectivity", {
        ...textField("Desktop LAN Data Transfer Rate", "10/100/1000", "Mbps"),
        ...selectField("Network Card", 7),
        ...selectField("Wireless Connectivity", 8),
        ...numberField("PCI Slots", "2"),
        ...baseConnectivityPorts,
        ...numberField("Video Output Ports", "1"),
      }),
      createSection("Processor", {
        ...baseProcessorFields,
        ...numberField("Max TDP", "125", "W"),
      }),
      storage,
      createSection("Memory", {
        ...baseMemoryFields,
        ...numberField("Number of RAM Slots", "4", "pcs."),
        ...numberField("Number of installed Slots", "2", "pcs."),
      }),
      createSection("Graphics", {
        ...baseGraphicsFields,
        ...numberField("Graphics Card Memory", "16", "GB"),
      }),
      createSection("PSU", {
        ...numberField("PSU", "700", "W"),
      }),
      createSection("Features", {
        ...checkboxFieldGroup(["All in One Desktop", "Desktop Includes Monitor", "Bluetooth", "WiFi"]),
      }),
      createSection("Outputs", {
        ...numberField("USB 2.0", "4", "pcs."),
        ...numberField("USB 3.2 Gen 2", "2", "pcs."),
        ...textField("Graphics", "HDMI 2.1, Display Port 1.4"),
        ...textField("Other", "PS/2, RJ-45 (LAN) 2.5Gbps, Jack"),
        ...checkboxField("Optical Drive"),
      }),
      createSection("Construction", {
        ...selectField("Form Factor", null, ["Small Form Factor", "Mini Tower", "Mid Tower", "Full Tower"]),
        ...selectField("Front Panel Location", null, ["Left", "Right", "Top"]),
        ...selectField("Sidewalls", null, ["Opaque", "Fully Transparent", "Partially Transparent"]),
        ...selectField("Side Panel Material", null, ["Tempered Glass", "Acrylic", "Steel", "Aluminum"]),
      }),
      createSection("Additional", {
        ...selectField("Color", 15),
        ...selectField("Computer Use", null, ["Home & Office", "Business", "Gaming", "Multimedia"]),
        ...textField("Family Model", "15IRU8"),
        ...textField("Series or Collection", "IdeaCentre 5"),
        ...checkboxField("Desktop Refurbished?"),
        ...textField("Warranty", "1 year limited warranty"),
        ...textField("Included Accessories", "Keyboard, mouse, user manual"),
      }),
    ],
  },
  "ipad & tablet": {
    categoryId: 1,
    sections: [
      createSection("Key Information", {
        ...textFieldGroup(["Battery Life", "Display Size", "Resolution", "Display Type", "Installed RAM", "Storage Capacity"]),
      }),
      battery,
      camera,
      display,
      createSection("Storage", {
        ...numberField("Installed RAM", "8", "GB"),
        ...numberField("Storage Capacity", "64", "GB"),
      }),
      dimensionsAndWeight,
      createSection("Features", {
        ...checkboxFieldGroup(["2-in-1", "Fingerprint Reader", "Bluetooth", "Quick Charge"]),
      }),
      createSection("Additional", {
        ...selectField("Color", 15),
        ...selectField("Tablet Use", null, ["Home & Office", "Business", "Gaming", "Multimedia"]),
        ...textField("Family Model", "15IRU8"),
        ...textField("Series or Collection", "iPad mini"),
        ...textField("Warranty", "1 year limited warranty"),
        ...textField("Included Accessories", "Power adapter, user manual"),
      }),
    ],
  },
};
