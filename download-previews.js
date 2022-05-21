const fs = require("fs/promises");
let fetch = import("node-fetch");

async function main() {
    fetch = (await fetch).default;
    try {
        await fs.readdir("data/img");
    } catch (e) {
        await fs.mkdir("data/img");
    }

    let combined_data = JSON.parse(await fs.readFile("data/combined.json", "utf-8"));
    


    
    let counter = 0;
    const total = combined_data.data.length;
    await Promise.all(combined_data.data.map(async (bolig) => {
        console.log(bolig.image_link);
        let image_buffer = Buffer.from(await (
            await fetch(bolig.image_link)
        ).arrayBuffer());

        await fs.writeFile(`data/img/bolig-${bolig.id}.jfif`, image_buffer);

        console.log(`${++counter}/${total}`);
    }))
}

main();
