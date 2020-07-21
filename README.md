

# React-BIM AEC Hackathon Project

### Project Links:
 [Trello Board](https://trello.com/b/flDXHo5c/react-bim)



## The need for an open source architectural modeling ‘language’

The AEC community must rely heavily on the features of proprietary modeling programs to coordinate a vast amount of both geometric and parametric data for every project.  The tools are amazing, but regardless of the feature-set of the modeling program, the ability to innovate becomes completely coupled with the ability for the software vendors to progressively add features.  Vendors are forced to either have to work within the limitations of the software or build add-ons via the program’s SDK, which simply become faster automated ways of running the modeling programs user interface and do little to fully address the inherent limitations.  These problems become particularly painful at the interface between describing the design intent to trying to extract enough manufacturing data to actually construct.  The BIM model is inherently a generalist tool and the lack of a common modeling language makes it difficult to use this data in a way that can then be useful for digital fabrication.  Creating a framework that allowed building component manufacturers to enforce the required parameters necessary to drive their products could remove a lot of the need for design churn with secondary and more specialized modeling applications.


## Piggybacking on the developments in other fields

There are many similarities between crafting a user interface and modeling the built environment.  On the web, for example, an application consists of a nested hierarchy of components.  These components are generally reusable concepts from application to application, but vary widely from project to project.  Just like two buildings may not have the exact same window style--there exists the idea of a window in a building and these components need to be customized to fit the nearly infinite needs of the building program.  This is very similar to how a web component may be styled from application to application (or instance to instance).  Components must also respond to changes in a building program.  Often during construction, building elevations, wall lengths and the overall parameters can often change.  Smart building design allows for these components to be driven by these top level parameters.  This is very similar to how a responsive web application may reorder and scale components based on the browser or device size.  


## Why React?

React is arguably the most widely used web application framework in use today and has a very active open source community.  React is also inherently descriptive of a hierarchy of components and encourages an elegant unidirectional data flow model called ‘Flux’ (and usually implemented with the Redux library) that could be very useful in modeling and controlling how the data in a building translates to the parameters necessary to drive individual building components.  Components in React are described with a descriptive syntax called JSX that is very human readable and makes structure obvious and easy to work with.  Probably the greatest benefit of React for this application is it is actually engineered in a way that is completely decoupled from the web.  While React is most commonly thought of as an application for building web pages, the library that interfaces with the web (known as the Document Object Model--DOM) is abstracted into a seperate library, allowing the core react library to be used for other domains such as native application development for phones and other mobile devices (react-native) as well as virtual reality applications (react-360).    

It has taken the web development community a couple decades of development to solve an extremely similar domain problem.  Rather than reinvent the wheel for AEC, I see a lot of advantages in hitching a wagon to this technology and utilizing it for the specific problems of the AEC.


## What about IFC and other open standards?  Isn’t that the common language modeling programs should use?

IFC is a fine standard to describe a completed static building or building component.  It is not dynamic and it is also highly prescriptive of 3D geometry, which is not the core problem that I see needs to be solved.  The problem we are solving is developing a framework that helps define how the data between components is related.  I think IFC is analogous to HTML on the web.  While you can describe any web page as an HTML document, it is extremely tedious to do so directly.  This is why dynamic languages such as javascript and frameworks such as React were born.  React still renders to HTML.  Likewise, react-bim could render to IFC.


## Do you want architects to become programmers?

No!  At least not all of them.  A graphically rich environment is the best way to model a building.  This project advocates for a new tool and a new type of AEC professional that can advance the way building components are described and interact within the application.  The initial adoption of ‘react-BIM’ can be isolated to individual building components that have hooks to the hosting application that allow an architect to model a building component that the react-bim application renders and delivers to the hosted application as an asset for integration in the coordinated BIM model.  With wide adoption of a technology such as this, there could be a lot more interoperability between platforms and vendors of building components and accelerate innovation.


## How will this work exactly?

This is where you come in!

The building blocks of the framework will consist of parametrically configurable components that can be nested to form a building component (such as a stair system) or an entire building assembly.  Basic generic building component primitives would be available as part of the framework.  However, authoring of more complex components is usually more efficiently done in a CAD program.  Components authored in a CAD program (such as Inventor or as a Revit family) would need to be ‘registered’ by the framework to capture all of the driving parameters and component details.  Once registered, the components would then be able to be used as a tag in the framework and driven by the state of the application.  Each component would need to inherit a set of basic parameters that would be common to all components of that type.  For example, a wall component would have required placement detail parameters (referred to as props in React) such as wall start and stop data and thickness and type data.  The framework can also impose what type of children a particular component can have.  This is enforceable by the React PropTypes library: [https://reactjs.org/docs/typechecking-with-proptypes.html](https://reactjs.org/docs/typechecking-with-proptypes.html)

When using components generated from a specific CAD program, an add-on will need to be created for that program that can open the file, update the parameters and save out the resulting asset for the framework.

There are at least a couple of ways that the components can be rendered.  Ideally a custom BIM renderer could be built that is aware of a library of basic BIM primitive components and 3D shapes.  The renderer would construct these models from the output of the application.  For example, a very simple model might look like this:


```
import React from 'react'
import ReactBIM from 'react - bim'
import { armstrong1232 } from './windowComponents/armstrongCatalog'

function MyBuilding(props) {
    return (
        <Building>
            <Floor elevation={props.floorOneElevation}>
                <Slab type="HollowCore10">
                    <WallSegment definedBy="centerline" start="10002,8897" End="10012,8897" type="CastInPlace8">
                        <RectangularOpening start="5.2,3.5" end="10.6,7">
                            <Window type="Stationary22" component={armstrong1232} />
                        </RectangularOpening>
                    </WallSegment>
                </Slab>
            </Floor >
        </Building >
    )
}
export default MyBuilding
```

The renderer would then assemble the structure from the output.  Hypar may be a great starting point for this. 

[https://hypar.io/](https://hypar.io/) \
Renderers could be built for any CAD environment. 

Here is some documentation that lays out the basics for creating a custom renderer.

[https://medium.com/@agent_hunt/hello-world-custom-react-renderer-9a95b7cd04bc](https://medium.com/@agent_hunt/hello-world-custom-react-renderer-9a95b7cd04bc)

This approach is the most complex, but could be the most powerful.  It would be great to have one generic renderer that generates assets that could then easily be used by multiple CAD/BIM applications. 

Another approach is to use react-DOM (the react web renderer) to output an XML structure that could then be interpreted by a modeling program for rendering.  Here is an article describing a way react-DOM can be used for XML generation: 

[https://medium.com/@mair.swartz/creating-xml-document-with-react-c6c37f5c608b](https://medium.com/@mair.swartz/creating-xml-document-with-react-c6c37f5c608b)

This XML could be an IFC or a semantic description of component names that are meaningful to the CAD program.  One idea I had was to structure CAD files in a way that they could be ‘autodiscovered’ by the development environment and then registered for use.  Yeoman ([https://yeoman.io/](https://yeoman.io/)) or something similar may be a useful tool for this.

The XML file would then be read as a secondary step in by a CAD application such as Solidworks, Autodesk Inventor, Revit or Fusion for rendering of the components.  

This approach seems the most doable for a hackathon.  However, I think the lack of a custom renderer limits its capabilities and would require each CAD implementation create its own renderer.

## Domain Specific Challenges

**Solving Geometric Constraints**:  The relationship between hierarchical components are often driven by geometric constraints that are difficult to solve with just vanilla programmatic logic.  For example, think about the pieces of a stair guard railing that must adapt to varying stair rises and runs.  The top of the guardrail must be at least 42”, the spacing between the posts must be no greater than 48” and the pickets must be kept at 3 ½”.  To model each piece of the guardrail we must understand the overall rise and run of the entire guardrail so that we can derive the parameters of each individual piece.  This could all be done by solving a series of geometric and trigonometric equations.  However, it is much easier to sketch the layout in a 2D (or possibly 3D) parametric sketch program that enforces the constraints we want to keep and derive the parameters we are interested in.  The leading CAD programs have these sketch tools baked in and there are a few open source alternatives such as FreeCAD ([https://www.freecadweb.org/](https://www.freecadweb.org/)) and GeoSolver ([http://geosolver.sourceforge.net/](http://geosolver.sourceforge.net/)).  A long term solution may include the adoption of a constraint solver into the system so that these problems could be solved within the framework. However, a viable alternative is to use layout sketches in the CAD program of choice and an API hook that updates the required layout sketch and reports back on the parameters of interest.

**Part Numbering:**  Every unique component should be given a part number that identifies it.  Part numbering should be based on the unique parameters that define it completely.

**3D Positioning of Objects:** A universally understood method for defining the project coordinate system and origin, coordinate system of each individual component and a method to define the relationship between the two will be necessary.  Different types of objects may require different types of positioning constraints that are inherent to their object types.  For example, a floor slab will probably always be relative to the plane of an elevation.  

**IFC Interoperability:**  It will be important that constructed objects maintain all of the important meta data for interoperability with IFC standards.

## What is the Hackathon goal?

It is obviously not realistic to build this entire framework in a few weeks time.  However, I think a reasonable goal would be to demonstrate the ability to compose a very basic building or building component utilizing a few basic components with react/JSX and then have an application that could read in the layout and compose and render it.  The state of the application should be easily updated and the resulting output re-rendered quickly.

Another goal is to lay out some ‘to-dos’ for further developments and establish a GitHub repo where ongoing work could be performed. 

## Who can help with this?

Anyone with experience with Javascript would be helpful!  Could also use help with parametric CAD modeling, CAD SDKs, geometric constraint solvers and the IFC Standard.  Experience is great, but would welcome help from anyone interested in learning more about these tools that can report back on their discoveries.  Also welcome: project managers, flow charting and building component manufacturing gurus.  Happy to have anyone on board that is interested in this and happy to help progress their learning.
