import SchemaBuilder from "@pothos/core";
import RelayPlugin from "@pothos/plugin-relay";

export const builder = new SchemaBuilder<{
  Scalars: {
    DateTime: {
      Input: Date;
      Output: Date;
    };
    Upload: {
      Input: File;
      Output: File;
    };
  };
}>({
  plugins: [RelayPlugin],
  relayOptions: {
    clientMutationId: "omit",
    cursorType: "String",
    idFieldName: "_id",
  },
});

builder.queryType();
// builder.mutationType();

builder.scalarType("DateTime", {
  serialize: (date) => date.toISOString(),
  parseValue: (value) => new Date(value as string),
});

builder.scalarType("Upload", {
  serialize: (file) => file,
  parseValue: (value) => value as File,
});
