const worker = new Worker("./scripts/workers/forecastWorker.js", { type: "module" });
worker.onmessage = (event) => {
    if (event.data.type === "complete") {
        console.log('Database initialized.');
    }
    else if (event.data.type === "error") {
        console.log('Initialization failed: ', event.data.message);
    }
};
worker.postMessage({ type: 'initialize' });