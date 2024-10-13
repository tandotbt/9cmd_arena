const URL_API_9CMD_LIST = ["https://api-1.9cmd.top", "https://api-2.9cmd.top", "https://api-3.9cmd.top"]
const URL_API_9CMD = URL_API_9CMD_LIST[Math.floor(Math.random() * URL_API_9CMD_LIST.length)]
const SERVER_PLANET_USE = "heimdall"
const url_9capi_sim = "https://api.9capi.com/arenaSimHeimdall"
const url_ares_sim = `https://mimir.nine-chronicles.dev/${SERVER_PLANET_USE}/arena/simulate`
const URL_9CSCAN = "https://api-heimdall.9cscan.com";
const url_9capi_leadboard = "https://api.9capi.com/arenaLeaderboardHeimdall";
const url_jsonblod_data_arena_2 = "https://jsonblob.com/api/1194537739986264064";
const url_jsonblod_leadboard_2 = "https://jsonblob.com/api/1194537894173073408";
const url_jsonblod_time_block = "https://jsonblob.com/api/1194552651059945472";
const url_jsonblod_all_pre_round = "https://jsonblob.com/api/1210620266811351040";
// const url_jsonblod_time_block = `${URL_API_9CMD}/arenaTime?network=${SERVER_PLANET_USE}`;
const url_jsonblod_message = "https://jsonblob.com/api/1193628388912128000";
const urls_node = [
  "https://heimdall-rpc-1.nine-chronicles.com/graphql",
  "https://heimdall-rpc-2.nine-chronicles.com/graphql"
];
const URL_9CSCAN_WEB = "https://heimdall.9cscan.com"
const CHECK_SUCCESS_ARENA_ATTACK = "battle_arena15";
const URL_NODE_USE = urls_node[Math.floor(Math.random() * urls_node.length)];
const URL_NODE_ARENA_USE = "https://heimdall-arena.9c.gg/graphql";
const URL_MIMIR_GRAPHQL = `https://mimir.nine-chronicles.dev/${SERVER_PLANET_USE}/graphql`;
const BLOCK_WARNING = 150