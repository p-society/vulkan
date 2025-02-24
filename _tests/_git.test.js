import GitManager from "../_fetcher/Git.js";
import path from 'node:path';
import fs from "node:fs";

async function runTests() {
    await testClone();
}

async function testClone() {
    try {
        const CLONE_PATH = path.join(process.cwd(), 'MOCK_TARGET');
        const gitManager = new GitManager("https://github.com/p-society/vulkan/");
        await gitManager.pullRepository("dev", CLONE_PATH);
        console.log("✅ Clone and pull successful");
        fs.rm(CLONE_PATH, { recursive: true, force: true }, () => console.log(`✅ Cleanup done!`));
    } catch (e) {
        console.error("❌ Test failed:", e.message);
    }
}

runTests();
