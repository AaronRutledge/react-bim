using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Autodesk.Forge.Core;
using Autodesk.Forge.DesignAutomation;
using Autodesk.Forge.DesignAutomation.Model;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace Interaction
{
    internal partial class Publisher
    {
        private string _nickname;

        internal DesignAutomationClient Client { get; }
        private static string PackagePathname { get; set; }

        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="configuration"></param>
        public Publisher(IConfiguration configuration)
        {
            Client = CreateDesignAutomationClient(configuration);
            PackagePathname = configuration.GetValue<string>("PackagePathname");
        }

        /// <summary>
        /// List available engines.
        /// </summary>
        public async Task ListEnginesAsync()
        {
            string page = null;
            do
            {
                using (var response = await Client.EnginesApi.GetEnginesAsync(page))
                {
                    if (!response.HttpResponse.IsSuccessStatusCode)
                    {
                        Console.WriteLine("Request failed");
                        break;
                    }

                    foreach (var engine in response.Content.Data)
                    {
                        Console.WriteLine(engine);
                    }

                    page = response.Content.PaginationToken;
                }
            } while (page != null);
        }

        public async Task PostAppBundleAsync()
        {
            if (!File.Exists(PackagePathname))
                throw new Exception("App Bundle with package is not found. Ensure it set correctly in appsettings.json");

            var shortAppBundleId = $"{Constants.Bundle.Id}+{Constants.Bundle.Label}";
            Console.WriteLine($"Posting app bundle '{shortAppBundleId}'.");

            // try to get already existing bundle
            var response = await Client.AppBundlesApi.GetAppBundleAsync(shortAppBundleId, throwOnError: false);
            if (response.HttpResponse.StatusCode == HttpStatusCode.NotFound) // create new bundle
            {
                await Client.CreateAppBundleAsync(Constants.Bundle.Definition, Constants.Bundle.Label, PackagePathname);
                Console.WriteLine("Created new app bundle.");
            }
            else // create new bundle version
            {
                var version = await Client.UpdateAppBundleAsync(Constants.Bundle.Definition, Constants.Bundle.Label, PackagePathname);
                Console.WriteLine($"Created version #{version} for '{shortAppBundleId}' app bundle.");
            }
        }

        public async Task RunWorkItemAsync()
        {
            // create work item
            var wi = new WorkItem
            {
                ActivityId = await GetFullActivityId(),
                Arguments = GetWorkItemArgs()
            };

            // run WI and wait for completion
            var status = await Client.CreateWorkItemAsync(wi);
            Console.WriteLine($"Created WI {status.Id}");
            while (status.Status == Status.Pending || status.Status == Status.Inprogress)
            {
                Console.Write(".");
                Thread.Sleep(2000);
                status = await Client.GetWorkitemStatusAsync(status.Id);
            }

            Console.WriteLine();
            Console.WriteLine($"WI {status.Id} completed with {status.Status}");
            Console.WriteLine();

            // dump report
            var client = new HttpClient();
            var report = await client.GetStringAsync(status.ReportUrl);
            var oldColor = Console.ForegroundColor;
            Console.ForegroundColor = ConsoleColor.DarkYellow;
            Console.Write(report);
            Console.ForegroundColor = oldColor;
            Console.WriteLine();
        }

        private async Task<string> GetFullActivityId()
        {
            string nickname = await GetNicknameAsync();
            return $"{nickname}.{Constants.Activity.Id}+{Constants.Activity.Label}";
        }

        public async Task<string> GetNicknameAsync()
        {
            if (_nickname == null)
            {
                _nickname = await Client.GetNicknameAsync("me");
            }

            return _nickname;
        }

        public async Task PublishActivityAsync()
        {
            var nickname = await GetNicknameAsync();

            // prepare activity definition
            var activity = new Activity
            {
                Appbundles = new List<string> { $"{nickname}.{Constants.Bundle.Id}+{Constants.Bundle.Label}" },
                Id = Constants.Activity.Id,
                Engine = Constants.Engine,
                Description = Constants.Description,
                CommandLine = GetActivityCommandLine(),
                Parameters = GetActivityParams()
            };

            // check if the activity exists already
            var response = await Client.ActivitiesApi.GetActivityAsync(await GetFullActivityId(), throwOnError: false);
            if (response.HttpResponse.StatusCode == HttpStatusCode.NotFound) // create activity
            {
                Console.WriteLine($"Creating activity '{Constants.Activity.Id}'");
                await Client.CreateActivityAsync(activity, Constants.Activity.Label);
                Console.WriteLine("Done");
            }
            else // add new activity version
            {
                Console.WriteLine("Found existing activity. Updating...");
                int version = await Client.UpdateActivityAsync(activity, Constants.Activity.Label);
                Console.WriteLine($"Created version #{version} for '{Constants.Activity.Id}' activity.");
            }
        }

        public async Task CleanExistingAppActivityAsync()
        {
            var bundleId = Constants.Bundle.Id;
            var activityId = Constants.Activity.Id;
            var shortAppBundleId = $"{bundleId}+{Constants.Bundle.Label}";


            //check app bundle exists already
            var appResponse = await Client.AppBundlesApi.GetAppBundleAsync(shortAppBundleId, throwOnError: false);
            if (appResponse.HttpResponse.StatusCode == HttpStatusCode.OK)
            {
                //remove exsited app bundle 
                Console.WriteLine($"Removing existing app bundle. Deleting {bundleId}...");
                await Client.AppBundlesApi.DeleteAppBundleAsync(bundleId);
            }
            else
            {
                Console.WriteLine($"The app bundle {bundleId} does not exist.");
            }

            //check activity exists already
            var activityResponse = await Client.ActivitiesApi.GetActivityAsync(await GetFullActivityId(), throwOnError: false);
            if (activityResponse.HttpResponse.StatusCode == HttpStatusCode.OK)
            {
                //remove exsited activity
                Console.WriteLine($"Removing existing activity. Deleting {activityId}...");
                await Client.ActivitiesApi.DeleteActivityAsync(activityId);
            }
            else
            {
                Console.WriteLine($"The activity {activityId} does not exist.");
            }
        }


        private static DesignAutomationClient CreateDesignAutomationClient(IConfiguration configuration)
        {
            var forgeService = CreateForgeService(configuration);

            var rsdkCfg = configuration.GetSection("DesignAutomation").Get<Configuration>();
            var options = (rsdkCfg == null) ? null : Options.Create(rsdkCfg);
            return new DesignAutomationClient(forgeService, options);
        }

        private static ForgeService CreateForgeService(IConfiguration configuration)
        {
            var forgeCfg = configuration.GetSection("Forge").Get<ForgeConfiguration>();
            var httpMessageHandler = new ForgeHandler(Options.Create(forgeCfg))
            {
                InnerHandler = new HttpClientHandler()
            };

            return new ForgeService(new HttpClient(httpMessageHandler));
        }
    }
}
