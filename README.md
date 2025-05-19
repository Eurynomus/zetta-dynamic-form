# zetta-dynamic-form

A dynamic form builder built with **React**, **TypeScript**, **Material UI**, **Jest** and **React Hook Form**.

# Introduction

This project allows you to generate interactive, configurable forms from a simple JSON schema. It supports a wide range of input types, nested groups, dynamic validation, conditional visibility, and even mock API-based auto-filling.


# Features

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

# How It Works

At the top of the page, there’s an input box where you can paste a JSON schema that describes your form.

When the JSON is valid:
* As soon as a valid schema is provided, the form renders dynamically.
* A “Reset Form” button is available to reset the schema input and start fresh.
* Mock API calls are triggered where applicable to auto-fill fields.
* On submit the filled values are output as a structured JSON object — preserving the hierarchy of nested groups and field dependencies.  

When the JSON is not valid:
* Throws an error for invalid JSON format.

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