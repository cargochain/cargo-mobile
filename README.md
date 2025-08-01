# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

```mermaid

sequenceDiagram
    participant App as "Mobile App"
    participant API as "API Endpoint"
    participant Auth as "Auth Service"
    participant RefreshAPI as "Token Refresh API"
    
    App->>API: Request with Access Token
    API-->>App: 401 Unauthorized
    
    App->>Auth: refreshTokenAndRetry()
    Auth->>RefreshAPI: POST /api/v1/token/refresh/<br/>{ refresh: "token" }
    
    alt Refresh Token Valid
        RefreshAPI-->>Auth: 200 OK<br/>{ access: "new_token", refresh: "new_refresh" }
        Auth->>Auth: Store new tokens
        Auth-->>App: Return new access token
        App->>API: Retry original request<br/>with new access token
        API-->>App: 200 OK + Data
    else Refresh Token Invalid/Expired
        RefreshAPI-->>Auth: 401 Unauthorized<br/>{"detail": "Given token not valid",<br/>"code": "token_not_valid"}
        Auth->>Auth: clearAuthData()
        Auth->>App: navigationCallback()
        App->>App: Navigate to Login Screen
    end
```