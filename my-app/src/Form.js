// Helper styles for demo
import "./helper.css";
import { DisplayFormikState } from "./helper";
//import {buildingXML} from "./Building";
import ConfiguredBuilding from "./Building";

import React, { useState } from "react";
import ReactDomServer from "react-dom/server";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import format from "xml-formatter";
import Accordion from "react-collapsy";
import "react-collapsy/lib/index.css";

//console.log("here is some XML", buildingXML);

function Form() {
  const [xmlOutput, setXmlOutput] = useState("<Building></Building>");
  return (
    <div className="app">
      <Formik
        initialValues={{
          floors: "",
          floorHeight: "",
          buildingWidth: "",
          buildingLength: "",
          roomsPerFloor: "",
        }}
        onSubmit={async (values) => {
          await new Promise((resolve) => setTimeout(resolve, 500));
          alert(JSON.stringify(values, null, 2));
          setXmlOutput(ReactDomServer.renderToStaticMarkup(<ConfiguredBuilding formData={values} />));
        }}
        validationSchema={Yup.object().shape({
          floors: Yup.number().required("Number of Floors is Required").min(1).max(50),
          floorHeight: Yup.number().required("Floor to Floor Height is Required").min(2000).max(5000),
          buildingWidth: Yup.number().required("Building Width is Required").min(2000).max(50000),
          buildingLength: Yup.number().required("Building Length is Required").min(2000).max(50000),
          roomsPerFloor: Yup.number().required("Rooms Per Floor is Required").min(1).max(100),
        })}
      >
        {(props) => {
          const {
            values,
            touched,
            errors,
            dirty,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit,
            handleReset,
          } = props;
          return (
            <form onSubmit={handleSubmit}>
              <label htmlFor="floors" style={{ display: "block" }}>
                Building Units
              </label>
              <select label="Building Units" name="buildingUnits">
                <option value="metric">Metric</option>
                <option value="imperial">Imperial</option>
              </select>

              <label htmlFor="floors" style={{ display: "block" }}>
                Number of Floors
              </label>
              <input
                id="floors"
                placeholder="Enter Number of Floors"
                type="number"
                value={values.number}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.floors && touched.floors ? "text-input error" : "text-input"}
              />
              {errors.floors && touched.floors && <div className="input-feedback">{errors.floors}</div>}

              <label htmlFor="floorHeight" style={{ display: "block" }}>
                Floor to Floor Height
              </label>
              <input
                id="floorHeight"
                placeholder="Enter Floor to Floor Height"
                type="number"
                value={values.number}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.floorHeight && touched.floorHeight ? "text-input error" : "text-input"}
              />
              {errors.floorHeight && touched.floorHeight && <div className="input-feedback">{errors.floorHeight}</div>}

              <label htmlFor="buildingWidth" style={{ display: "block" }}>
                Building Width
              </label>
              <input
                id="buildingWidth"
                placeholder="Building Width"
                type="number"
                value={values.number}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.buildingWidth && touched.buildingWidth ? "text-input error" : "text-input"}
              />
              {errors.buildingWidth && touched.buildingWidth && (
                <div className="input-feedback">{errors.buildingWidth}</div>
              )}

              <label htmlFor="buildingLength" style={{ display: "block" }}>
                Building Length
              </label>
              <input
                id="buildingLength"
                placeholder="Building Length"
                type="number"
                value={values.number}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.buildingLength && touched.buildingLength ? "text-input error" : "text-input"}
              />
              {errors.buildingLength && touched.buildingLength && (
                <div className="input-feedback">{errors.buildingLength}</div>
              )}

              <label htmlFor="roomsPerFloor" style={{ display: "block" }}>
                Rooms Per Floor
              </label>
              <input
                id="roomsPerFloor"
                placeholder="Rooms Per Floor"
                type="number"
                value={values.number}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.roomsPerFloor && touched.roomsPerFloor ? "text-input error" : "text-input"}
              />
              {errors.roomsPerFloor && touched.roomsPerFloor && (
                <div className="input-feedback">{errors.roomsPerFloor}</div>
              )}

              <button type="button" className="outline" onClick={handleReset} disabled={!dirty || isSubmitting}>
                Reset
              </button>
              <button type="submit" disabled={isSubmitting}>
                Submit
              </button>
              <Accordion title="Generated Building XML">
                <pre>{format(xmlOutput)}</pre>
              </Accordion>
              {/* <DisplayFormikState {...props} /> */}
            </form>
          );
        }}
      </Formik>
    </div>
  );
}

export default Form;
