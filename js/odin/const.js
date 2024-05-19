const URL_API_9CMD_LIST = ["https://api-1.9cmd.top", "https://api-2.9cmd.top", "https://api-3.9cmd.top"]
const URL_API_9CMD = URL_API_9CMD_LIST[Math.floor(Math.random() * URL_API_9CMD_LIST.length)]
const SERVER_PLANET_USE = "odin"
const url_9capi_sim = "https://api.9capi.com/arenaSimOdin"
const url_ares_sim = ""
const URL_9CSCAN = "https://api.9cscan.com";
const url_9capi_leadboard = "https://api.9capi.com/arenaLeaderboardOdin"
const url_jsonblod_data_arena_2 = "https://jsonblob.com/api/1194521453235396608";
const url_jsonblod_leadboard_2 = "https://jsonblob.com/api/1194537532422742016";
// const url_jsonblod_time_block = "https://jsonblob.com/api/1194552728394522624";
const url_jsonblod_time_block = `${URL_API_9CMD}/arenaTime?network=${SERVER_PLANET_USE}`;
const url_jsonblod_message = "https://jsonblob.com/api/1193642586002022400";
const urls_node = [
  "https://odin-rpc-1.nine-chronicles.com/graphql",
  "https://odin-rpc-2.nine-chronicles.com/graphql"
];
const URL_9CSCAN_WEB = "https://9cscan.com"
const CHECK_SUCCESS_ARENA_ATTACK = "battle_arena15";
const URL_NODE_USE = urls_node[Math.floor(Math.random() * urls_node.length)];
const BLOCK_WARNING = 150