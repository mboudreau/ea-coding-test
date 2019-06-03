import * as chai from "chai";
import * as Bluebird from "bluebird";
import * as http from "http";
import {FestivalsApi, MusicFestival} from "../swagger/api";
import * as net from "net";
import {Festivals} from "./festivals";
import * as chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);
const expect = chai.expect;

// Needs to stay a function and not an arrow function to access mocha 'this' context
describe("Festivals", () => {
	let api: FestivalsApi;
	let cars: Festivals;
	const mockedData: { response: http.IncomingMessage, body: MusicFestival[] } = {
		response: new http.IncomingMessage(new net.Socket()),
		body: [
			{
				name: "Warped Tour",
				bands: [
					{
						name: "Beck",
						recordLabel: "Interscope"
					},
					{
						name: "Deftones",
						recordLabel: "Warner Bros. Recording"
					},
					{
						name: "Blink-182"
					}
				]
			},
			{
				name: "Big Day Out",
				bands: [
					{
						name: "Blink-182",
						recordLabel: "Interscope"
					},
					{
						name: "The White Stripes",
						recordLabel: "Third Man Records"
					},
					{
						name: "Red Hot Chili Peppers",
						recordLabel: "Warner Bros. Recording"
					},
					{
						name: "Tame Impala",
						recordLabel: "Warner Bros. Recording"
					}
				]
			},
		] as MusicFestival[]
	};

	before(() => {
		api = new FestivalsApi();
		// Set mock data to return HTTP 200 status
		mockedData.response.statusCode = 200;
		// Override API call to return mocked data
		api.APIFestivalsGet = () => Bluebird.resolve(mockedData);
		cars = new Festivals(api);
	});

	it("Should get the mocked data body when calling listByFestival", () =>
		expect(cars.listByFestival()).to.eventually.deep.equal(mockedData.body)
	);

	it("Should get the mocked data and group them by make in a dictionary", () =>
		expect(cars.groupByRecordLabel()).to.eventually.deep.equal({
			"Interscope": {
				"Beck": [
					"Warped Tour"
				],
				"Blink-182": [
					"Big Day Out"
				]
			},
			"Third Man Records": {
				"The White Stripes": [
					"Big Day Out"
				]
			},
			"Warner Bros. Recording": {
				"Deftones": [
					"Warped Tour"
				],
				"Red Hot Chili Peppers": [
					"Big Day Out"
				],
				"Tame Impala": [
					"Big Day Out"
				]
			},
			"unknown": {
				"Blink-182": [
					"Warped Tour"
				]
			}
		})
	);

	it("Should get the mocked data and group them by make and sort alphabetically based on make", () =>
		expect(cars.groupByRecordLabelAlphabetical()).to.eventually.deep.equal([
			{
				name: "Interscope",
				bands: {
					"Beck": [
						"Warped Tour"
					],
					"Blink-182": [
						"Big Day Out"
					]
				}
			},
			{
				name: "Third Man Records",
				bands: {
					"The White Stripes": [
						"Big Day Out"
					]
				}
			},
			{
				name: "Warner Bros. Recording",
				bands: {
					"Deftones": [
						"Warped Tour"
					],
					"Red Hot Chili Peppers": [
						"Big Day Out"
					],
					"Tame Impala": [
						"Big Day Out"
					]
				}
			},
			{
				name: "unknown",
				bands: {
					"Blink-182": [
						"Warped Tour"
					]
				}
			},
		])
	);
});
