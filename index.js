import { Wallet } from 'ethers'
import { readFileSync } from 'fs'
import http from 'redaxios'

const extractPrivateKeys = () => {
    return readFileSync('privateKeys.txt').toString().split(/\r?\n/)
}

const message = 'This is a sybil address'
;(async () => {
    const privateKeys = extractPrivateKeys()

    for (const privateKey of privateKeys) {
        try {
            const wallet = new Wallet(privateKey)
            console.log('Press F to pay respect for: ', wallet.address)

            const signature = await wallet.signMessage(message)

            await http.post('https://sybil.layerzero.network/api/report', {
                chainType: 'evm',
                signature,
                message,
                address: wallet.address,
            })

            console.log('F', wallet.address)
        } catch (e) {
            console.error("Couldn't report address: ", e.statusText)
        }
    }

    console.log(
        'You folded your cards. But Bryan had a 6 and 8 of different suits in his hand.'
    )
})()
