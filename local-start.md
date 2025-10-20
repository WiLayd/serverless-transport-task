# 🚀 Local Development Setup

Follow these steps to configure and run the project on your local machine.

## 1. Prerequisites

Before you start, you need to configure your environment.

### Configure AWS Credentials
Make sure you have the AWS CLI installed and configured with your credentials. The simplest way is to run `aws configure` in your terminal and provide your **Access Key ID** and **Secret Access Key**.

This is necessary for `serverless-offline` to interact with your local DynamoDB instance and for the application to access SSM parameters.

### Get Fixer.io API Key
Sign up or log in to [Fixer.io](https://fixer.io/) to get your free API key.

### Set Up Environment Variables
You have two options for providing the `FIXER_API_KEY` to the application.

* **Option A (Recommended for local setup): Using a `.env` file**
    * Create a file named `.env` in the root of the project.
    * Add your API key to this file:
        ```
        FIXER_API_KEY=your_fixer_api_key_here
        ```
    * Make sure `.env` is listed in your `.gitignore` file to avoid committing secrets.

* **Option B (Using AWS SSM)**
    * If you prefer to test the AWS integration locally, add the API key to AWS Systems Manager (SSM) Parameter Store.
    * Use the following path for the parameter name: `serverless-framework/keiki-transport/fixer-api-key`
    * Set the type to `SecureString`.

---

## 2. Running the Application

Once the prerequisites are met, run these commands in order from the project's root directory.

### 1. Install Dependencies
```bash
npm install

npm run docs:generate

npm run db:seed

npm run start
```