import React from "react"
import ReactDomServer from "react-dom/server"
import { times } from 'lodash'

const Building = (props) => React.createElement("Building", props)
const Wall = (props) => React.createElement("Wall", props)
const Floor = (props) => React.createElement("Floor", props)
const ProjectInformation = (props) => React.createElement("ProjectInformation", props)
const Units = (props) => React.createElement("Units", props)
const IsMetric = (props) => React.createElement("IsMetric", props)
const Levels = (props) => React.createElement("Levels", props)
const Level = (props) => React.createElement("Level", props)
const Elevation = (props) => React.createElement("Elevation", props)
const Name = (props) => React.createElement("Name", props)
const Floors = (props) => React.createElement("Floors", props)
const ComponentName = (props) => React.createElement("ComponentName", props)
const BoundaryPoints = (props) => React.createElement("BoundaryPoints", props)
const Point = (props) => React.createElement("Point", props)
const X = (props) => React.createElement("X", props)
const Y = (props) => React.createElement("Y", props)
const Z = (props) => React.createElement("Z", props)
const StartPoint = (props) => React.createElement("StartPoint", props)
const Height = (props) => React.createElement("Height", props)


const formData = {
    "floors": 4,
    "floorHeight": 100,
    "buildingWidth": 200,
    "buildingHeight": 200,
    "roomsPerFloor": 4
}

const ConfiguredBuilding = (props) => {
    let floors = [];
    let i = 0;
    times(formData.floors, () => {
        floors.push(
            <Floor>
                <ComponentName>Generic8inFloor</ComponentName>
                <BoundaryPoints>
                    <Point>
                        <X>0</X>
                        <Y>{i * formData.floorHeight}</Y>
                        <Z>0</Z>
                    </Point>
                    <Point>
                        <X>{formData.buildingWidth}</X>
                        <Y>{i * formData.floorHeight}</Y>
                        <Z>0</Z>
                    </Point>
                    <Point>
                        <X>{formData.buildingWidth}</X>
                        <Y>{i * formData.floorHeight}</Y>
                        <Z>{formData.buildingHeight}</Z>
                    </Point>
                    <Point>
                        <X>0</X>
                        <Y>{i * formData.floorHeight}</Y>
                        <Z>{formData.buildingHeight}</Z>
                    </Point>
                </BoundaryPoints>
            </Floor>
        )
        i++
    })
    return (
        <Building>
            <ProjectInformation>
                <Units>
                    <IsMetric>False</IsMetric>
                </Units>
            </ProjectInformation>
            <Floors>
                {floors}
            </Floors>

        </Building>
    )
}


export const buildingXML = ReactDomServer.renderToStaticMarkup(<ConfiguredBuilding />)