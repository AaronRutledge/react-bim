using System.Collections.Generic;
using Autodesk.Forge.DesignAutomation.Model;

namespace Interaction
{
    /// <summary>
    /// Customizable part of Publisher class.
    /// </summary>
    internal partial class Publisher
    {
        /// <summary>
        /// Constants.
        /// </summary>
        private static class Constants
        {
            private const int EngineVersion = 23;
            public static readonly string Engine = $"Autodesk.Inventor+{EngineVersion}";

            public const string Description = "PUT DESCRIPTION HERE";

            internal static class Bundle
            {
                public static readonly string Id = "InventorPartMakerDA2";
                public const string Label = "alpha";

                public static readonly AppBundle Definition = new AppBundle
                {
                    Engine = Engine,
                    Id = Id,
                    Description = Description
                };
            }

            internal static class Activity
            {
                public static readonly string Id = Bundle.Id;
                public const string Label = Bundle.Label;
            }

            internal static class Parameters
            {
                public const string InventorDoc = nameof(InventorDoc);
                public const string OutputIpt = nameof(OutputIpt);
            }
        }


        /// <summary>
        /// Get command line for activity.
        /// </summary>
        private static List<string> GetActivityCommandLine()
        {
            return new List<string> { $"$(engine.path)\\InventorCoreConsole.exe /al $(appbundles[{Constants.Activity.Id}].path) " };
        }

        /// <summary>
        /// Get activity parameters.
        /// </summary>
        private static Dictionary<string, Parameter> GetActivityParams()
        {
            return new Dictionary<string, Parameter>
                    {
                        {
                            Constants.Parameters.InventorDoc,
                            new Parameter
                            {
                                Verb = Verb.Get,
                                Description = "XML file to process"
                            }
                        },
                        {
                            Constants.Parameters.OutputIpt,
                            new Parameter
                            {
                                Verb = Verb.Put,
                                LocalName = "result.ipt",
                                Description = "Resulting IAM",
                                Ondemand = false,
                                Required = false
                            }
                        }
                    };
        }

        /// <summary>
        /// Get arguments for workitem.
        /// </summary>
        private static Dictionary<string, IArgument> GetWorkItemArgs()
        {
            // TODO: update the URLs below with real values
            return new Dictionary<string, IArgument>
                    {
                        {
                            Constants.Parameters.InventorDoc,
                            new XrefTreeArgument
                            {
                                Url = "https://developer.api.autodesk.com/oss/v2/signedresources/8a845097-1ec1-462b-bd0b-7557b5b6751c?region=US"
                            }
                        },
                        {
                            Constants.Parameters.OutputIpt,
                            new XrefTreeArgument
                            {
                                Verb = Verb.Put,
                                Url = "https://developer.api.autodesk.com/oss/v2/signedresources/93de045c-2147-4449-b50e-a137a7d0aa5f?region=US"
                            }
                        }
                    };
        }
    }
}
