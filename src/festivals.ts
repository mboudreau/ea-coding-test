import {FestivalsApi, MusicFestival} from "../swagger/api";
import {sortBy} from "lodash";
import * as Bluebird from "bluebird";
const UNKNOWN = "unknown";

export class Festivals {
	private readonly api: FestivalsApi;

	constructor(api?:FestivalsApi) {
		this.api = api || new FestivalsApi(/*"http://eacodingtest.digital.energyaustralia.com.au"*/"http://localhost:3000");
	}

	public async listByFestival(): Bluebird<MusicFestival[]> {
		try {
			return (await this.api.APIFestivalsGet()).body;
		}catch(err) {
			return Bluebird.reject(`API returned status ${err.response.statusCode}`);
		}
	}

	public async groupByRecordLabel(): Bluebird<RecordLabelDictionary> {
		const festivals = await this.listByFestival();
		const recordLabelDictionary: RecordLabelDictionary = {};

		festivals.forEach((festival) => {
			const festivalName = festival.name || UNKNOWN;
			(festival.bands || []).forEach((band) => {
				const name = band.name || UNKNOWN;
				const label = band.recordLabel || UNKNOWN;
				if (!recordLabelDictionary[label]) {
					recordLabelDictionary[label] = {};
				}
				if (!recordLabelDictionary[label][name]) {
					recordLabelDictionary[label][name] = [];
				}

				recordLabelDictionary[label][name].push(festivalName);
			});
		});

		return recordLabelDictionary;
	}

	public async groupByRecordLabelAlphabetical(): Bluebird<RecordLabel[]> {
		const recordLabelDictionary = await this.groupByRecordLabel();
		const sortedKeys = sortBy(Object.keys(recordLabelDictionary));
		return sortedKeys.map((key) => ({name: key, bands: recordLabelDictionary[key]}));
	}
}

interface RecordLabelDictionary {
	[label: string]: { [band: string]: string[] };
}

interface RecordLabel {
	name: string;
	bands: { [band: string]: string[] };
}

export default new Festivals();
