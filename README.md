# zetta-dynamic-form

A dynamic form builder built with **React**, **TypeScript**, **Material UI**, **Jest** and **React Hook Form**.

## Introduction

This project allows you to generate interactive, configurable forms from a simple JSON schema. It supports a wide range of input types, nested groups, dynamic validation, conditional visibility, and even mock API-based auto-filling.


## Features

✅ Schema-driven form rendering  
✅ Supports input types like text, textarea, dropdown, checkbox, radio  
✅ Nested field groups  
✅ Show/hide logic based on field values  
✅ Custom validation logic  
✅ API-mocked auto-filling  
✅ Clean output: structured JSON of form values  
✅ Fully responsive, component-based UI  
✅ Built-in unit tests  

## Installation

1. Clone repository.  
https://github.com/Eurynomus/zetta-dynamic-form.git  
cd zetta-dynamic-form

2. Install dependencies.  
npm install or yarn

3. Start the development server.  
npm run dev or yarn start

## How It Works

At the top of the page, there’s an input box where you can paste a JSON schema that describes your form.

When the JSON is valid:
* As soon as a valid schema is provided, the form renders dynamically.
* A “Reset Form” button is available to reset the schema input and start fresh.
* Mock API calls are triggered where applicable to auto-fill fields.
* On submit the filled values are output as a structured JSON object — preserving the hierarchy of nested groups and field dependencies.  

When the JSON is not valid:
* Throws an error for invalid JSON format.

## Project Structure

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

## Mock API JSON Schema

This schema defines a dynamic form structure that supports manual input fields, grouped fields, validation rules, and auto-filling data from APIs triggered by specific inputs.  

1. Text Fields  
* Simple text input fields.  
* Properties:  
- type: "text"  
- label: User-facing name of the field.  
- name: Unique identifier for the field.  
- validation (optional): Rules that define required input or other constraints.  

```plaintext
{
  "type": "text",
  "label": "User ID",
  "name": "userId",
  "validation": { "required": "User ID is required" }
}
```

2. Group Fields  
* Group multiple related fields under a labeled section.  
* Support API-triggered auto-filling of their nested fields.  
* Properties:  
- type: "group"  
- label: Section name displayed to the user.  
- name: Unique identifier for the group.  
- apiTrigger: List of field names whose values trigger the API call.  
- apiAutoFill: Mapping of API response fields to the group's nested field names.  
- fields: Array of nested field definitions.  

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

3. Auto-Fill  
* When all fields specified in a group's apiTrigger array have values, the form triggers an API call.  
* The API response fields mapped in apiAutoFill are automatically populated into the corresponding nested fields of the group.  
* This allows dynamic population of related data without manual entry.  

4. Validation  
* Each field may have a validation object defining rules, for example "required".
