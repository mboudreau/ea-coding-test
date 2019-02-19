import {CarsApi, CarShow} from "../swagger/api";
import {sortBy} from "lodash";

class Cars {
	private readonly api: CarsApi;

	constructor() {
		this.api = new CarsApi("http://eacodingtest.digital.energyaustralia.com.au");
	}

	public async listByShows(): Promise<CarShow[]> {
		return (await this.api.APICarsGet()).body;
	}

	public async GroupByMake(): Promise<MakeDictionary> {
		const shows = await this.listByShows();
		const makeDict: MakeDictionary = {};

		shows.forEach((show) => {
			show.cars.forEach((car) => {
				if (!makeDict[car.make]) {
					makeDict[car.make] = {};
				}
				if (!makeDict[car.make][car.model]) {
					makeDict[car.make][car.model] = [];
				}

				makeDict[car.make][car.model].push(show.name);
			});
		});

		return makeDict;
	}

	public async GroupByMakeAlphabetical(): Promise<Make[]> {
		const makeDict = await this.GroupByMake();
		const sortedKeys = sortBy(Object.keys(makeDict));
		return sortedKeys.map((key) => ({name: key, models: makeDict[key]}));
	}
}

interface MakeDictionary {
	[make: string]: { [model: string]: string[] };
}

interface Make {
	name: string;
	models: { [model: string]: string[] };
}

export default new Cars();
