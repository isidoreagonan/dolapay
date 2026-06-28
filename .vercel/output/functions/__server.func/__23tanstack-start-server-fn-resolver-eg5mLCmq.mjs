//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-eg5mLCmq.js
var manifest = {
	"158d1a193e9456320172cc4afc4fd4556dd54feb0dd0023dccdfb9908fb9b113": {
		functionName: "createDiditSession_createServerFn_handler",
		importer: () => import("./_ssr/didit.functions-Du9YDScL.mjs")
	},
	"bc1fbc72782a474d5433f616a4abde91c6aac9166ee6d24136736461cb39a2bb": {
		functionName: "markRepresentativeSimVerified_createServerFn_handler",
		importer: () => import("./_ssr/didit.functions-Du9YDScL.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
