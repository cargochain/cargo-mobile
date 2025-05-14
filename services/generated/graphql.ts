import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Upload: { input: any; output: any; }
};

export type AssignDriverInput = {
  driverId: Scalars['ID']['input'];
  shipmentId: Scalars['ID']['input'];
};

export type Company = {
  __typename?: 'Company';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  nif: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type CreateCompanyInput = {
  name: Scalars['String']['input'];
  nif: Scalars['String']['input'];
};

export type CreateShipmentInput = {
  companyId: Scalars['ID']['input'];
  files: Array<Scalars['Upload']['input']>;
};

export type CurrentUser = {
  __typename?: 'CurrentUser';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  nif: Scalars['String']['output'];
  phoneNumber: Scalars['String']['output'];
};

export type Driver = {
  __typename?: 'Driver';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  nif: Scalars['String']['output'];
};

export type File = {
  __typename?: 'File';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  mimeType: Scalars['String']['output'];
  name: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  assignDriver: Shipment;
  completeDelivery: Shipment;
  createCompany: Company;
  createShipment: Shipment;
  refreshToken: RefreshTokenResponse;
  signIn: UserSignInResponse;
  signUp: UserSignUpResponse;
  startDelivery: Shipment;
  uploadShipmentBase64Files: Shipment;
  uploadShipmentFiles: Shipment;
};


export type MutationAssignDriverArgs = {
  input: AssignDriverInput;
};


export type MutationCompleteDeliveryArgs = {
  shipmentId: Scalars['ID']['input'];
};


export type MutationCreateCompanyArgs = {
  input: CreateCompanyInput;
};


export type MutationCreateShipmentArgs = {
  input: CreateShipmentInput;
};


export type MutationRefreshTokenArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationSignInArgs = {
  input: UserSignInInput;
};


export type MutationSignUpArgs = {
  input: UserSignUpInput;
};


export type MutationStartDeliveryArgs = {
  shipmentId: Scalars['ID']['input'];
};


export type MutationUploadShipmentBase64FilesArgs = {
  input: UploadShipmentBase64FilesInput;
};


export type MutationUploadShipmentFilesArgs = {
  input: UploadShipmentFilesInput;
};

export type Query = {
  __typename?: 'Query';
  companies: Array<Company>;
  currentUser?: Maybe<CurrentUser>;
  driverShipment: Shipment;
  driverShipments: Array<Shipment>;
  searchUsersByNIF: Array<Driver>;
  shipment: Shipment;
  shipments: Array<Shipment>;
};


export type QueryDriverShipmentArgs = {
  shipmentId: Scalars['ID']['input'];
};


export type QuerySearchUsersByNifArgs = {
  input: SearchUsersByNifInput;
};


export type QueryShipmentArgs = {
  trackingCode: Scalars['String']['input'];
};

export type RefreshTokenResponse = {
  __typename?: 'RefreshTokenResponse';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

export type SearchUsersByNifInput = {
  searchTerm: Scalars['String']['input'];
};

export type Shipment = {
  __typename?: 'Shipment';
  company: Company;
  createdAt: Scalars['String']['output'];
  driver?: Maybe<Driver>;
  files: Array<File>;
  id: Scalars['ID']['output'];
  notifications: Array<ShipmentNotification>;
  status: Scalars['String']['output'];
  trackingCode: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  user: User;
};

export type ShipmentNotification = {
  __typename?: 'ShipmentNotification';
  createdAt: Scalars['String']['output'];
  createdBy: User;
  id: Scalars['ID']['output'];
  type: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type UploadShipmentBase64FilesInput = {
  files: Array<UserBase64FileInput>;
  shipmentId: Scalars['ID']['input'];
};

export type UploadShipmentFilesInput = {
  files: Array<Scalars['Upload']['input']>;
  shipmentId: Scalars['ID']['input'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  nif: Scalars['String']['output'];
};

export type UserBase64FileInput = {
  base64: Scalars['String']['input'];
  mimeType: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type UserSignInInput = {
  nif: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type UserSignInResponse = {
  __typename?: 'UserSignInResponse';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

export type UserSignUpInput = {
  email: Scalars['String']['input'];
  isAdmin: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  nif: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
};

export type UserSignUpResponse = {
  __typename?: 'UserSignUpResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type GetDriverShipmentsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDriverShipmentsQuery = { __typename?: 'Query', driverShipments: Array<{ __typename?: 'Shipment', id: string, trackingCode: string, status: string, createdAt: string, updatedAt: string, company: { __typename?: 'Company', name: string }, user: { __typename?: 'User', name: string } }> };

export type GetDriverShipmentQueryVariables = Exact<{
  shipmentId: Scalars['ID']['input'];
}>;


export type GetDriverShipmentQuery = { __typename?: 'Query', driverShipment: { __typename?: 'Shipment', id: string, trackingCode: string, status: string, company: { __typename?: 'Company', id: string, name: string, nif: string }, user: { __typename?: 'User', id: string, name: string, nif: string }, files: Array<{ __typename?: 'File', id: string, url: string }> } };

export type StartDeliveryMutationVariables = Exact<{
  shipmentId: Scalars['ID']['input'];
}>;


export type StartDeliveryMutation = { __typename?: 'Mutation', startDelivery: { __typename?: 'Shipment', id: string } };

export type UploadShipmentBase64FilesMutationVariables = Exact<{
  input: UploadShipmentBase64FilesInput;
}>;


export type UploadShipmentBase64FilesMutation = { __typename?: 'Mutation', uploadShipmentBase64Files: { __typename?: 'Shipment', id: string } };

export type RefreshTokenMutationVariables = Exact<{
  refreshToken: Scalars['String']['input'];
}>;


export type RefreshTokenMutation = { __typename?: 'Mutation', refreshToken: { __typename?: 'RefreshTokenResponse', accessToken: string, refreshToken: string } };

export type SignInMutationVariables = Exact<{
  input: UserSignInInput;
}>;


export type SignInMutation = { __typename?: 'Mutation', signIn: { __typename?: 'UserSignInResponse', accessToken: string, refreshToken: string } };

export type SignUpMutationVariables = Exact<{
  input: UserSignUpInput;
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp: { __typename?: 'UserSignUpResponse', success: boolean, message: string } };

export type GetUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserQuery = { __typename?: 'Query', currentUser?: { __typename?: 'CurrentUser', id: string, nif: string, email: string, name: string, phoneNumber: string } | null };


export const GetDriverShipmentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDriverShipments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"driverShipments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"trackingCode"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"company"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useGetDriverShipmentsQuery__
 *
 * To run a query within a React component, call `useGetDriverShipmentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDriverShipmentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDriverShipmentsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetDriverShipmentsQuery(baseOptions?: Apollo.QueryHookOptions<GetDriverShipmentsQuery, GetDriverShipmentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDriverShipmentsQuery, GetDriverShipmentsQueryVariables>(GetDriverShipmentsDocument, options);
      }
export function useGetDriverShipmentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDriverShipmentsQuery, GetDriverShipmentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDriverShipmentsQuery, GetDriverShipmentsQueryVariables>(GetDriverShipmentsDocument, options);
        }
export function useGetDriverShipmentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDriverShipmentsQuery, GetDriverShipmentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetDriverShipmentsQuery, GetDriverShipmentsQueryVariables>(GetDriverShipmentsDocument, options);
        }
export type GetDriverShipmentsQueryHookResult = ReturnType<typeof useGetDriverShipmentsQuery>;
export type GetDriverShipmentsLazyQueryHookResult = ReturnType<typeof useGetDriverShipmentsLazyQuery>;
export type GetDriverShipmentsSuspenseQueryHookResult = ReturnType<typeof useGetDriverShipmentsSuspenseQuery>;
export type GetDriverShipmentsQueryResult = Apollo.QueryResult<GetDriverShipmentsQuery, GetDriverShipmentsQueryVariables>;
export const GetDriverShipmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDriverShipment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"shipmentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"driverShipment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"shipmentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"shipmentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"trackingCode"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"company"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nif"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"nif"}}]}},{"kind":"Field","name":{"kind":"Name","value":"files"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useGetDriverShipmentQuery__
 *
 * To run a query within a React component, call `useGetDriverShipmentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDriverShipmentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDriverShipmentQuery({
 *   variables: {
 *      shipmentId: // value for 'shipmentId'
 *   },
 * });
 */
export function useGetDriverShipmentQuery(baseOptions: Apollo.QueryHookOptions<GetDriverShipmentQuery, GetDriverShipmentQueryVariables> & ({ variables: GetDriverShipmentQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDriverShipmentQuery, GetDriverShipmentQueryVariables>(GetDriverShipmentDocument, options);
      }
export function useGetDriverShipmentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDriverShipmentQuery, GetDriverShipmentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDriverShipmentQuery, GetDriverShipmentQueryVariables>(GetDriverShipmentDocument, options);
        }
export function useGetDriverShipmentSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDriverShipmentQuery, GetDriverShipmentQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetDriverShipmentQuery, GetDriverShipmentQueryVariables>(GetDriverShipmentDocument, options);
        }
export type GetDriverShipmentQueryHookResult = ReturnType<typeof useGetDriverShipmentQuery>;
export type GetDriverShipmentLazyQueryHookResult = ReturnType<typeof useGetDriverShipmentLazyQuery>;
export type GetDriverShipmentSuspenseQueryHookResult = ReturnType<typeof useGetDriverShipmentSuspenseQuery>;
export type GetDriverShipmentQueryResult = Apollo.QueryResult<GetDriverShipmentQuery, GetDriverShipmentQueryVariables>;
export const StartDeliveryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartDelivery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"shipmentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startDelivery"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"shipmentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"shipmentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode;
export type StartDeliveryMutationFn = Apollo.MutationFunction<StartDeliveryMutation, StartDeliveryMutationVariables>;

/**
 * __useStartDeliveryMutation__
 *
 * To run a mutation, you first call `useStartDeliveryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStartDeliveryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [startDeliveryMutation, { data, loading, error }] = useStartDeliveryMutation({
 *   variables: {
 *      shipmentId: // value for 'shipmentId'
 *   },
 * });
 */
export function useStartDeliveryMutation(baseOptions?: Apollo.MutationHookOptions<StartDeliveryMutation, StartDeliveryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<StartDeliveryMutation, StartDeliveryMutationVariables>(StartDeliveryDocument, options);
      }
export type StartDeliveryMutationHookResult = ReturnType<typeof useStartDeliveryMutation>;
export type StartDeliveryMutationResult = Apollo.MutationResult<StartDeliveryMutation>;
export type StartDeliveryMutationOptions = Apollo.BaseMutationOptions<StartDeliveryMutation, StartDeliveryMutationVariables>;
export const UploadShipmentBase64FilesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UploadShipmentBase64Files"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UploadShipmentBase64FilesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uploadShipmentBase64Files"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode;
export type UploadShipmentBase64FilesMutationFn = Apollo.MutationFunction<UploadShipmentBase64FilesMutation, UploadShipmentBase64FilesMutationVariables>;

/**
 * __useUploadShipmentBase64FilesMutation__
 *
 * To run a mutation, you first call `useUploadShipmentBase64FilesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadShipmentBase64FilesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadShipmentBase64FilesMutation, { data, loading, error }] = useUploadShipmentBase64FilesMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUploadShipmentBase64FilesMutation(baseOptions?: Apollo.MutationHookOptions<UploadShipmentBase64FilesMutation, UploadShipmentBase64FilesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadShipmentBase64FilesMutation, UploadShipmentBase64FilesMutationVariables>(UploadShipmentBase64FilesDocument, options);
      }
export type UploadShipmentBase64FilesMutationHookResult = ReturnType<typeof useUploadShipmentBase64FilesMutation>;
export type UploadShipmentBase64FilesMutationResult = Apollo.MutationResult<UploadShipmentBase64FilesMutation>;
export type UploadShipmentBase64FilesMutationOptions = Apollo.BaseMutationOptions<UploadShipmentBase64FilesMutation, UploadShipmentBase64FilesMutationVariables>;
export const RefreshTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefreshToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"refreshToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode;
export type RefreshTokenMutationFn = Apollo.MutationFunction<RefreshTokenMutation, RefreshTokenMutationVariables>;

/**
 * __useRefreshTokenMutation__
 *
 * To run a mutation, you first call `useRefreshTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRefreshTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [refreshTokenMutation, { data, loading, error }] = useRefreshTokenMutation({
 *   variables: {
 *      refreshToken: // value for 'refreshToken'
 *   },
 * });
 */
export function useRefreshTokenMutation(baseOptions?: Apollo.MutationHookOptions<RefreshTokenMutation, RefreshTokenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RefreshTokenMutation, RefreshTokenMutationVariables>(RefreshTokenDocument, options);
      }
export type RefreshTokenMutationHookResult = ReturnType<typeof useRefreshTokenMutation>;
export type RefreshTokenMutationResult = Apollo.MutationResult<RefreshTokenMutation>;
export type RefreshTokenMutationOptions = Apollo.BaseMutationOptions<RefreshTokenMutation, RefreshTokenMutationVariables>;
export const SignInDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserSignInInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode;
export type SignInMutationFn = Apollo.MutationFunction<SignInMutation, SignInMutationVariables>;

/**
 * __useSignInMutation__
 *
 * To run a mutation, you first call `useSignInMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignInMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signInMutation, { data, loading, error }] = useSignInMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSignInMutation(baseOptions?: Apollo.MutationHookOptions<SignInMutation, SignInMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignInMutation, SignInMutationVariables>(SignInDocument, options);
      }
export type SignInMutationHookResult = ReturnType<typeof useSignInMutation>;
export type SignInMutationResult = Apollo.MutationResult<SignInMutation>;
export type SignInMutationOptions = Apollo.BaseMutationOptions<SignInMutation, SignInMutationVariables>;
export const SignUpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserSignUpInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signUp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode;
export type SignUpMutationFn = Apollo.MutationFunction<SignUpMutation, SignUpMutationVariables>;

/**
 * __useSignUpMutation__
 *
 * To run a mutation, you first call `useSignUpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignUpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signUpMutation, { data, loading, error }] = useSignUpMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSignUpMutation(baseOptions?: Apollo.MutationHookOptions<SignUpMutation, SignUpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignUpMutation, SignUpMutationVariables>(SignUpDocument, options);
      }
export type SignUpMutationHookResult = ReturnType<typeof useSignUpMutation>;
export type SignUpMutationResult = Apollo.MutationResult<SignUpMutation>;
export type SignUpMutationOptions = Apollo.BaseMutationOptions<SignUpMutation, SignUpMutationVariables>;
export const GetUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nif"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserQuery(baseOptions?: Apollo.QueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
      }
export function useGetUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export function useGetUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserSuspenseQueryHookResult = ReturnType<typeof useGetUserSuspenseQuery>;
export type GetUserQueryResult = Apollo.QueryResult<GetUserQuery, GetUserQueryVariables>;