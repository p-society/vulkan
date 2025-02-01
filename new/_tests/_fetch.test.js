import Fetch from "../_fetcher/Fetch.js";
import path from "path";

async function runTests() {
    testInvalidURLScheme();
    testValidGithubURL();
    testNonStringURL();
    await testfetchTargetRepository();
}

function testInvalidURLScheme() {
    try {
        new Fetch("ht1tps1://github.co1m/p-society/vulkan/");
        console.log("❌ testInvalidURLScheme failed: No error thrown");
    } catch (e) {
        if (e.message === "Not a valid Github URI!") {
            console.log("✅ testInvalidURLScheme passed");
        } else {
            console.log("❌ testInvalidURLScheme failed:", e.message);
        }
    }
}

function testValidGithubURL() {
    try {
        new Fetch("https://github.com/p-society/vulkan/");
        console.log("✅ testValidGithubURL passed");
    } catch (e) {
        console.log("❌ testValidGithubURL failed:", e.message);
    }
}

function testNonStringURL() {
    try {
        new Fetch(12345);
        console.log("❌ testNonStringURL failed: No error thrown");
    } catch (e) {
        if (e.message === "Not a valid Github URI!") {
            console.log("✅ testNonStringURL passed");
        } else {
            console.log("❌ testNonStringURL failed:", e.message);
        }
    }
}

async function testfetchTargetRepository() {
    try {
        const CLONE_PATH = path.join(process.cwd(), 'MOCK_FETCH');
        const fetch = new Fetch("https://github.com/p-society/vulkan/");
        await fetch.fetchTargetRepository(`dev`, CLONE_PATH);
        console.log("✅ testfetchTargetRepository passed");
    } catch (e) {
        console.log("❌ testfetchTargetRepository failed:", e.message);
    }
}

runTests();
