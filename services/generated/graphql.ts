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
  updatedAt: Scalars['String']['output'];
};

export type CreateCompanyInput = {
  name: Scalars['String']['input'];
};

export type CreateShipmentInput = {
  companyId: Scalars['ID']['input'];
};

export type CurrentUser = {
  __typename?: 'CurrentUser';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isAdmin: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
};

export type Driver = {
  __typename?: 'Driver';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
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
  trackingCode: Scalars['String']['input'];
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
  trackingCode: Scalars['String']['input'];
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
  downloadReportPdf: ReportDownload;
  searchUsers: Array<Driver>;
  shipment: Shipment;
  shipmentNotifications: Array<ShipmentNotification>;
  shipments: Array<Shipment>;
};


export type QueryDownloadReportPdfArgs = {
  trackingCode: Scalars['String']['input'];
};


export type QuerySearchUsersArgs = {
  input: SearchUsersInput;
};


export type QueryShipmentArgs = {
  trackingCode: Scalars['String']['input'];
};


export type QueryShipmentNotificationsArgs = {
  shipmentId: Scalars['ID']['input'];
};


export type QueryShipmentsArgs = {
  input: ShipmentSearchInput;
};

export type RefreshTokenResponse = {
  __typename?: 'RefreshTokenResponse';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

export type ReportDownload = {
  __typename?: 'ReportDownload';
  url: Scalars['String']['output'];
};

export type SearchUsersInput = {
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

export type ShipmentSearchInput = {
  driverId?: InputMaybe<Scalars['ID']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
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
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isAdmin: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
};

export type UserBase64FileInput = {
  base64: Scalars['String']['input'];
  mimeType: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type UserSignInInput = {
  email: Scalars['String']['input'];
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
  password: Scalars['String']['input'];
};

export type UserSignUpResponse = {
  __typename?: 'UserSignUpResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type SearchShipmentsQueryVariables = Exact<{
  input: ShipmentSearchInput;
}>;


export type SearchShipmentsQuery = { __typename?: 'Query', shipments: Array<{ __typename?: 'Shipment', id: string, trackingCode: string, status: string, createdAt: string, updatedAt: string, company: { __typename?: 'Company', name: string }, user: { __typename?: 'User', name: string } }> };

export type GetShipmentQueryVariables = Exact<{
  trackingCode: Scalars['String']['input'];
}>;


export type GetShipmentQuery = { __typename?: 'Query', shipment: { __typename?: 'Shipment', id: string, trackingCode: string, status: string, company: { __typename?: 'Company', id: string, name: string }, user: { __typename?: 'User', id: string, name: string, email: string }, files: Array<{ __typename?: 'File', id: string, url: string }> } };

export type StartDeliveryMutationVariables = Exact<{
  trackingCode: Scalars['String']['input'];
}>;


export type StartDeliveryMutation = { __typename?: 'Mutation', startDelivery: { __typename?: 'Shipment', trackingCode: string } };

export type CompleteDeliveryMutationVariables = Exact<{
  trackingCode: Scalars['String']['input'];
}>;


export type CompleteDeliveryMutation = { __typename?: 'Mutation', completeDelivery: { __typename?: 'Shipment', trackingCode: string } };

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


export type GetUserQuery = { __typename?: 'Query', currentUser?: { __typename?: 'CurrentUser', id: string, email: string, name: string } | null };


export const SearchShipmentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchShipments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ShipmentSearchInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shipments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"trackingCode"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"company"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useSearchShipmentsQuery__
 *
 * To run a query within a React component, call `useSearchShipmentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchShipmentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchShipmentsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSearchShipmentsQuery(baseOptions: Apollo.QueryHookOptions<SearchShipmentsQuery, SearchShipmentsQueryVariables> & ({ variables: SearchShipmentsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchShipmentsQuery, SearchShipmentsQueryVariables>(SearchShipmentsDocument, options);
      }
export function useSearchShipmentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchShipmentsQuery, SearchShipmentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchShipmentsQuery, SearchShipmentsQueryVariables>(SearchShipmentsDocument, options);
        }
export function useSearchShipmentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchShipmentsQuery, SearchShipmentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SearchShipmentsQuery, SearchShipmentsQueryVariables>(SearchShipmentsDocument, options);
        }
export type SearchShipmentsQueryHookResult = ReturnType<typeof useSearchShipmentsQuery>;
export type SearchShipmentsLazyQueryHookResult = ReturnType<typeof useSearchShipmentsLazyQuery>;
export type SearchShipmentsSuspenseQueryHookResult = ReturnType<typeof useSearchShipmentsSuspenseQuery>;
export type SearchShipmentsQueryResult = Apollo.QueryResult<SearchShipmentsQuery, SearchShipmentsQueryVariables>;
export const GetShipmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetShipment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"trackingCode"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shipment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"trackingCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"trackingCode"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"trackingCode"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"company"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"files"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useGetShipmentQuery__
 *
 * To run a query within a React component, call `useGetShipmentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetShipmentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetShipmentQuery({
 *   variables: {
 *      trackingCode: // value for 'trackingCode'
 *   },
 * });
 */
export function useGetShipmentQuery(baseOptions: Apollo.QueryHookOptions<GetShipmentQuery, GetShipmentQueryVariables> & ({ variables: GetShipmentQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetShipmentQuery, GetShipmentQueryVariables>(GetShipmentDocument, options);
      }
export function useGetShipmentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetShipmentQuery, GetShipmentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetShipmentQuery, GetShipmentQueryVariables>(GetShipmentDocument, options);
        }
export function useGetShipmentSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetShipmentQuery, GetShipmentQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetShipmentQuery, GetShipmentQueryVariables>(GetShipmentDocument, options);
        }
export type GetShipmentQueryHookResult = ReturnType<typeof useGetShipmentQuery>;
export type GetShipmentLazyQueryHookResult = ReturnType<typeof useGetShipmentLazyQuery>;
export type GetShipmentSuspenseQueryHookResult = ReturnType<typeof useGetShipmentSuspenseQuery>;
export type GetShipmentQueryResult = Apollo.QueryResult<GetShipmentQuery, GetShipmentQueryVariables>;
export const StartDeliveryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartDelivery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"trackingCode"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startDelivery"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"trackingCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"trackingCode"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trackingCode"}}]}}]}}]} as unknown as DocumentNode;
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
 *      trackingCode: // value for 'trackingCode'
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
export const CompleteDeliveryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CompleteDelivery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"trackingCode"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"completeDelivery"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"trackingCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"trackingCode"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trackingCode"}}]}}]}}]} as unknown as DocumentNode;
export type CompleteDeliveryMutationFn = Apollo.MutationFunction<CompleteDeliveryMutation, CompleteDeliveryMutationVariables>;

/**
 * __useCompleteDeliveryMutation__
 *
 * To run a mutation, you first call `useCompleteDeliveryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCompleteDeliveryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [completeDeliveryMutation, { data, loading, error }] = useCompleteDeliveryMutation({
 *   variables: {
 *      trackingCode: // value for 'trackingCode'
 *   },
 * });
 */
export function useCompleteDeliveryMutation(baseOptions?: Apollo.MutationHookOptions<CompleteDeliveryMutation, CompleteDeliveryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CompleteDeliveryMutation, CompleteDeliveryMutationVariables>(CompleteDeliveryDocument, options);
      }
export type CompleteDeliveryMutationHookResult = ReturnType<typeof useCompleteDeliveryMutation>;
export type CompleteDeliveryMutationResult = Apollo.MutationResult<CompleteDeliveryMutation>;
export type CompleteDeliveryMutationOptions = Apollo.BaseMutationOptions<CompleteDeliveryMutation, CompleteDeliveryMutationVariables>;
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
export const GetUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode;

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