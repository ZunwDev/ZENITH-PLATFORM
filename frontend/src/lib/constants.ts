import { FormFields } from "./enum/schemas";
import { Templates } from "./enum/specsTemplates";

export const STORE_NAME = "ZENITH";

export const BASE_URL = "http://localhost:5173";
export const DEFAULT_LIMIT = "10";

export const LOGIN_INVALID_CREDENTIALS_MESSAGE = "Invalid email or password. Please check your credentials and try again.";
export const LOGIN_ERROR_MESSAGE = "An issue occurred. Please wait a moment and try again later.";
export const LOGIN_SERVER_ERROR_MESSAGE = "Oops! It seems there's a problem on our end. Please try again later.";

export const ACCOUNT_CREATE_USER_EXISTS_MESSAGE = "User with this email already exists.";
export const ACCOUNT_CREATE_SERVER_ERROR_MESSAGE = "Oops! It seems there's a problem on our end. Please try again later.";

export const NO_IMAGE_PROVIDED_MESSAGE = "Please ensure that you include at least one image to represent the product.";
export const IS_PARSE_ERROR_MESSAGE = "There is a parse error in the product specifications. Please correct it.";
export const NO_SPECS_PROVIDED_MESSAGE = "No product specifications were provided. Please add them.";
export const NO_THUMBNAIL_IMAGE_PROVIDED_MESSAGE = "Please select one image to be a thumbnail.";

export const CATEGORY_TEMPLATE_MAPPING = {
  "computers & tablets": Templates.ComputersAndTablets,
  "audio & headphones": Templates.AudioAndHeadphones,
  "cameras & photography": Templates.CamerasAndPhotography,
  "wearable technology": Templates.WearableTechnology,
  "home electronics": Templates.HomeElectronics,
  "gaming & consoles": Templates.GamingAndConsoles,
  "cables & adapters": Templates.CablesAndAdapters,
  "power banks & chargers": Templates.PowerBanksAndChargers,
  "smartphones & accessories": Templates.SmartphonesAndAccessories,
};

export const TYPE_MAPPING = {
  laptops: FormFields.Laptops,
};
