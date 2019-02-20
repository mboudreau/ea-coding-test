import {CarsApi, CarShow} from "../swagger/api";
import {sortBy} from "lodash";
import * as Bluebird from "bluebird";
const UNKNOWN = "unknown";

export class Cars {
	private readonly api: CarsApi;

	constructor(api?:CarsApi) {
		this.api = api || new CarsApi("http://eacodingtest.digital.energyaustralia.com.au");
	}

	public async listByShows(): Bluebird<CarShow[]> {
		try {
			return (await this.api.APICarsGet()).body;
		}catch(err) {
			return Bluebird.reject(`API returned status ${err.response.statusCode}`);
		}
	}

	public async groupByMake(): Bluebird<MakeDictionary> {
		const shows = await this.listByShows();
		const makeDict: MakeDictionary = {};

		shows.forEach((show) => {
			const showName = show.name || UNKNOWN;
			(show.cars || []).forEach((car) => {
				const make = car.make || UNKNOWN;
				const model = car.model || UNKNOWN;
				if (!makeDict[make]) {
					makeDict[make] = {};
				}
				if (!makeDict[make][model]) {
					makeDict[make][model] = [];
				}

				makeDict[make][model].push(showName);
			});
		});

		return makeDict;
	}

	public async groupByMakeAlphabetical(): Bluebird<Make[]> {
		const makeDict = await this.groupByMake();
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
