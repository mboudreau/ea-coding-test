import * as cli from "caporal";
import cars from "./src/festivals";
const pkg = require("./package.json");

cli
	.name("bands")
	.bin("bands")
	.description("EA Coding Test - Festivals program")
	.version(pkg.version);

cli
	.command("list", "List bands by record label, alphabetically, showing which event it attended")
	.action(() => {
		cars.groupByRecordLabelAlphabetical().then((recordLabels) => {
				if(recordLabels.length === 0) {
					console.log("No bands returned, please try again later.");
					return;
				}

				console.log("Listing via band record label, alphabetically sorted: ");
				recordLabels.forEach((recordLabel) => {
					console.log(`${recordLabel.name}`);
					for (let band in recordLabel.bands) {
						console.log(`\t${band}`);
						recordLabel.bands[band].forEach((festival) => console.log(`\t\t${festival}`));
					}
				})
			},
			(err:string) => console.error(`Cannot list bands, please try again later: ${err}`)
		);
	});

cli.parse(process.argv);
