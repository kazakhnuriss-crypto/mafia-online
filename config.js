
const client = new Appwrite.Client();

client
  .setEndpoint("https://nyc.cloud.appwrite.io/v1")
  .setProject("6aeda05d001946b2dbe1");

const tablesDB = new Appwrite.TablesDB(client);

window.mafiaAppwrite = {
  client: client,
  tablesDB: tablesDB,
  databaseId: "6aeda6dd002aa748d406",
  tableId: "rooms"
};

console.log("Mafia Appwrite connected!");
