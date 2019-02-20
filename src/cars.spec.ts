import * as chai from "chai";
import * as Bluebird from "bluebird";
import * as http from "http";
import {CarsApi, CarShow} from "../swagger/api";
import * as net from "net";
import {Cars} from "./cars";
import * as chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);
const expect = chai.expect;

// Needs to stay a function and not an arrow function to access mocha 'this' context
describe("Cars", () => {
	let api: CarsApi;
	let cars: Cars;
	const mockedData: { response: http.IncomingMessage, body: CarShow[] } = {
		response: new http.IncomingMessage(new net.Socket()),
		body: [
			{
				"name": "New York Car Show",
				"cars": [
					{
						"make": "Julio Mechannica",
						"model": "Mark 1"
					},
					{
						"make": "Moto Tourismo",
						"model": "Cyclissimo"
					},
					{
						"make": "Hondaka",
						"model": "Elisa"
					}
				]
			},
			{
				"name": "Melbourne Motor Show",
				"cars": [
					{
						"make": "Julio Mechannica",
						"model": "Mark 4S"
					},
					{
						"make": "Hondaka",
						"model": "Elisa"
					}
				]
			}
		] as CarShow[]
	};

	before(() => {
		api = new CarsApi();
		// Set mock data to return HTTP 200 status
		mockedData.response.statusCode = 200;
		// Override API call to return mocked data
		api.APICarsGet = () => Bluebird.resolve(mockedData);
		cars = new Cars(api);
	});

	it("Should get the mocked data body when calling listByShows", () =>
		expect(cars.listByShows()).to.eventually.deep.equal(mockedData.body)
	);

	it("Should get the mocked data and group them by make in a dictionary", () =>
		expect(cars.groupByMake()).to.eventually.deep.equal({
			"Hondaka": {
				"Elisa": [
					"New York Car Show",
					"Melbourne Motor Show"
				]
			},
			"Julio Mechannica": {
				"Mark 1": [
					"New York Car Show"
				],
				"Mark 4S": [
					"Melbourne Motor Show"
				]
			},
			"Moto Tourismo": {
				"Cyclissimo": [
					"New York Car Show"
				]
			}
		})
	);

	it("Should get the mocked data and group them by make and sort alphabetically based on make", () =>
		expect(cars.groupByMakeAlphabetical()).to.eventually.deep.equal([
			{
				name: "Hondaka",
				models: {
					"Elisa": [
						"New York Car Show",
						"Melbourne Motor Show"
					]
				}
			},
			{
				name: "Julio Mechannica",
				models: {
					"Mark 1": [
						"New York Car Show"
					],
					"Mark 4S": [
						"Melbourne Motor Show"
					]
				}
			},
			{
				name: "Moto Tourismo",
				models: {
					"Cyclissimo": [
						"New York Car Show"
					]
				}
			}
		])
	);
});
