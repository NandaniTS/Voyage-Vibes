// eslint-disable @typescript-eslint/no-explicit-any

import { Document } from "mongoose";
import { SoftDeleteModel } from "mongoose-delete";

export class BaseService<T extends Omit<Document, "delete">> {
  model: SoftDeleteModel<T>; // Use TSoftDeleteMongooseModel<T>

  constructor(model: SoftDeleteModel<T>) {
    this.model = model;
  }

  protected filterRecordAccessibleFields(
    data: Partial<T>,
    accessibleFields: string[],
  ) {
    if (accessibleFields.includes("*")) return data;

    const result: Partial<T> = {};

    for (const field of accessibleFields) {
      if (field.includes(".")) {
        const [parentField, ...rest] = field.split(".");
        // eslint-disable-next-line
        const nestedField = rest.join(".");

        const parentData = data[parentField as keyof T];

        if (Array.isArray(parentData)) {
          // eslint-disable-next-line
          (result as any)[parentField] = parentData.map((item: any) =>
            this.filterRecordAccessibleFields(
              item,
              accessibleFields
                .filter((f) => f.startsWith(parentField + "."))
                .map((f) => f.replace(parentField + ".", "")),
            ),
          );
        } else if (
          parentField in data &&
          typeof parentData === "object" &&
          parentData !== null
        ) {
          // eslint-disable-next-line
          (result as any)[parentField] = this.filterRecordAccessibleFields(
            parentData,
            accessibleFields
              .filter((f) => f.startsWith(parentField + "."))
              .map((f) => f.replace(parentField + ".", "")),
          );
        }
      } else if (field.endsWith(".*")) {
        const objectField = field.replace(".*", "");
        const objectData = data[objectField as keyof T];

        if (typeof objectData === "object" && objectData !== null) {
          // eslint-disable-next-line
          (result as any)[objectField] = objectData;
        }
      } else if (field in data) {
        result[field as keyof T] = data[field as keyof T];
      }
    }
    return result;
  }

  protected filterRecordsAccessibleFields(
    data: Partial<T>[],
    accessibleFields: string[],
  ) {
    return data.map((record) => {
      return this.filterRecordAccessibleFields(record, accessibleFields);
    });
  }
}
