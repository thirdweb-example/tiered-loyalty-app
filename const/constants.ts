import { Mumbai, Chain } from '@thirdweb-dev/chains'

// your token bound factory address
export const factoryAddress: string = '0x02101dfB77FDE026414827Fdc604ddAF224F0921'
export const implementation: string = '0xa786cF1e3245C792474c5cc7C23213fa2c111A95'

// Your thirdweb api key - you can get one at https://thirdweb.com/dashboard/api-keys
export const TWApiKey: string = process.env.NEXT_PUBLIC_CLIENT_ID as string;
export const activeChain: Chain = Mumbai

export const nftDropAddress: string = '0x7c7F84b831Ab97d7C2D3fF6385B22D1762baCA36'
export const tokenAddress: string = '0x4aFB7b3A277738F1991D8bC6057a9C7Fb5572c69'
