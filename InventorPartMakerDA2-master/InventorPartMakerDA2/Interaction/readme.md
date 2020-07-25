# Overview

This is a sample project, which allows to post app bundle, activity and work item to Design Automation services by using [.NET SDK](https://github.com/Autodesk-Forge/forge-api-dotnet-design.automation).

# Steps for test run
1. Build the whole solution.
1. (if necessary) Make `Interaction` as active project. Expand it.
1. Set Forge credentials
    * Use environment variables
    ```
    FORGE_CLIENT_ID=<your client id>
    FORGE_CLIENT_SECRET=<your client secret>
    ```
    or
    ```
    Forge__ClientId=<your client id>
    Forge__ClientSecret=<your client secret>
    ```
    * _(not recommended)_ Open `appsettings.json` and update `ClientId` and `ClientSecret` with real values.
1. Open `Publisher.Custom.cs` and supply URLs in `GetWorkItemArgs()` method.

# Custom adjustments

The template project contains placeholders or default data for app bundle and activity.  So update constants in `Publisher.Custom.cs` with your project-specific data.

# Usage

The console app can be used in two modes.
## Interaction
Launch the console and follow the instructions. Basically - each DA interaction command will have unique number, just press the required one. Command any number of commands one by one.
## Run selected command
Put number of the wanted command in command line and the console will executed it on start and exist right away. Useful if some repetetive task (like post work item) should be run frequently.