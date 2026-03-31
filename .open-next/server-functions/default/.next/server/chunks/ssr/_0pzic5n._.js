module.exports=[50640,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"InvariantError",{enumerable:!0,get:function(){return d}});class d extends Error{constructor(a,b){super(`Invariant: ${a.endsWith(".")?a:a+"."} This is a bug in Next.js.`,b),this.name="InvariantError"}}},48322,2424,a=>{"use strict";let b=Symbol.for("__cloudflare-context__");function c(a={async:!1}){return a.async?e():function(){let a=d();if(a)return a;if(function(){let a=globalThis;return a.__NEXT_DATA__?.nextExport===!0}())throw Error("  - make sure that the call is not at the top level and that the route is not static\n  - call `getCloudflareContext({async: true})` to use the `async` mode\n  - avoid calling `getCloudflareContext` in the route\n");throw Error(g)}()}function d(){return globalThis[b]}async function e(){let a=d();if(a)return a;{var c;let a=await f();return c=a,globalThis[b]=c,a}}async function f(a){let{getPlatformProxy:b}=await import(`${"__wrangler".replaceAll("_","")}`),c=a?.environment??process.env.NEXT_DEV_WRANGLER_ENV,{env:d,cf:e,ctx:f}=await b({...a,envFiles:[],environment:c});return{env:d,cf:e,ctx:f}}let g=`

ERROR: \`getCloudflareContext\` has been called without having called \`initOpenNextCloudflareForDev\` from the Next.js config file.
You should update your Next.js config file as shown below:

   \`\`\`
   // next.config.mjs

   import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

   initOpenNextCloudflareForDev();

   const nextConfig = { ... };
   export default nextConfig;
   \`\`\`

`;async function h(){let a=await c();if(!a||!a.env||!a.env.DB)throw Error("Cloudflare D1 binding (DB) not found in request context.");return a.env.DB}a.s(["getCloudflareContext",0,c],2424);let i={health:{label:"Health & Wellness",color:"health",emoji:"🌿",affiliate:{name:"Healthkart",url:"https://www.healthkart.com",desc:"Shop quality supplements, protein, and wellness products."}},tech:{label:"AI & Tech",color:"tech",emoji:"🤖",affiliate:{name:"Hostinger",url:"https://www.hostinger.in",desc:"Get reliable web hosting starting at just Rs 69/month."}},finance:{label:"Personal Finance",color:"finance",emoji:"💰",affiliate:{name:"Groww",url:"https://groww.in",desc:"Start investing in stocks, mutual funds, and more."}},student:{label:"Student Life",color:"student",emoji:"📚",affiliate:{name:"Coursera",url:"https://www.coursera.org",desc:"Learn from top universities with free and paid courses."}},business:{label:"Micro Business",color:"business",emoji:"🚀",affiliate:{name:"Razorpay",url:"https://razorpay.com",desc:"Accept payments online with India's best payment gateway."}},eco:{label:"Eco Living",color:"eco",emoji:"🌱",affiliate:{name:"Amazon",url:"https://www.amazon.in",desc:"Shop eco-friendly and sustainable products on Amazon."}}},j=Object.keys(i);a.s(["CATEGORIES",0,j,"CATEGORY_CONFIG",0,i,"getDB",0,h,"safeImageUrl",0,function(a){if(!a)return null;try{let b=new URL(a);if("http:"===b.protocol||"https:"===b.protocol)return a}catch{}return null}],48322)},14738,a=>{"use strict";var b=a.i(47338);a.s([],75216),a.i(75216),a.s(["407701bfadb4584cb4c351515af3ef6482bcfbed00",()=>b.updatePostAction,"60baaf42c94637d4635fd075be1de40a304cc5be87",()=>b.verifyEditKey],14738)}];

//# sourceMappingURL=_0pzic5n._.js.map