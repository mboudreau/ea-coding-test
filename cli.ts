import * as cli from "caporal";

const pkg = require("./package.json");

import cars from "./src/cars";

cli
	.name("cars")
	.bin("cars")
	.description("EA Coding Test - Car program")
	.version(pkg.version);

cli
	.command("list", "List cars by model, alphabetically, showing which event it attended")
	.action((args: any) => {
		console.log("Listing via Make, alphabetically sorted: ");
		cars.GroupByMakeAlphabetical().then((makes) =>
			makes.forEach((make) => {
				console.log(`${make.name}`);
				for (let model in make.models) {
					console.log(`\t${model}`);
					make.models[model].forEach((show) => console.log(`\t\t${show}`));
				}
			})
		);

	});

cli.parse(process.argv);
