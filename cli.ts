import * as cli from "caporal";
import cars from "./src/cars";
const pkg = require("./package.json");

cli
	.name("cars")
	.bin("cars")
	.description("EA Coding Test - Car program")
	.version(pkg.version);

cli
	.command("list", "List cars by model, alphabetically, showing which event it attended")
	.action(() => {
		cars.groupByMakeAlphabetical().then((makes) => {
				if(makes.length === 0) {
					console.log("No cars returned, please try again later.");
					return;
				}

				console.log("Listing via car Make, alphabetically sorted: ");
				makes.forEach((make) => {
					console.log(`${make.name}`);
					for (let model in make.models) {
						console.log(`\t${model}`);
						make.models[model].forEach((show) => console.log(`\t\t${show}`));
					}
				})
			},
			(err:string) => console.error(`Cannot list cars, please try again later: ${err}`)
		);
	});

cli.parse(process.argv);
