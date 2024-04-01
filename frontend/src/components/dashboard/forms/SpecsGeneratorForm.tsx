import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NoValidationCheckboxFormItem, NoValidationInputFormItem, NoValidationSelectFormItem } from "@/components/util";
import { fetchAttributeData } from "@/lib/api";
import { FileX2 } from "lucide-react";
import { useEffect, useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const SpecsGeneratorForm = ({ addFormSchemaData, setJsonData, typesSelectedValue }) => {
  const [formData, setFormData] = useState({});

  //Delete section from generated json
  const deleteFormData = (section, label) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData };
      if (updatedData[section.toUpperCase()]) {
        delete updatedData[section.toUpperCase()][label];
        if (Object.keys(updatedData[section.toUpperCase()]).length === 0) {
          delete updatedData[section.toUpperCase()];
        }
      }
      return updatedData;
    });
  };

  //Handle any value change, and add it to form data
  const handleChange = (section, value, field) => {
    let fieldValue = value?.target?.value?.trim();
    const { suffix, label } = field;
    const editedSuffix = suffix ? " " + suffix : "";

    if (fieldValue === "" || !value) {
      deleteFormData(section, label);
      deleteFormData("KEY INFORMATION", label);
      return;
    }

    let updatedValue;

    switch (suffix) {
      case "+h":
        updatedValue = `${fieldValue}+ hr(s)`;
        break;
      case "pcs":
        updatedValue = `${fieldValue} piece(s)`;
        break;
      default:
        updatedValue = `${fieldValue}${editedSuffix}`;
    }

    const updateFormData = (prevData, sectionKey) => ({
      ...prevData,
      [sectionKey]: {
        ...prevData[sectionKey],
        [label]:
          updatedValue !== "undefined" && !updatedValue.includes("undefined") && typeof updatedValue !== "boolean"
            ? updatedValue
            : value,
      },
    });

    setFormData((prevData) => {
      let updatedData = updateFormData(prevData, section.toUpperCase());
      const keyInformationFields = addFormSchemaData.sections[0].fields;
      const foundField = Object.values(keyInformationFields).find((f: any) => f.label === label);
      if (foundField) {
        updatedData = updateFormData(updatedData, "KEY INFORMATION");
      }
      return updatedData;
    });
  };

  //Update generated json
  useEffect(() => {
    const json = generateJson();
    setJsonData(JSON.stringify(json));
  }, [formData]);

  //Generating the json in order that the schema is made
  const generateJson = () => {
    const json: { [key: string]: any } = {};
    //* iterate over schema
    addFormSchemaData?.sections?.forEach((sectionObj) => {
      const section = sectionObj.section.toUpperCase();
      const sectionFields = sectionObj.fields;
      Object.entries(sectionFields).forEach(([fieldName, field]: [string, { label: string }]) => {
        const label = field.label;
        //* getting value
        const value = formData[section]?.[label];
        if (value !== undefined && value !== null) {
          if (!json[section]) json[section] = {};
          json[section][label] = value;
        }
      });
    });
    if (typesSelectedValue) {
      json["PRODUCT TYPE"] = typesSelectedValue;
    }
    return json;
  };

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      "PRODUCT TYPE": typesSelectedValue || "",
    }));
  }, [typesSelectedValue]);

  const getAttributeData = async (attributeTypeId) => {
    try {
      if (attributeTypeId) {
        const res = await fetchAttributeData(attributeTypeId);
        return res;
      }
    } catch (error) {
      console.error("Error fetching attribute data:", error);
    }
  };

  return (
    <>
      {addFormSchemaData?.sections?.length > 0 ? (
        <form>
          <ResponsiveMasonry columnsCountBreakPoints={{ 360: 1, 1450: 2, 1750: 3, 2050: 4, 2300: 5 }}>
            <Masonry gutter="1rem">
              {addFormSchemaData.sections.slice(1).map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{item.section}</CardTitle>
                    {item.description ? <CardDescription>{item.description}</CardDescription> : ""}
                  </CardHeader>
                  <CardContent>
                    {Object.entries(item).map(([_section, fields], index) => (
                      <div key={index} className="flex flex-col gap-2">
                        {Object.entries(fields).map(([fieldName, field], fieldIndex) => {
                          if (field.type === undefined || field.type === "section") return null;
                          switch (field.type) {
                            case "number":
                            case "text":
                              return (
                                <NoValidationInputFormItem
                                  key={fieldIndex}
                                  id={fieldName}
                                  defaultValue={formData?.[item.section]?.[fieldName] || ""}
                                  onChange={(event) => handleChange(item.section, event, field)}
                                  {...field}
                                />
                              );
                            case "checkbox":
                              return (
                                <NoValidationCheckboxFormItem
                                  key={fieldIndex}
                                  id={fieldName}
                                  checked={formData?.[item.section]?.[fieldName] || false}
                                  onChange={(event) => handleChange(item.section, event, field)}
                                  {...field}
                                />
                              );
                            case "select":
                              return (
                                <NoValidationSelectFormItem
                                  key={fieldIndex}
                                  id={fieldName}
                                  setSelectedValue={(value) => {
                                    setFormData((prevData) => ({
                                      ...prevData,
                                      [item.section.toUpperCase()]: {
                                        ...prevData[item.section.toUpperCase()],
                                        [field.label]: value,
                                      },
                                    }));
                                  }}
                                  section={item.section}
                                  field={field}
                                  asyncFetchData={getAttributeData(field.attributeTypeId)}
                                  handleSelect={handleChange}
                                  {...field}
                                />
                              );
                            default:
                              return null;
                          }
                        })}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </Masonry>
          </ResponsiveMasonry>
        </form>
      ) : (
        <div className="h-64 flex flex-col gap-4 mx-auto justify-center items-center">
          <FileX2 className="size-16 stroke-1" />
          <div className="flex flex-col justify-center items-center">
            <p className="text-accent-foreground">Oops... No form found</p>
            <p className="text-accent-foreground/50">Please select a category or the product type.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default SpecsGeneratorForm;
