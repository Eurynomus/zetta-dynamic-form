# zetta-dynamic-form

A dynamic form builder built with **React**, **TypeScript**, **Material UI**, and **Jest**.

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

1. Clone repository
https://github.com/Eurynomus/zetta-dynamic-form.git
cd zetta-dynamic-form

2. Install dependencies
npm install
# or
yarn

3. Start the development server
npm run dev
# or
yarn

## How It Works

At the top of the page, there’s an input box where you can paste a JSON schema that describes your form.

When the JSON is valid:
* As soon as a valid schema is provided, the form renders dynamically.
* A “Reset Form” button is available to reset the schema input and start fresh.
* Mock API calls are triggered where applicable to auto-fill fields.