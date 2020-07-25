/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Forge Partner Development
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////

using System;
using System.Diagnostics;
using System.Runtime.InteropServices;

using Inventor;
using Autodesk.Forge.DesignAutomation.Inventor.Utils;
using System.Xml;
using System.IO;
using System.IO.Compression;


namespace InventorPartMakerDA2Plugin
{
    [ComVisible(true)]
    public class SampleAutomation
    {
        private readonly InventorServer inventorApplication;

        public SampleAutomation(InventorServer inventorApp)
        {
            inventorApplication = inventorApp;
        }

        public void Run(Document doc)
        {
            LogTrace("Run called");
            RunWithArguments(doc, null);
        }

        public void RunWithArguments(Document doc, NameValueMap map)
        {
            
            LogTrace("Initialiting");
            PartDocument oPartDoc = (PartDocument)inventorApplication.Documents.Add(DocumentTypeEnum.kPartDocumentObject, inventorApplication.FileManager.GetTemplateFile(DocumentTypeEnum.kPartDocumentObject), true);
            LogTrace("Part template opened");
            TransientGeometry oTG = inventorApplication.TransientGeometry;
            PartComponentDefinition oPartComDef = oPartDoc.ComponentDefinition;
            UserParameters oParams = oPartComDef.Parameters.UserParameters;
           
            XmlDocument xmlDoc = new XmlDocument();
            string currentDir = System.IO.Directory.GetCurrentDirectory();
            string projectDir = Directory.GetParent(currentDir).Parent.FullName;
            LogTrace("Reading XML input file from " + projectDir);
            xmlDoc.Load(System.IO.Path.Combine(projectDir, "react-test-output.xml"));
            //xmlDoc.Load("react-test-output.xml");
            //xmlDoc.Load("C:\\webapps\\IpartCreator\\React-BIM-output.xml");
            XmlNodeList FloorList = xmlDoc.DocumentElement.SelectNodes("/Building/Floors/Floor");
            XmlNodeList FloorPointList = xmlDoc.DocumentElement.SelectNodes("/Building/Floors/Floor/BoundaryPoints/Point");
            XmlNodeList ComponentName = xmlDoc.DocumentElement.SelectNodes("/Building/Floors/Floor/ComponentName");
            XmlNodeList PointX = xmlDoc.DocumentElement.SelectNodes("/Building/Floors/Floor/BoundaryPoints/Point/X");
            XmlNodeList PointY = xmlDoc.DocumentElement.SelectNodes("/Building/Floors/Floor/BoundaryPoints/Point/Y");
            XmlNodeList PointZ = xmlDoc.DocumentElement.SelectNodes("/Building/Floors/Floor/BoundaryPoints/Point/Z");

            

            for (int i=0; i < FloorList.Count; i++)
            {
                //oParams.AddByExpression("ComponentName" + i, ComponentName[i].InnerText, UnitsTypeEnum.kUnitlessUnits);
               
                
                int numPoint = FloorPointList.Count / FloorList.Count;
                
                Point2d[] oPoints = new Point2d[numPoint];  
                SketchPoint[] osPoints = new SketchPoint[numPoint];
              
                for (int j = 0; j < numPoint; j++)
                {

                    oParams.AddByExpression("PointX" + j, PointX[j].InnerText, UnitsTypeEnum.kMillimeterLengthUnits);
                    oParams.AddByExpression("PointY" + j, PointY[j].InnerText, UnitsTypeEnum.kMillimeterLengthUnits);
                    oParams.AddByExpression("PointZ" + j, PointZ[j].InnerText, UnitsTypeEnum.kMillimeterLengthUnits);
                    
                    oPoints[j] = oTG.CreatePoint2d(oPartComDef.Parameters.GetValueFromExpression("PointX" + j, UnitsTypeEnum.kMillimeterLengthUnits), oPartComDef.Parameters.GetValueFromExpression("PointY" + j, UnitsTypeEnum.kMillimeterLengthUnits));
                   

                }

                SketchLine[] oLines = new SketchLine[numPoint];
                PlanarSketch oSketch = oPartComDef.Sketches.Add(oPartComDef.WorkPlanes[2]);
                osPoints[0] = oSketch.SketchPoints.Add(oPoints[0]);
                osPoints[1] = oSketch.SketchPoints.Add(oPoints[1]);
                osPoints[2] = oSketch.SketchPoints.Add(oPoints[2]);
                osPoints[3] = oSketch.SketchPoints.Add(oPoints[3]);

                oLines[0] = oSketch.SketchLines.AddByTwoPoints(osPoints[0], osPoints[1]);
                oLines[1] = oSketch.SketchLines.AddByTwoPoints(oLines[0].EndSketchPoint, osPoints[2]);
                oLines[2] = oSketch.SketchLines.AddByTwoPoints(oLines[1].EndSketchPoint, osPoints[3]);
                oLines[3] = oSketch.SketchLines.AddByTwoPoints(oLines[2].EndSketchPoint, oLines[0].StartSketchPoint);

                oSketch.DimensionConstraints.AddTwoPointDistance(osPoints[0], osPoints[1], DimensionOrientationEnum.kAlignedDim, oPoints[1]); //d0//
                oSketch.DimensionConstraints.AddTwoPointDistance(osPoints[1], osPoints[2], DimensionOrientationEnum.kAlignedDim, oPoints[3]); //d1//

                Profile oProfile = oSketch.Profiles.AddForSolid();
                ExtrudeDefinition oExtrudeDef = oPartComDef.Features.ExtrudeFeatures.CreateExtrudeDefinition(oProfile, PartFeatureOperationEnum.kJoinOperation);
                oExtrudeDef.SetDistanceExtent(oPartComDef.Parameters.UserParameters.AddByExpression("length","8", UnitsTypeEnum.kMillimeterLengthUnits), PartFeatureExtentDirectionEnum.kPositiveExtentDirection);
                ExtrudeFeature oExtrude = oPartComDef.Features.ExtrudeFeatures.Add(oExtrudeDef);

                string PartPath = projectDir + "/results/" + ComponentName[i].InnerText + i + ".ipt";
                //string PartPath = ComponentName[i].InnerText + i + ".ipt";
                oPartDoc.SaveAs(PartPath, false);

                oExtrude.Delete();
                
            }

            oPartDoc.Close(false);

            AssemblyDocument oAssyDoc = (AssemblyDocument)inventorApplication.Documents.Add(DocumentTypeEnum.kAssemblyDocumentObject, inventorApplication.FileManager.GetTemplateFile(DocumentTypeEnum.kAssemblyDocumentObject), true);
            AssemblyComponentDefinition oAssyComDef = oAssyDoc.ComponentDefinition;
            ComponentOccurrences oAssyCompOccs = oAssyComDef.Occurrences;
            Matrix oPos = oTG.CreateMatrix();
            int oStep = 0;
            int icomp;
            int numite = FloorPointList.Count / FloorList.Count;
            for (icomp=0; icomp <= numite; icomp++)
            {
                oStep = oStep + 150;
                oPos.SetTranslation(oTG.CreateVector(oStep, oStep, 0), false);
                string PartPath = projectDir + "/results/" + ComponentName[icomp].InnerText + icomp + ".ipt";
                //string PartPath = ComponentName[icomp].InnerText + icomp + ".ipt";
                ComponentOccurrence oOcc = oAssyCompOccs.Add(PartPath, oPos);
            }

            oAssyDoc.SaveAs(projectDir + "/results/result.iam", false);
            //oAssyDoc.SaveAs("result.iam", false);
            oAssyDoc.Close();
            ZipFile.CreateFromDirectory(projectDir + "/results", projectDir + "/forgeResult.zip");
        }

        #region Logging utilities

        /// <summary>
        /// Log message with 'trace' log level.
        /// </summary>
        private static void LogTrace(string format, params object[] args)
        {
            Trace.TraceInformation(format, args);
        }

        /// <summary>
        /// Log message with 'trace' log level.
        /// </summary>
        private static void LogTrace(string message)
        {
            Trace.TraceInformation(message);
        }

        /// <summary>
        /// Log message with 'error' log level.
        /// </summary>
        private static void LogError(string format, params object[] args)
        {
            Trace.TraceError(format, args);
        }

        /// <summary>
        /// Log message with 'error' log level.
        /// </summary>
        private static void LogError(string message)
        {
            Trace.TraceError(message);
        }

        #endregion
    }
}