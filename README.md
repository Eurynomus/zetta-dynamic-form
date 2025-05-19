# zetta-dynamic-form

A dynamic form builder built with **React**, **TypeScript**, **Material UI**, **Jest** and **React Hook Form**.

# Introduction

This project allows you to generate interactive, configurable forms from a simple JSON schema. It supports a wide range of input types, nested groups, dynamic validation, conditional visibility, and even mock API-based auto-filling.


# Core Features

✅ Schema-driven form rendering  
✅ Supports input types like text, textarea, dropdown, checkbox, radio  
✅ Nested field groups  
✅ Show/hide logic based on field values  
✅ Custom validation logic  
✅ API-mocked auto-filling  
✅ Clean output: structured JSON of form values  
✅ Fully responsive, component-based UI  
✅ Built-in unit tests  

# Installation

## 1. Clone repository.  
https://github.com/Eurynomus/zetta-dynamic-form.git  
cd zetta-dynamic-form

## 2. Install dependencies.  
npm install or yarn

## 3. Start the development server.  
npm run dev or yarn start

# Project Structure

```plaintext
src/
├── components/
│   ├── FormBuilder/
│   │   ├── components/
│   │   │   ├── FormErrorAlert.tsx - Displaying error messages in the form
│   │   │   ├── SubmitButton.tsx - Form submit button
│   │   │   └── SuccessNotification.tsx - Displays a temporary popup message on successfull submission
│   │   ├── hooks/
│   │   │   ├── useApiAutoFill.ts - Automatically fetches and fills form data from APIs based on triggers
│   │   │   ├── useFormSubmission.ts - Form submission logic, including data filtering, transformation and UI state management
│   │   │   └── useVisibleFields.ts - Tracks which fields are visible in the form over time and manage form state accordingly
│   │   ├── utils/
│   │   │   ├── formUtils.ts - Determines which fields should be visible based on the current form values
│   │   │   ├── transformFormData.ts - Transforms form data into a structured object based on fields definition
│   │   │   └── validationHelper.ts - Custom validations for string, number, regex, email
│   │   ├── FormBuilder.tsx - The dynamic form builder. Implements form & state validation, dynamic field rendering, field visibility tracking, api auto-fill, 
                              submit handling & states, error display, success feedback, submit button
│   │   ├── FormFieldRenderer.tsx - The main component for all field types
        └── types.ts - All interfaces
│   └── FormGenerator/
        ├── FormGenerator.tsx - Dynamically renders your JSON schema into form fields
├── services/
│   └── mockApi.ts - Mock API data
└── tests/
    ├── FormGenerator.test.tsx - Unit tests for the Form Generator component
    ├── MockApi.test.tsx - Unit tests for the mockapi functionality
    └── Validations.test.tsx - Unit tests for the validations
```

# How It Works

At the top of the page, there’s an input box where you can paste a JSON schema that describes your form.

When the JSON is valid:
* As soon as a valid schema is provided, the form renders.
* A “Reset Form” button is available to reset the schema input and start fresh.
* Mock API calls are triggered where applicable to auto-fill fields.
* On submit the filled values are output in the console as a structured JSON object — preserving the hierarchy of nested groups and field dependencies.  

When the JSON is not valid:
* Throws an error for invalid JSON format.

# Dynamic Form Renderer
The `renderField` function in `FormFieldRenderer.tsx` is the core of our dynamic form builder, transforming configuration objects into interactive form elements by integrating Material UI components with React Hook Form.

## Material UI Integration
The function leverages Material UI's component library to create a consistent, styled form experience:

```js
// Example of Material UI component usage in renderField
<TextField
  {...rhfField}
  label={field.label}
  fullWidth
  multiline={field.type === 'textarea'}
  error={!!error}
  helperText={error?.message}
  sx={{ mb: 2 }}
/>
```  
* Uses components like `TextField`, `Select`, `Checkbox` and `RadioGroup`
* Applies consistent styling with `Material UI`'s sx prop
* Handles `error states` and `validation feedback`
* Creates styled containers for `grouped fields`

## React Hook Form Integration
The function seamlessly connects with `React Hook Form` for state management and validation:

```js
<Controller
  name={field.name}
  control={control}
  defaultValue=""
  rules={applyCustomValidation(field.validation)}
  render={({ field: rhfField, fieldState: { error } }) => (
    // Material UI component rendering
  )}
/>
```  
* Uses `Controller` to bridge Material UI with form state
* Applies `validation rules` through React Hook Form's validation system
* Accesses field state to `display errors`
* Uses the `watch` function to observe field values for `conditional logic`

## Conditional Rendering
The function implements `dynamic form behavior` where fields appear or disappear based on other fields values:

```js
// How conditional visibility works
const watchedValue = field.visibleIf?.field ? watch(field.visibleIf.field) : true;
const isVisible = field.visibleIf ? watchedValue === field.visibleIf.value : true;

if (!isVisible) return null;
```

Example configuration with conditional fields:  

<details>
<summary>Click to view JSON configuration</summary>
```json
    {
      "type": "dropdown",
      "label": "User Type",
      "name": "userType",
      "options": [
        { "label": "Person", "value": "Person" },
        { "label": "Business", "value": "Business" }
      ],
      "validation": {
        "required": "User type is required"
      }
    },
    {
      "type": "group",
      "label": "Personal Info",
      "visibleIf": { "field": "userType", "value": "Person" },
      "fields": [
        {
          "type": "text",
          "label": "First Name",
          "name": "firstName",
          "validation": {
            "required": "First name is required",
            "minLength": { "value": 2, "message": "Must be at least 2 characters" }
          }
        },
        {
          "type": "text",
          "label": "Last Name",
          "name": "lastName",
          "validation": {
            "required": "Last name is required",
            "maxLength": { "value": 6, "message": "Maximum allowed characters is 6" }
          }
        }
      ]
    }
```
</details>


# Validation Rules

The dynamic form builder uses `react-hook-form` under the hood to validate fields based on a JSON schema. Validation rules are defined per field via the `validation` object.

## Supported Validation Rules
Each field can have one or more of the following validation rules:

| Rule               | Type                              | Description                                                                   |
| ------------------ | --------------------------------- | ----------------------------------------------------------------------------- |
| `required`         | `string`                          | Error message to show if the field is left empty.                             |
| `minLength`        | `{ value: number, message }`      | Sets the minimum number of characters for input.                              |
| `maxLength`        | `{ value: number, message }`      | Sets the maximum number of characters for input.                              |
| `regex`            | `{ value: string, message }`      | Validates input using a custom regular expression.                            |
| `customValidation` | `"string"`, `"number"`, `"email"` | Custom built-in validations for common input types (letters, numbers, email). |


## How it Works
The validation rules in your JSON input are automatically parsed and passed into `react-hook-form's` `rules` parameter. Additional helper logic (`customValidation`) is applied via the `applyCustomValidation` utility.

## Custom Validation Types
| Type       | Description                     | Pattern Used                   |
| ---------- | ------------------------------- | ------------------------------ |
| `"string"` | Only letters and spaces allowed | `/^[A-Za-z\s]+$/`              |
| `"number"` | Only numeric characters allowed | `/^[0-9]+$/`                   |
| `"email"`  | Standard email format           | `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` |

These types can be declared in the JSON via: `"customValidation"`: `"string"`  

If both `customValidation` and `regex` are provided, both are applied — `customValidation` is executed first, followed by `regex`.

## Example with Multiple Validations

<details>
<summary>Click to view JSON configuration</summary>

```json
{
  "type": "text",
  "label": "First Name",
  "name": "firstName",
  "validation": {
    "required": "First name is required",
    "minLength": { "value": 2, "message": "Must be at least 2 characters" },
    "customValidation": "string"
  }
}
```
</details>

## Example with Regex

<details>
<summary>Click to view JSON configuration</summary>

```json
{
  "type": "text",
  "label": "Postal Code",
  "name": "postalcode",
  "validation": {
    "required": "Postal Code is required",
    "regex": {
      "value": "^[A-Z]{3}[0-9]{3}$",
      "message": "Must be in format AAA999"
    }
  }
}
```
</details>

# Mock API JSON Schema

This schema defines a dynamic form structure that supports manual input fields, grouped fields, validation rules, and auto-filling data from APIs triggered by specific inputs.  

## Text Fields  
Simple text input fields for user interaction.  
### Properties:  

- **type**: `"text"` - Defines the field as a text input.
- **label**: User-facing name displayed for the field.
- **name**: Unique identifier for the field.
- **validation** (optional): Rules to enforce required input or other constraints.

```plaintext
{
  "type": "text",
  "label": "User ID",
  "name": "userId",
  "validation": { "required": "User ID is required" }
}
```

## Group Fields

Groups multiple related fields under a labeled section with support for API-triggered auto-filling of nested fields.

### Properties

- **type**: `"group"` - Defines the field as a group.
- **label**: Section name displayed to the user.
- **name**: Unique identifier for the group.
- **apiTrigger**: List of field names whose values trigger the API call.
- **apiAutoFill**: Mapping of API response fields to the group's nested field names.
- **fields**: Array of nested field definitions.

```plaintext
{
  "type": "group",
  "label": "User Info (Auto-Filled)",
  "name": "userInfo",
  "apiTrigger": ["userId", "token"],
  "apiAutoFill": {
    "firstName": "firstName",
    "lastName": "lastName",
    "email": "email",
    "role": "role"
  },
  "fields": [
    { "type": "text", "label": "First Name", "name": "firstName" },
    { "type": "text", "label": "Last Name", "name": "lastName" },
    { "type": "text", "label": "Email", "name": "email" },
    { "type": "text", "label": "Role", "name": "role" }
  ]
}
```

## Auto-Fill

When all fields in a group's `apiTrigger` array have values, an API call is triggered. The API response fields mapped in `apiAutoFill` are automatically populated into the corresponding nested fields of the group, enabling dynamic data population without manual entry.

## Validation

Each field may include a `validation` object defining rules, such as `"required"` or others like `""customValidation": "string""`, `""customValidation": "number""`, `""customValidation": "email""` or even a regex.


## JSON schema configuration

The fields will be populated after 2 seconds (simulating a real API call), if you use **userId** and **orderId** from **1 to 3**. Above 3 will throw a form error and fields will be cleared.  

<details>
<summary>Click to view JSON configuration</summary>

```json
{
  "fields": [
    {
      "type": "text",
      "label": "User ID",
      "name": "userId",
      "validation": { "required": "User ID is required" }
    },
    {
      "type": "text",
      "label": "Token",
      "name": "token",
      "validation": { "required": "Token is required" }
    },
    {
      "type": "group",
      "label": "User Info (Auto-Filled)",
      "name": "userInfo",
      "apiTrigger": ["userId", "token"],
      "apiAutoFill": {
        "firstName": "firstName",
        "lastName": "lastName",
        "email": "email",
        "role": "role"
      },
      "fields": [
        {
          "type": "text",
          "label": "First Name",
          "name": "firstName"
        },
        {
          "type": "text",
          "label": "Last Name",
          "name": "lastName"
        },
        {
          "type": "text",
          "label": "Email",
          "name": "email"
        },
        {
          "type": "text",
          "label": "Role",
          "name": "role"
        }
      ]
    },
    {
      "type": "text",
      "label": "Order ID",
      "name": "orderId",
      "validation": { "required": "Order ID is required" }
    },
    {
      "type": "group",
      "label": "Order Info (Auto-Filled)",
      "name": "orderInfo",
      "apiTrigger": ["orderId"],
      "apiAutoFill": {
        "product": "product",
        "quantity": "quantity",
        "status": "status"
      },
      "fields": [
        {
          "type": "text",
          "label": "Product",
          "name": "product"
        },
        {
          "type": "text",
          "label": "Quantity",
          "name": "quantity"
        },
        {
          "type": "text",
          "label": "Status",
          "name": "status"
        }
      ]
    }
  ]
}
```
</details>

# Examples
Check the console in the browser for an output.

## Example with all validators
<details>
<summary>Click to view JSON configuration</summary>

```json
{
  "fields": [
    {
      "type": "dropdown",
      "label": "User Type",
      "name": "userType",
        "options": [
   	{ "label": "Person", "value": "Person" },
    	{ "label": "Business", "value": "Business" }
      ],
      "validation": {
        "required": "User type is required"
      }
    },
    {
      "type": "group",
      "label": "Personal Info",
      "visibleIf": { "field": "userType", "value": "Person" },
      "fields": [
        {
          "type": "text",
          "label": "First Name",
          "name": "firstName",
          "validation": {
            "required": "First name is required",
            "minLength": { "value": 2, "message": "Must be at least 2 characters" },
            "customValidation": "string"
          }
        },
        {
          "type": "text",
          "label": "Last Name",
          "name": "lastName",
          "validation": {
            "required": "First name is required",
            "maxLength": { "value": 6, "message": "Maximum allowed characters is 6" },
	    "customValidation": "string"
          }
        },
        {
          "type": "text",
          "label": "Age",
          "name": "age",
          "validation": {
            "required": "Age is required",
	        "customValidation": "number"
          }
        },
        {
          "type": "radio",
          "label": "Gender",
          "name": "gender",
          "options": [
   	       { "label": "Male", "value": "Male" },
    	   { "label": "Female", "value": "Female" }
        ],
          "validation": {
            "required": "Please select a gender"
          }
        },
        {
          "type": "text",
          "label": "Postal Code",
          "name": "postalcode",
          "validation": {
            "required": "Postal Code is required",
            "regex": {
    	    "value": "^[A-Z]{3}[0-9]{3}$",
            "message": "Must be in format AAA999"
  	    }
          }
        },
        {
          "type": "text",
          "label": "Email",
          "name": "email",
          "validation": {
            "required": "Email is required",
            "customValidation": "email"
          }
        }
      ]
    },
    {
      "type": "group",
      "label": "Business Info",
      "visibleIf": { "field": "userType", "value": "Business" },
      "fields": [
        {
          "type": "text",
          "label": "Company Name",
          "name": "companyName",
          "validation": {
            "required": "Company name is required"
          }
        },
        {
          "type": "textarea",
          "label": "Company Description",
          "name": "companyDescription"
        },
        {
          "type": "checkbox",
          "label": "Is this a registered business?",
          "name": "isRegistered",
          "validation": {
            "required": "This checkbox is required"
          }
        },
        {
          "type": "dropdown",
          "label": "Industry",
          "name": "industry",
        "options": [
   	{ "label": "Tech", "value": "tech" },
    	{ "label": "Finance", "value": "finance" }
      ],
          "validation": {
            "required": "Industry is required"
          }
        }
      ]
    }    
  ]
}
```
</details>

## Example with auto-fill from mockApi

<details>
<summary>Click to view JSON configuration</summary>

```json
{
  "fields": [
    {
      "type": "text",
      "label": "User ID",
      "name": "userId",
      "validation": { "required": "User ID is required" }
    },
    {
      "type": "text",
      "label": "Token",
      "name": "token",
      "validation": { "required": "Token is required" }
    },
    {
      "type": "group",
      "label": "User Info (Auto-Filled)",
      "name": "userInfo",
      "apiTrigger": ["userId", "token"],
      "apiAutoFill": {
        "firstName": "firstName",
        "lastName": "lastName",
        "email": "email",
        "role": "role"
      },
      "fields": [
        {
          "type": "text",
          "label": "First Name",
          "name": "firstName"
        },
        {
          "type": "text",
          "label": "Last Name",
          "name": "lastName"
        },
        {
          "type": "text",
          "label": "Email",
          "name": "email"
        },
        {
          "type": "text",
          "label": "Role",
          "name": "role"
        }
      ]
    },
    {
      "type": "text",
      "label": "Order ID",
      "name": "orderId",
      "validation": { "required": "Order ID is required" }
    },
    {
      "type": "group",
      "label": "Order Info (Auto-Filled)",
      "name": "orderInfo",
      "apiTrigger": ["orderId"],
      "apiAutoFill": {
        "product": "product",
        "quantity": "quantity",
        "status": "status"
      },
      "fields": [
        {
          "type": "text",
          "label": "Product",
          "name": "product"
        },
        {
          "type": "text",
          "label": "Quantity",
          "name": "quantity"
        },
        {
          "type": "text",
          "label": "Status",
          "name": "status"
        }
      ]
    }
  ]
}
```
</details>

# Unit tests

The project includes unit tests covering the core functionality. They are implemented using `React Testing Library` and `Jest` to ensure robust and maintainable form behavior.

* Form Generator tests - Validate rendering of input fields and buttons, error handling for empty input, and dynamic form generation from valid JSON schema.
* API mock tests - Verify the behavior of the `mockApiCall` function for various valid inputs and error cases.
* Validation helper tests - Ensure custom validation logic works correctly for email, string-only, number-only, and regex-based rules.  

The tests can be started with:  
npm test  or yarn test