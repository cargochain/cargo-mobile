import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://localhost:8080/graphql", // Replace with your GraphQL API endpoint
  documents: ["**/*.tsx", "**/*.ts", "!**/node_modules/**"], // Look for GraphQL operations in all TypeScript files except node_modules
  generates: {
    "./services/generated/graphql.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      config: {
        withHooks: true,
        withHOC: false,
        withComponent: false,
        // operationResultSuffix: "Result",
        documentMode: "documentNode",
        dedupeFragments: true,
        namingConvention: {
          typeNames: "change-case-all#pascalCase",
          enumValues: "change-case-all#upperCase",
          operationNames: "change-case-all#pascalCase",
          transformUnderscore: true,
        },
      },
    },
  },
};

export default config;
