import ETHEREUM from '@/assets/img/network/eth.svg'

export const getNetworkImg = (name: string, light?: boolean) => {
  if (!name) {
    return ''
  }
  const _name = name.toLowerCase().trim().replace(/ +/g, '')
  if (includes(_name, ['ethereum', 'goerli'])) {
    return ETHEREUM
  }
}

const includes = (name: string, area: string[]) => {
  for (const i in area) {
    if (name.includes(area[i])) {
      return true
    }
  }
  return false
}
