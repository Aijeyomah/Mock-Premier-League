import 'dotenv/config';

const test = {
    APP_PORT: process.env.JETTI_APP_PORT,
    JETTI_VENDOR_SUBMISSION_URL: process.env.JETTI_VENDOR_SUBMISSION_URL,
    JETTI_CUSTOMER_UUID_URL: process.env.JETTI_CUSTOMER_UUID_URL,
    JETTI_SALES_URL: process.env.JETTI_SALES_URL,
    JETTI_BEARER_TOKEN: process.env.JETTI_BEARER_TOKEN
};

export default test;