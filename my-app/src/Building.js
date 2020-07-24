import React from "react"
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
const StartPoint = (props) => React.createElement("StartPoint", props)
const EndPoint = (props) => React.createElement("EndPoint", props)
const Walls = (props) => React.createElement("Walls", props)
const X = (props) => React.createElement("X", props)
const Y = (props) => React.createElement("Y", props)
const Z = (props) => React.createElement("Z", props)
const Height = (props) => React.createElement("Height", props)


// const formData = {
//     "floors": 6,
//     "floorHeight": 12,
//     "buildingWidth": 200,
//     "buildingLength": 300,
//     "roomsPerFloor": 4
// }


const ConfiguredBuilding = (props) => {
    const formData = props.formData

    const renderFLoors = () => {
        let floors = [];
        let i = 0;
        times(formData.floors, () => {
            floors.push(
                <Floor>
                    <ComponentName>Generic8inFloor</ComponentName>
                    <BoundaryPoints>
                        <Point>
                            <X>0</X>
                            <Y>0</Y>
                            <Z>{i * formData.floorHeight}</Z>
                        </Point>
                        <Point>
                            <X>0</X>
                            <Y>{formData.buildingWidth}</Y>
                            <Z>{i * formData.floorHeight}</Z>
                        </Point>
                        <Point>
                            <X>{formData.buildingLength}</X>
                            <Y>{formData.buildingWidth}</Y>
                            <Z>{i * formData.floorHeight}</Z>
                        </Point>
                        <Point>
                            <X>{formData.buildingLength}</X>
                            <Y>0</Y>
                            <Z>{i * formData.floorHeight}</Z>
                        </Point>
                    </BoundaryPoints>
                </Floor>
            )
            i++
        })
        return floors;
    }
    
    const renderWalls = () => {
        let walls = [];
        let i = 0;
        times(formData.floors, () => {
            walls.push(
                <React.Fragment>
                    <Wall>
                        <ComponentName>Generic8inCmuWall</ComponentName>
                        <StartPoint>
                            <X>0</X>
                            <Y>0</Y>
                            <Z>{i * formData.floorHeight}</Z>
                        </StartPoint>
                        <EndPoint>
                            <X>0</X>
                            <Y>{formData.buildingWidth}</Y>
                            <Z>{i * formData.floorHeight}</Z>
                        </EndPoint>
                        <Height>{formData.floorHeight}</Height>
                    </Wall>
                    <Wall>
                        <ComponentName>Generic8inCmuWall</ComponentName>
                        <StartPoint>
                            <X>0</X>
                            <Y>{formData.buildingWidth}</Y>
                            <Z>{i * formData.floorHeight}</Z>
                        </StartPoint>
                        <EndPoint>
                            <X>{formData.buildingLength}</X>
                            <Y>{formData.buildingWidth}</Y>
                            <Z>{i * formData.floorHeight}</Z>
                        </EndPoint>
                        <Height>{formData.floorHeight}</Height>
                    </Wall>
                    <Wall>
                        <ComponentName>Generic8inCmuWall</ComponentName>
                        <StartPoint>
                            <X>{formData.buildingLength}</X>
                            <Y>{formData.buildingLength}</Y>
                            <Z>{i * formData.floorHeight}</Z>
                        </StartPoint>
                        <EndPoint>
                            <X>{formData.buildingLength}</X>
                            <Y>0</Y>
                            <Z>{i * formData.floorHeight}</Z>
                        </EndPoint>
                        <Height>{formData.floorHeight}</Height>
                    </Wall>
                    <Wall>
                        <ComponentName>Generic8inCmuWall</ComponentName>
                        <StartPoint>
                            <X>{formData.buildingLength}</X>
                            <Y>0</Y>
                            <Z>{i * formData.floorHeight}</Z>
                        </StartPoint>
                        <EndPoint>
                            <X>0</X>
                            <Y>0</Y>
                            <Z>{i * formData.floorHeight}</Z>
                        </EndPoint>
                        <Height>{formData.floorHeight}</Height>
                    </Wall>
                    {renderInteriorWallsForFloor(formData.roomsPerFloor, i * formData.floorHeight)}
                </React.Fragment>
            )
            i++
        })
        return walls;
    }
    
    
    const renderInteriorWallsForFloor = (roomCount, elevation) => {
        let interiorWalls = [];
        let i = 1;
        const numberOfInterioirWalls = roomCount - 1
        const roomSpacing = formData.buildingLength / roomCount
        times(numberOfInterioirWalls, () => {
            interiorWalls.push(
                <Wall>
                    <ComponentName>Generic6inStudWall</ComponentName>
                    <StartPoint>
                        <X>{roomSpacing * i}</X>
                        <Y>0</Y>
                        <Z>{elevation}</Z>
                    </StartPoint>
                    <EndPoint>
                        <X>{roomSpacing * i}</X>
                        <Y>{formData.buildingWidth}</Y>
                        <Z>{elevation}</Z>
                    </EndPoint>
                    <Height>{formData.floorHeight}</Height>
                </Wall>
            )
            i++
        })
        return interiorWalls;
    }    

    return (
        <Building>
            <ProjectInformation>
                <Units>
                    <IsMetric>False</IsMetric>
                </Units>
            </ProjectInformation>
            <Floors>
                {renderFLoors()}
            </Floors>
            <Walls>
                {renderWalls()}
            </Walls>
        </Building>
    )
}

export default ConfiguredBuilding

//export const buildingXML = ReactDomServer.renderToStaticMarkup(<ConfiguredBuilding />)