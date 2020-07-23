// Helper styles for demo
import "./helper.css";
import { DisplayFormikState } from "./helper";

import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";

const Form = () => (
  <div className="app">
    <Formik
      initialValues={{
        floors: "2",
        floorHeight: "3000",
        buildingWidth: "10000",
        buildingLength: "10000",
        roomsPerFloor: "5"
      }}
      onSubmit={async values => {
        await new Promise(resolve => setTimeout(resolve, 500));
        alert(JSON.stringify(values, null, 2));
      }}
      validationSchema={Yup.object().shape({
        floors: Yup.number()
          .required("Required")
          .min(1)
          .max(50),
        floorHeight: Yup.number()
          .required("Required")
          .min(2000)
          .max(5000),
        buildingWidth: Yup.number()
          .required("Required")
          .min(2000)
          .max(50000),
        buildingLength: Yup.number()
          .required("Required")
          .min(2000)
          .max(50000),
        roomsPerFloor: Yup.number()
          .required("Required")
          .min(1)
          .max(100)
      })}
    >
      {props => {
        const {
          values,
          touched,
          errors,
          dirty,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
          handleReset
        } = props;
        return (
          <form onSubmit={handleSubmit}>
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
              className={
                errors.floors && touched.floors
                  ? "text-input error"
                  : "text-input"
              }
            />
            {errors.number && touched.number && (
              <div className="input-feedback">{errors.number}</div>
            )}

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
              className={
                errors.floorHeight && touched.floorHeight
                  ? "text-input error"
                  : "text-input"
              }
            />
            {errors.number && touched.number && (
              <div className="input-feedback">{errors.number}</div>
            )}

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
              className={
                errors.buildingWidth && touched.buildingWidth
                  ? "text-input error"
                  : "text-input"
              }
            />
            {errors.number && touched.number && (
              <div className="input-feedback">{errors.number}</div>
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
              className={
                errors.buildingLength && touched.buildingLength
                  ? "text-input error"
                  : "text-input"
              }
            />
            {errors.number && touched.number && (
              <div className="input-feedback">{errors.number}</div>
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
              className={
                errors.roomsPerFloor && touched.roomsPerFloor
                  ? "text-input error"
                  : "text-input"
              }
            />
            {errors.number && touched.number && (
              <div className="input-feedback">{errors.number}</div>
            )}

            <button
              type="button"
              className="outline"
              onClick={handleReset}
              disabled={!dirty || isSubmitting}
            >
              Reset
            </button>
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>

            <DisplayFormikState {...props} />
          </form>
        );
      }}
    </Formik>
  </div>
);

export default Form;